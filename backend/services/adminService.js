const User = require('../models/User');
const Specialist = require('../models/Specialist');
const Patient = require('../models/Patient');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
const ApiError = require('../utils/ApiError');
const { serializeAppointment } = require('../utils/serializeAppointment');
const {
  formatCalendarDate,
  parseCalendarDate,
  escapeRegex,
} = require('../utils/timeHelper');
const notificationService = require('./notificationService');
const emailService = require('./emailService');

/**
 * Format a Specialist record for safe admin responses
 */
const serializeAdminSpecialist = (specialistDoc) => {
  if (!specialistDoc) return null;
  const raw = specialistDoc.toObject ? specialistDoc.toObject() : { ...specialistDoc };
  const user = raw.user || {};

  return {
    id: raw._id ? raw._id.toString() : raw.id,
    userId: user._id ? user._id.toString() : user.toString(),
    title: raw.title || 'Dr.',
    name: user.firstName
      ? `${raw.title || 'Dr.'} ${user.firstName} ${user.lastName || ''}`.trim()
      : 'Specialist',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    specialty: raw.specialty || '',
    experience: raw.experience || 0,
    licenseNumber: raw.licenseNumber || '',
    qualifications: raw.qualifications || [],
    bio: raw.bio || '',
    clinicName: raw.clinicName || '',
    clinicAddress: raw.clinicAddress || '',
    city: raw.city || '',
    country: raw.country || '',
    cancellationPolicy: raw.cancellationPolicy || '',
    isVisible: Boolean(raw.isVisible),
    rating: raw.rating !== undefined ? raw.rating : 5.0,
    reviewCount: raw.reviewCount || 0,
    profileImage: raw.profileImage || '',
    status: user.status || 'active',
    isEmailVerified: Boolean(user.isEmailVerified),
    lastLoginAt: user.lastLoginAt || null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
};

/**
 * Format a Patient record for safe admin responses
 */
const serializeAdminPatient = (patientDoc) => {
  if (!patientDoc) return null;
  const raw = patientDoc.toObject ? patientDoc.toObject() : { ...patientDoc };
  const user = raw.user || {};

  return {
    id: raw._id ? raw._id.toString() : raw.id,
    userId: user._id ? user._id.toString() : user.toString(),
    name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Patient',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    gender: raw.gender || 'prefer_not_to_say',
    dateOfBirth: raw.dateOfBirth ? formatCalendarDate(raw.dateOfBirth) : null,
    age: raw.age || null,
    city: raw.city || '',
    address: raw.address || '',
    country: raw.country || '',
    profileImage: raw.profileImage || '',
    status: user.status || 'active',
    isEmailVerified: Boolean(user.isEmailVerified),
    lastLoginAt: user.lastLoginAt || null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
};

/**
 * 1. Admin Dashboard Summary Statistics
 */
const getAdminDashboard = async () => {
  const now = new Date();
  const todayStr = formatCalendarDate(now);
  const todayUtc = parseCalendarDate(todayStr);

  const [
    totalSpecialists,
    activeSpecialists,
    suspendedSpecialists,
    visibleSpecialists,
    totalPatients,
    activePatients,
    suspendedPatients,
    totalAppointments,
    todayAppointments,
    upcomingAppointments,
    completedAppointments,
    cancelledAppointments,
    noShowAppointments,
    recentAppointments,
    recentSpecialists,
    recentPatients,
  ] = await Promise.all([
    User.countDocuments({ role: 'specialist' }),
    User.countDocuments({ role: 'specialist', status: 'active' }),
    User.countDocuments({ role: 'specialist', status: 'suspended' }),
    Specialist.countDocuments({ isVisible: true }),
    User.countDocuments({ role: 'patient' }),
    User.countDocuments({ role: 'patient', status: 'active' }),
    User.countDocuments({ role: 'patient', status: 'suspended' }),
    Appointment.countDocuments(),
    Appointment.countDocuments({ date: todayUtc }),
    Appointment.countDocuments({
      status: { $in: ['pending', 'confirmed'] },
      date: { $gte: todayUtc },
    }),
    Appointment.countDocuments({ status: 'completed' }),
    Appointment.countDocuments({ status: 'cancelled' }),
    Appointment.countDocuments({ status: 'no_show' }),
    Appointment.find()
      .populate([
        { path: 'specialist', populate: { path: 'user', select: 'firstName lastName email' } },
        { path: 'service' },
      ])
      .sort({ createdAt: -1 })
      .limit(5),
    Specialist.find()
      .populate('user', 'firstName lastName email phone status isEmailVerified lastLoginAt createdAt')
      .sort({ createdAt: -1 })
      .limit(5),
    Patient.find()
      .populate('user', 'firstName lastName email phone status isEmailVerified lastLoginAt createdAt')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  return {
    specialists: {
      total: totalSpecialists,
      active: activeSpecialists,
      suspended: suspendedSpecialists,
      visible: visibleSpecialists,
    },
    patients: {
      total: totalPatients,
      active: activePatients,
      suspended: suspendedPatients,
    },
    appointments: {
      total: totalAppointments,
      today: todayAppointments,
      upcoming: upcomingAppointments,
      completed: completedAppointments,
      cancelled: cancelledAppointments,
      noShow: noShowAppointments,
    },
    recentData: {
      appointments: recentAppointments.map(serializeAppointment),
      specialists: recentSpecialists.map(serializeAdminSpecialist),
      patients: recentPatients.map(serializeAdminPatient),
    },
  };
};

/**
 * 2. Specialist Management - List
 */
const getAdminSpecialists = async (queryParams = {}) => {
  const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(queryParams.limit, 10) || 10));

  const filter = {};

  if (queryParams.specialty && queryParams.specialty !== 'all') {
    filter.specialty = queryParams.specialty;
  }

  if (queryParams.isVisible !== undefined && queryParams.isVisible !== 'all') {
    filter.isVisible = queryParams.isVisible === 'true' || queryParams.isVisible === true;
  }

  // Handle text search across User and Specialist fields
  if (queryParams.search && queryParams.search.trim()) {
    const escaped = escapeRegex(queryParams.search.trim());
    const regex = new RegExp(escaped, 'i');

    const matchingUsers = await User.find({
      role: 'specialist',
      $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
    }).select('_id');

    const matchingUserIds = matchingUsers.map((u) => u._id);

    filter.$or = [
      { user: { $in: matchingUserIds } },
      { specialty: regex },
      { city: regex },
      { clinicName: regex },
    ];
  }

  // If status filter is supplied, filter users by status
  if (queryParams.status && queryParams.status !== 'all') {
    const statusUsers = await User.find({
      role: 'specialist',
      status: queryParams.status,
    }).select('_id');
    const statusUserIds = statusUsers.map((u) => u._id);

    if (filter.user) {
      filter.user = { $in: statusUserIds };
    } else {
      filter.user = { $in: statusUserIds };
    }
  }

  const total = await Specialist.countDocuments(filter);

  const specialists = await Specialist.find(filter)
    .populate('user', 'firstName lastName email phone status isEmailVerified lastLoginAt createdAt')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    specialists: specialists.map(serializeAdminSpecialist),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * 3. Specialist Management - Detail
 */
const getAdminSpecialistById = async (specialistId) => {
  const specialist = await Specialist.findById(specialistId).populate(
    'user',
    'firstName lastName email phone status isEmailVerified lastLoginAt createdAt'
  );

  if (!specialist) {
    throw new ApiError('Specialist not found', 404);
  }

  const services = await Service.find({ specialist: specialist._id }).sort({ createdAt: -1 });

  return {
    specialist: serializeAdminSpecialist(specialist),
    services,
  };
};

/**
 * 4. Specialist Management - Update Account Status
 */
const updateSpecialistStatus = async (specialistId, status) => {
  const specialist = await Specialist.findById(specialistId);
  if (!specialist) {
    throw new ApiError('Specialist not found', 404);
  }

  const user = await User.findById(specialist.user);
  if (!user) {
    throw new ApiError('Associated user account not found', 404);
  }

  user.status = status;
  await user.save();

  await specialist.populate(
    'user',
    'firstName lastName email phone status isEmailVerified lastLoginAt createdAt'
  );

  return serializeAdminSpecialist(specialist);
};

/**
 * 5. Specialist Management - Update Public Visibility
 */
const updateSpecialistVisibility = async (specialistId, isVisible) => {
  const specialist = await Specialist.findById(specialistId);
  if (!specialist) {
    throw new ApiError('Specialist not found', 404);
  }

  specialist.isVisible = isVisible;
  await specialist.save();

  await specialist.populate(
    'user',
    'firstName lastName email phone status isEmailVerified lastLoginAt createdAt'
  );

  return serializeAdminSpecialist(specialist);
};

/**
 * 6. Specialist Management - Safe Profile Edit
 */
const updateSpecialistProfile = async (specialistId, updateData) => {
  const specialist = await Specialist.findById(specialistId);
  if (!specialist) {
    throw new ApiError('Specialist not found', 404);
  }

  const user = await User.findById(specialist.user);
  if (!user) {
    throw new ApiError('Associated user account not found', 404);
  }

  // Update user fields if provided
  if (updateData.firstName) user.firstName = updateData.firstName.trim();
  if (updateData.lastName) user.lastName = updateData.lastName.trim();
  if (updateData.phone !== undefined) user.phone = updateData.phone.trim();
  await user.save();

  // Update specialist professional fields
  if (updateData.title !== undefined) specialist.title = updateData.title.trim();
  if (updateData.specialty) specialist.specialty = updateData.specialty;
  if (updateData.experience !== undefined) specialist.experience = updateData.experience;
  if (updateData.bio !== undefined) specialist.bio = updateData.bio.trim();
  if (updateData.clinicName !== undefined) specialist.clinicName = updateData.clinicName.trim();
  if (updateData.clinicAddress !== undefined) specialist.clinicAddress = updateData.clinicAddress.trim();
  if (updateData.city !== undefined) specialist.city = updateData.city.trim();
  if (updateData.cancellationPolicy !== undefined) specialist.cancellationPolicy = updateData.cancellationPolicy.trim();
  if (Array.isArray(updateData.qualifications)) specialist.qualifications = updateData.qualifications;

  await specialist.save();

  await specialist.populate(
    'user',
    'firstName lastName email phone status isEmailVerified lastLoginAt createdAt'
  );

  return serializeAdminSpecialist(specialist);
};

/**
 * 7. Patient Management - List
 */
const getAdminPatients = async (queryParams = {}) => {
  const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(queryParams.limit, 10) || 10));

  const filter = {};

  if (queryParams.search && queryParams.search.trim()) {
    const escaped = escapeRegex(queryParams.search.trim());
    const regex = new RegExp(escaped, 'i');

    const matchingUsers = await User.find({
      role: 'patient',
      $or: [{ firstName: regex }, { lastName: regex }, { email: regex }, { phone: regex }],
    }).select('_id');

    const matchingUserIds = matchingUsers.map((u) => u._id);

    filter.$or = [{ user: { $in: matchingUserIds } }, { city: regex }];
  }

  if (queryParams.status && queryParams.status !== 'all') {
    const statusUsers = await User.find({
      role: 'patient',
      status: queryParams.status,
    }).select('_id');
    const statusUserIds = statusUsers.map((u) => u._id);
    filter.user = { $in: statusUserIds };
  }

  const total = await Patient.countDocuments(filter);

  const patients = await Patient.find(filter)
    .populate('user', 'firstName lastName email phone status isEmailVerified lastLoginAt createdAt')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    patients: patients.map(serializeAdminPatient),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * 8. Patient Management - Detail
 */
const getAdminPatientById = async (patientId) => {
  const patient = await Patient.findById(patientId).populate(
    'user',
    'firstName lastName email phone status isEmailVerified lastLoginAt createdAt'
  );

  if (!patient) {
    throw new ApiError('Patient not found', 404);
  }

  return serializeAdminPatient(patient);
};

/**
 * 9. Patient Management - Update Account Status
 */
const updatePatientStatus = async (patientId, status) => {
  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new ApiError('Patient not found', 404);
  }

  const user = await User.findById(patient.user);
  if (!user) {
    throw new ApiError('Associated user account not found', 404);
  }

  user.status = status;
  await user.save();

  await patient.populate(
    'user',
    'firstName lastName email phone status isEmailVerified lastLoginAt createdAt'
  );

  return serializeAdminPatient(patient);
};

/**
 * 10. Appointment Management - List
 */
const getAdminAppointments = async (queryParams = {}) => {
  const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(queryParams.limit, 10) || 10));

  const filter = {};

  if (queryParams.status && queryParams.status !== 'all') {
    filter.status = queryParams.status;
  }

  if (queryParams.date) {
    filter.date = parseCalendarDate(queryParams.date);
  }

  if (queryParams.specialistId) {
    filter.specialist = queryParams.specialistId;
  }

  if (queryParams.patientId) {
    filter.patient = queryParams.patientId;
  }

  if (queryParams.search && queryParams.search.trim()) {
    const escaped = escapeRegex(queryParams.search.trim());
    const regex = new RegExp(escaped, 'i');
    filter.$or = [
      { referenceNumber: regex },
      { patientName: regex },
      { patientEmail: regex },
    ];
  }

  const total = await Appointment.countDocuments(filter);

  const appointments = await Appointment.find(filter)
    .populate([
      { path: 'specialist', populate: { path: 'user', select: 'firstName lastName email' } },
      { path: 'service' },
    ])
    .sort({ date: -1, startTime: -1 })
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
 * 11. Appointment Management - Detail
 */
const getAdminAppointmentById = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId).populate([
    { path: 'specialist', populate: { path: 'user', select: 'firstName lastName email' } },
    { path: 'service' },
  ]);

  if (!appointment) {
    throw new ApiError('Appointment not found', 404);
  }

  return serializeAppointment(appointment);
};

/**
 * 12. Appointment Management - Admin Cancellation
 */
const cancelAppointmentByAdmin = async (appointmentId, reason = '') => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new ApiError('Appointment not found', 404);
  }

  if (appointment.status === 'cancelled') {
    throw new ApiError('This appointment has already been cancelled', 400);
  }
  if (appointment.status === 'completed') {
    throw new ApiError('Completed appointments cannot be cancelled', 400);
  }
  if (appointment.status === 'no_show') {
    throw new ApiError('No-show appointments cannot be cancelled', 400);
  }

  appointment.status = 'cancelled';
  appointment.cancellationReason = reason ? reason.trim() : 'Cancelled by administrator';
  await appointment.save();

  await appointment.populate([
    { path: 'specialist', populate: { path: 'user', select: 'firstName lastName email' } },
    { path: 'service' },
  ]);

  // Dispatch notifications & emails to both patient and specialist
  try {
    await notificationService.createAppointmentNotifications('appointment_cancelled', appointment, {
      cancelledByRole: 'admin',
      reason: appointment.cancellationReason,
    });
  } catch (err) {
    console.error('[Admin] Notification cancel error:', err.message);
  }

  try {
    await emailService.sendAppointmentCancellationEmail(appointment, 'admin', appointment.cancellationReason);
  } catch (err) {
    console.error('[Admin] Email cancel error:', err.message);
  }

  return serializeAppointment(appointment);
};

/**
 * 13. Appointment Management - Admin Completion
 */
const completeAppointmentByAdmin = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new ApiError('Appointment not found', 404);
  }

  if (appointment.status === 'completed') {
    throw new ApiError('This appointment has already been completed', 400);
  }
  if (appointment.status === 'cancelled') {
    throw new ApiError('Cannot complete a cancelled appointment', 400);
  }
  if (appointment.status === 'no_show') {
    throw new ApiError('Cannot complete an appointment marked as no-show', 400);
  }

  appointment.status = 'completed';
  await appointment.save();

  await appointment.populate([
    { path: 'specialist', populate: { path: 'user', select: 'firstName lastName email' } },
    { path: 'service' },
  ]);

  try {
    await notificationService.createAppointmentNotifications('appointment_completed', appointment);
  } catch (err) {
    console.error('[Admin] Notification complete error:', err.message);
  }

  try {
    await emailService.sendAppointmentCompletedEmail(appointment);
  } catch (err) {
    console.error('[Admin] Email complete error:', err.message);
  }

  return serializeAppointment(appointment);
};

/**
 * 14. Appointment Management - Admin Mark No-Show
 */
const markAppointmentNoShowByAdmin = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new ApiError('Appointment not found', 404);
  }

  if (appointment.status === 'no_show') {
    throw new ApiError('This appointment has already been marked as no-show', 400);
  }
  if (appointment.status === 'completed') {
    throw new ApiError('Cannot mark a completed appointment as no-show', 400);
  }
  if (appointment.status === 'cancelled') {
    throw new ApiError('Cannot mark a cancelled appointment as no-show', 400);
  }

  appointment.status = 'no_show';
  await appointment.save();

  await appointment.populate([
    { path: 'specialist', populate: { path: 'user', select: 'firstName lastName email' } },
    { path: 'service' },
  ]);

  try {
    await notificationService.createAppointmentNotifications('appointment_no_show', appointment);
  } catch (err) {
    console.error('[Admin] Notification no-show error:', err.message);
  }

  try {
    await emailService.sendAppointmentNoShowEmail(appointment);
  } catch (err) {
    console.error('[Admin] Email no-show error:', err.message);
  }

  return serializeAppointment(appointment);
};

/**
 * 15. Reports & Platform Statistics (Aggregation)
 */
const getAdminReports = async (queryParams = {}) => {
  const matchFilter = {};

  if (queryParams.from || queryParams.to) {
    matchFilter.date = {};
    if (queryParams.from) {
      matchFilter.date.$gte = parseCalendarDate(queryParams.from);
    }
    if (queryParams.to) {
      matchFilter.date.$lte = parseCalendarDate(queryParams.to);
    }
  }

  const [
    totalSpecialists,
    totalPatients,
    totalAppointments,
    completedAppointments,
    cancelledAppointments,
    noShowAppointments,
    appointmentsByStatus,
    appointmentsByDate,
    newSpecialistsByDate,
    newPatientsByDate,
  ] = await Promise.all([
    User.countDocuments({ role: 'specialist' }),
    User.countDocuments({ role: 'patient' }),
    Appointment.countDocuments(matchFilter),
    Appointment.countDocuments({ ...matchFilter, status: 'completed' }),
    Appointment.countDocuments({ ...matchFilter, status: 'cancelled' }),
    Appointment.countDocuments({ ...matchFilter, status: 'no_show' }),

    // Aggregation: Appointments by Status
    Appointment.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } },
    ]),

    // Aggregation: Appointments by Date
    Appointment.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', count: 1, _id: 0 } },
    ]),

    // Aggregation: New Specialists by Date
    User.aggregate([
      { $match: { role: 'specialist' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', count: 1, _id: 0 } },
    ]),

    // Aggregation: New Patients by Date
    User.aggregate([
      { $match: { role: 'patient' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', count: 1, _id: 0 } },
    ]),
  ]);

  return {
    summary: {
      totalSpecialists,
      totalPatients,
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      noShowAppointments,
    },
    appointmentsByStatus,
    appointmentsByDate,
    newSpecialistsByDate,
    newPatientsByDate,
  };
};

module.exports = {
  getAdminDashboard,
  getAdminSpecialists,
  getAdminSpecialistById,
  updateSpecialistStatus,
  updateSpecialistVisibility,
  updateSpecialistProfile,
  getAdminPatients,
  getAdminPatientById,
  updatePatientStatus,
  getAdminAppointments,
  getAdminAppointmentById,
  cancelAppointmentByAdmin,
  completeAppointmentByAdmin,
  markAppointmentNoShowByAdmin,
  getAdminReports,
};
