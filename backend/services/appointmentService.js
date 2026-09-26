const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Specialist = require('../models/Specialist');
const Service = require('../models/Service');
const ApiError = require('../utils/ApiError');
const availabilityService = require('./availabilityService');
const notificationService = require('./notificationService');
const emailService = require('./emailService');
const { generateReferenceNumber } = require('../utils/referenceNumber');
const { serializeAppointment } = require('../utils/serializeAppointment');
const {
  timeToMinutes,
  minutesToTime,
  parseCalendarDate,
  isDateInPast,
  hasAppointmentTimePassed,
  escapeRegex,
} = require('../utils/timeHelper');

/**
 * Resolve Patient profile for a user ID
 * @param {String} userId
 * @returns {Promise<Object>}
 */
const getPatientByUserId = async (userId) => {
  const patient = await Patient.findOne({ user: userId });
  if (!patient) {
    throw new ApiError('Patient profile not found for this account', 404);
  }
  return patient;
};

/**
 * Resolve Specialist profile for a user ID
 * @param {String} userId
 * @returns {Promise<Object>}
 */
const getSpecialistByUserId = async (userId) => {
  const specialist = await Specialist.findOne({ user: userId });
  if (!specialist) {
    throw new ApiError('Specialist profile not found for this account', 404);
  }
  return specialist;
};

/**
 * Book a new appointment for an authenticated patient
 * @param {String} userId - Authenticated user ID (role: 'patient')
 * @param {Object} bookingData - { specialistId, serviceId, date, startTime, patientName, patientEmail, patientPhone, patientNotes }
 */
const createAppointment = async (userId, bookingData) => {
  // 1. Resolve Patient profile
  const patient = await getPatientByUserId(userId);

  // 2. Validate Specialist is active and publicly visible
  const specialist = await Specialist.findById(bookingData.specialistId).populate(
    'user',
    'status'
  );
  if (!specialist || !specialist.isVisible || specialist.user?.status !== 'active') {
    throw new ApiError('The requested specialist is not available for booking', 404);
  }

  // 3. Validate Service belongs to this specialist and is active
  const service = await Service.findOne({
    _id: bookingData.serviceId,
    specialist: specialist._id,
    isActive: true,
  });
  if (!service) {
    throw new ApiError(
      'The selected service is unavailable, inactive, or does not belong to this specialist',
      404
    );
  }

  // 4. Calculate expected end time based on start time + service duration
  const startMinutes = timeToMinutes(bookingData.startTime);
  const endMinutes = startMinutes + service.duration;
  const calculatedEndTime = minutesToTime(endMinutes);

  // 5. Conflict check: Check if any active booking ('pending', 'confirmed') overlaps on this date
  const parsedDate = parseCalendarDate(bookingData.date);
  const activeAppointments = await Appointment.find({
    specialist: specialist._id,
    date: parsedDate,
    status: { $in: ['pending', 'confirmed'] },
  });

  const hasOverlap = activeAppointments.some((existing) => {
    const existStart = timeToMinutes(existing.startTime);
    const existEnd = timeToMinutes(existing.endTime);
    // Overlap condition: requestedStart < existingEnd && requestedEnd > existingStart
    return startMinutes < existEnd && endMinutes > existStart;
  });

  if (hasOverlap) {
    throw new ApiError('The selected appointment time slot is no longer available.', 409);
  }

  // 6. Re-check slot against availability engine (weekday working hours, breaks, blocked dates, past dates)
  const availableSlotsResult = await availabilityService.getAvailableSlots(
    specialist._id.toString(),
    bookingData.date,
    service._id.toString()
  );

  const isValidSlot = availableSlotsResult.slots.some(
    (s) => s.startTime === bookingData.startTime && s.endTime === calculatedEndTime
  );

  if (!isValidSlot) {
    throw new ApiError(
      'The requested appointment time slot is outside the specialist working hours, overlaps a scheduled break, or falls on a blocked/past date',
      400
    );
  }

  // 7. Create Appointment document with reference number collision retry
  let appointment;
  let attempts = 0;
  const maxAttempts = 3;

  while (!appointment && attempts < maxAttempts) {
    attempts++;
    const referenceNumber = generateReferenceNumber(bookingData.date);

    try {
      appointment = await Appointment.create({
        patient: patient._id,
        specialist: specialist._id,
        service: service._id,
        date: parsedDate,
        startTime: bookingData.startTime,
        endTime: calculatedEndTime,
        patientName: bookingData.patientName.trim(),
        patientEmail: bookingData.patientEmail.toLowerCase().trim(),
        patientPhone: bookingData.patientPhone.trim(),
        patientNotes: bookingData.patientNotes ? bookingData.patientNotes.trim() : '',
        status: 'confirmed',
        referenceNumber,
      });
    } catch (err) {
      if (err.code === 11000 && attempts < maxAttempts) {
        // Retry with a new reference number if duplicate key collision occurred
        continue;
      }
      throw err;
    }
  }

  if (!appointment) {
    throw new ApiError('Failed to generate a unique appointment reference. Please try again.', 500);
  }

  // Populate references for complete response
  await appointment.populate([
    { path: 'specialist', populate: { path: 'user', select: 'firstName lastName email' } },
    { path: 'service' },
  ]);

  // Dispatch in-app notifications & emails (safely)
  try {
    await notificationService.createAppointmentNotifications('appointment_created', appointment);
  } catch (err) {
    console.error('[Notification] create error:', err.message);
  }

  try {
    await emailService.sendAppointmentBookingEmails(appointment);
  } catch (err) {
    console.error('[Email] booking error:', err.message);
  }

  return serializeAppointment(appointment);
};

/**
 * Cancel an appointment (accessible by either the owning patient or the owning specialist)
 * @param {String} userId - User ID from auth token
 * @param {String} role - 'patient' or 'specialist'
 * @param {String} appointmentId
 * @param {String} reason - Optional cancellation reason
 */
const cancelAppointment = async (userId, role, appointmentId, reason = '') => {
  let query = { _id: appointmentId };

  if (role === 'patient') {
    const patient = await getPatientByUserId(userId);
    query.patient = patient._id;
  } else if (role === 'specialist') {
    const specialist = await getSpecialistByUserId(userId);
    query.specialist = specialist._id;
  } else {
    throw new ApiError('Unauthorized to cancel appointments', 403);
  }

  const appointment = await Appointment.findOne(query);
  if (!appointment) {
    throw new ApiError('Appointment not found or you do not have permission to cancel it', 404);
  }

  // Validate status transitions
  if (appointment.status === 'cancelled') {
    throw new ApiError('This appointment has already been cancelled', 400);
  }
  if (appointment.status === 'completed') {
    throw new ApiError('Completed appointments cannot be cancelled', 400);
  }
  if (appointment.status === 'no_show') {
    throw new ApiError('No-show appointments cannot be cancelled', 400);
  }

  // Update status to cancelled
  appointment.status = 'cancelled';
  appointment.cancellationReason = reason ? reason.trim() : '';
  await appointment.save();

  await appointment.populate([
    { path: 'specialist', populate: { path: 'user', select: 'firstName lastName email' } },
    { path: 'service' },
  ]);

  // Dispatch in-app notifications & emails (safely)
  try {
    await notificationService.createAppointmentNotifications('appointment_cancelled', appointment, {
      cancelledByRole: role,
      reason,
    });
  } catch (err) {
    console.error('[Notification] cancel error:', err.message);
  }

  try {
    await emailService.sendAppointmentCancellationEmail(appointment, role, reason);
  } catch (err) {
    console.error('[Email] cancel error:', err.message);
  }

  return serializeAppointment(appointment);
};

/**
 * Reschedule an appointment to a new date and time (accessible by owning patient or specialist)
 * @param {String} userId
 * @param {String} role
 * @param {String} appointmentId
 * @param {Object} rescheduleData - { date, startTime }
 */
const rescheduleAppointment = async (userId, role, appointmentId, rescheduleData) => {
  let query = { _id: appointmentId };

  if (role === 'patient') {
    const patient = await getPatientByUserId(userId);
    query.patient = patient._id;
  } else if (role === 'specialist') {
    const specialist = await getSpecialistByUserId(userId);
    query.specialist = specialist._id;
  } else {
    throw new ApiError('Unauthorized to reschedule appointments', 403);
  }

  const appointment = await Appointment.findOne(query);
  if (!appointment) {
    throw new ApiError('Appointment not found or you do not have permission to reschedule it', 404);
  }

  // Validate status transitions
  if (appointment.status === 'completed') {
    throw new ApiError('Completed appointments cannot be rescheduled', 400);
  }
  if (appointment.status === 'cancelled') {
    throw new ApiError('Cancelled appointments cannot be rescheduled', 400);
  }
  if (appointment.status === 'no_show') {
    throw new ApiError('No-show appointments cannot be rescheduled', 400);
  }
  if (appointment.status !== 'confirmed' && appointment.status !== 'pending') {
    throw new ApiError('This appointment cannot be rescheduled', 400);
  }

  // Reject past dates
  if (isDateInPast(rescheduleData.date)) {
    throw new ApiError('Cannot reschedule an appointment to a past date', 400);
  }

  // Verify Specialist is active and visible
  const specialist = await Specialist.findById(appointment.specialist).populate('user', 'status');
  if (!specialist || !specialist.isVisible || specialist.user?.status !== 'active') {
    throw new ApiError('Specialist is no longer available for bookings', 400);
  }

  // Verify Service is active and belongs to specialist
  const service = await Service.findOne({
    _id: appointment.service,
    specialist: specialist._id,
    isActive: true,
  });
  if (!service) {
    throw new ApiError('The service associated with this appointment is inactive or unavailable', 400);
  }

  // Calculate new endTime based on service duration
  const startMinutes = timeToMinutes(rescheduleData.startTime);
  const endMinutes = startMinutes + service.duration;
  const calculatedEndTime = minutesToTime(endMinutes);

  // Check conflicts with OTHER active appointments (exclude current appointment)
  const parsedDate = parseCalendarDate(rescheduleData.date);
  const activeAppointments = await Appointment.find({
    specialist: specialist._id,
    date: parsedDate,
    status: { $in: ['pending', 'confirmed'] },
    _id: { $ne: appointment._id }, // Exclude self
  });

  const hasOverlap = activeAppointments.some((existing) => {
    const existStart = timeToMinutes(existing.startTime);
    const existEnd = timeToMinutes(existing.endTime);
    return startMinutes < existEnd && endMinutes > existStart;
  });

  if (hasOverlap) {
    throw new ApiError('The selected appointment time slot is no longer available.', 409);
  }

  // Verify requested slot is a valid candidate slot from availability engine
  const availableSlotsResult = await availabilityService.getAvailableSlots(
    specialist._id.toString(),
    rescheduleData.date,
    service._id.toString()
  );

  // Slot is valid if it's currently generated as available OR matches the current appointment slot if staying on same date
  const isValidSlot =
    availableSlotsResult.slots.some(
      (s) => s.startTime === rescheduleData.startTime && s.endTime === calculatedEndTime
    ) ||
    (appointment.date.getTime() === parsedDate.getTime() &&
      appointment.startTime === rescheduleData.startTime &&
      appointment.endTime === calculatedEndTime);

  if (!isValidSlot) {
    throw new ApiError(
      'The requested appointment time slot is outside the specialist working hours, overlaps a scheduled break, or falls on a blocked/past date',
      400
    );
  }

  // Update appointment date and times
  appointment.date = parsedDate;
  appointment.startTime = rescheduleData.startTime;
  appointment.endTime = calculatedEndTime;
  appointment.status = 'confirmed';
  await appointment.save();

  await appointment.populate([
    { path: 'specialist', populate: { path: 'user', select: 'firstName lastName email' } },
    { path: 'service' },
  ]);

  // Dispatch in-app notifications & emails (safely)
  try {
    await notificationService.createAppointmentNotifications('appointment_rescheduled', appointment);
  } catch (err) {
    console.error('[Notification] reschedule error:', err.message);
  }

  try {
    await emailService.sendAppointmentRescheduleEmails(appointment);
  } catch (err) {
    console.error('[Email] reschedule error:', err.message);
  }

  return serializeAppointment(appointment);
};

/**
 * Mark appointment completed by specialist
 * @param {String} userId - Specialist user ID
 * @param {String} appointmentId
 */
const completeAppointment = async (userId, appointmentId) => {
  const specialist = await getSpecialistByUserId(userId);

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    specialist: specialist._id,
  });

  if (!appointment) {
    throw new ApiError('Appointment not found or you do not have permission to complete it', 404);
  }

  // Validate status transitions
  if (appointment.status === 'completed') {
    throw new ApiError('This appointment has already been completed', 400);
  }
  if (appointment.status === 'cancelled') {
    throw new ApiError('Cannot complete a cancelled appointment', 400);
  }
  if (appointment.status === 'no_show') {
    throw new ApiError('Cannot complete an appointment marked as no-show', 400);
  }
  if (appointment.status !== 'confirmed') {
    throw new ApiError('Only confirmed appointments can be marked completed', 400);
  }

  // Validate completion timing: cannot complete future appointments
  if (!hasAppointmentTimePassed(appointment.date, appointment.startTime)) {
    throw new ApiError('Cannot mark an appointment as completed before its scheduled date and time', 400);
  }

  appointment.status = 'completed';
  await appointment.save();

  await appointment.populate([
    { path: 'specialist', populate: { path: 'user', select: 'firstName lastName email' } },
    { path: 'service' },
  ]);

  // Dispatch in-app notifications & emails (safely)
  try {
    await notificationService.createAppointmentNotifications('appointment_completed', appointment);
  } catch (err) {
    console.error('[Notification] complete error:', err.message);
  }

  try {
    await emailService.sendAppointmentCompletedEmail(appointment);
  } catch (err) {
    console.error('[Email] complete error:', err.message);
  }

  return serializeAppointment(appointment);
};

/**
 * Mark appointment as no-show by specialist
 * @param {String} userId - Specialist user ID
 * @param {String} appointmentId
 */
const markAppointmentNoShow = async (userId, appointmentId) => {
  const specialist = await getSpecialistByUserId(userId);

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    specialist: specialist._id,
  });

  if (!appointment) {
    throw new ApiError('Appointment not found or you do not have permission to update it', 404);
  }

  // Validate status transitions
  if (appointment.status === 'no_show') {
    throw new ApiError('This appointment has already been marked as no-show', 400);
  }
  if (appointment.status === 'completed') {
    throw new ApiError('Cannot mark a completed appointment as no-show', 400);
  }
  if (appointment.status === 'cancelled') {
    throw new ApiError('Cannot mark a cancelled appointment as no-show', 400);
  }
  if (appointment.status !== 'confirmed') {
    throw new ApiError('Only confirmed appointments can be marked as no-show', 400);
  }

  // Validate no-show timing: cannot mark future appointments as no-show
  if (!hasAppointmentTimePassed(appointment.date, appointment.startTime)) {
    throw new ApiError('Cannot mark an appointment as no-show before its scheduled date and time', 400);
  }

  appointment.status = 'no_show';
  await appointment.save();

  await appointment.populate([
    { path: 'specialist', populate: { path: 'user', select: 'firstName lastName email' } },
    { path: 'service' },
  ]);

  // Dispatch in-app notifications & emails (safely)
  try {
    await notificationService.createAppointmentNotifications('appointment_no_show', appointment);
  } catch (err) {
    console.error('[Notification] no-show error:', err.message);
  }

  try {
    await emailService.sendAppointmentNoShowEmail(appointment);
  } catch (err) {
    console.error('[Email] no-show error:', err.message);
  }

  return serializeAppointment(appointment);
};

/**
 * Retrieve paginated list of appointments for authenticated patient
 * Supports ?scope=upcoming and status filtering
 * @param {String} userId
 * @param {Object} queryParams
 */
const getPatientAppointments = async (userId, queryParams = {}) => {
  const patient = await getPatientByUserId(userId);
  const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(queryParams.limit, 10) || 12));

  const filter = { patient: patient._id };

  if (queryParams.scope === 'upcoming') {
    filter.status = { $in: ['pending', 'confirmed'] };
  } else if (queryParams.status && queryParams.status !== 'all') {
    filter.status = queryParams.status;
  }

  if (queryParams.date) {
    filter.date = parseCalendarDate(queryParams.date);
  }

  const total = await Appointment.countDocuments(filter);

  const appointments = await Appointment.find(filter)
    .populate([
      { path: 'specialist', populate: { path: 'user', select: 'firstName lastName' } },
      { path: 'service' },
    ])
    .sort({ date: 1, startTime: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    appointments: appointments.map(serializeAppointment),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Retrieve historical appointments for authenticated patient (completed, cancelled, no_show)
 * @param {String} userId
 * @param {Object} queryParams
 */
const getPatientAppointmentHistory = async (userId, queryParams = {}) => {
  const patient = await getPatientByUserId(userId);
  const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(queryParams.limit, 10) || 12));

  const historicalStatuses = ['completed', 'cancelled', 'no_show'];
  const filter = { patient: patient._id };

  if (queryParams.status && historicalStatuses.includes(queryParams.status)) {
    filter.status = queryParams.status;
  } else {
    filter.status = { $in: historicalStatuses };
  }

  if (queryParams.date) {
    filter.date = parseCalendarDate(queryParams.date);
  }

  const total = await Appointment.countDocuments(filter);

  const appointments = await Appointment.find(filter)
    .populate([
      { path: 'specialist', populate: { path: 'user', select: 'firstName lastName' } },
      { path: 'service' },
    ])
    .sort({ date: -1, startTime: -1 }) // Newest history first
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    appointments: appointments.map(serializeAppointment),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Retrieve a single appointment detail owned by authenticated patient
 * @param {String} userId
 * @param {String} appointmentId
 */
const getPatientAppointmentById = async (userId, appointmentId) => {
  const patient = await getPatientByUserId(userId);

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    patient: patient._id,
  }).populate([
    { path: 'specialist', populate: { path: 'user', select: 'firstName lastName' } },
    { path: 'service' },
  ]);

  if (!appointment) {
    throw new ApiError('Appointment not found or you do not have permission to view it', 404);
  }

  return serializeAppointment(appointment);
};

/**
 * Retrieve paginated list of appointments for authenticated specialist
 * Supports ?scope=upcoming, search, status, and date filters
 * @param {String} userId
 * @param {Object} queryParams
 */
const getSpecialistAppointments = async (userId, queryParams = {}) => {
  const specialist = await getSpecialistByUserId(userId);
  const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(queryParams.limit, 10) || 12));

  const filter = { specialist: specialist._id };

  if (queryParams.scope === 'upcoming') {
    filter.status = { $in: ['pending', 'confirmed'] };
  } else if (queryParams.status && queryParams.status !== 'all') {
    filter.status = queryParams.status;
  }

  if (queryParams.date) {
    filter.date = parseCalendarDate(queryParams.date);
  }

  if (queryParams.search && queryParams.search.trim()) {
    const escaped = escapeRegex(queryParams.search.trim());
    const regex = new RegExp(escaped, 'i');
    filter.$or = [
      { patientName: regex },
      { patientEmail: regex },
      { referenceNumber: regex },
    ];
  }

  const total = await Appointment.countDocuments(filter);

  const appointments = await Appointment.find(filter)
    .populate([
      { path: 'specialist', populate: { path: 'user', select: 'firstName lastName' } },
      { path: 'service' },
    ])
    .sort({ date: 1, startTime: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    appointments: appointments.map(serializeAppointment),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Retrieve historical appointments for authenticated specialist (completed, cancelled, no_show)
 * @param {String} userId
 * @param {Object} queryParams
 */
const getSpecialistAppointmentHistory = async (userId, queryParams = {}) => {
  const specialist = await getSpecialistByUserId(userId);
  const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(queryParams.limit, 10) || 12));

  const historicalStatuses = ['completed', 'cancelled', 'no_show'];
  const filter = { specialist: specialist._id };

  if (queryParams.status && historicalStatuses.includes(queryParams.status)) {
    filter.status = queryParams.status;
  } else {
    filter.status = { $in: historicalStatuses };
  }

  if (queryParams.date) {
    filter.date = parseCalendarDate(queryParams.date);
  }

  if (queryParams.search && queryParams.search.trim()) {
    const escaped = escapeRegex(queryParams.search.trim());
    const regex = new RegExp(escaped, 'i');
    filter.$or = [
      { patientName: regex },
      { patientEmail: regex },
      { referenceNumber: regex },
    ];
  }

  const total = await Appointment.countDocuments(filter);

  const appointments = await Appointment.find(filter)
    .populate([
      { path: 'specialist', populate: { path: 'user', select: 'firstName lastName' } },
      { path: 'service' },
    ])
    .sort({ date: -1, startTime: -1 }) // Newest history first
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    appointments: appointments.map(serializeAppointment),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Retrieve a single appointment detail owned by authenticated specialist
 * @param {String} userId
 * @param {String} appointmentId
 */
const getSpecialistAppointmentById = async (userId, appointmentId) => {
  const specialist = await getSpecialistByUserId(userId);

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    specialist: specialist._id,
  }).populate([
    { path: 'specialist', populate: { path: 'user', select: 'firstName lastName' } },
    { path: 'service' },
  ]);

  if (!appointment) {
    throw new ApiError('Appointment not found or you do not have permission to view it', 404);
  }

  return serializeAppointment(appointment);
};

module.exports = {
  createAppointment,
  cancelAppointment,
  rescheduleAppointment,
  completeAppointment,
  markAppointmentNoShow,
  getPatientAppointments,
  getPatientAppointmentHistory,
  getPatientAppointmentById,
  getSpecialistAppointments,
  getSpecialistAppointmentHistory,
  getSpecialistAppointmentById,
};
