const Availability = require('../models/Availability');
const BlockedDate = require('../models/BlockedDate');
const Specialist = require('../models/Specialist');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
const ApiError = require('../utils/ApiError');
const {
  parseCalendarDate,
  formatCalendarDate,
  getDayOfWeek,
  isDateInPast,
  generateCandidateSlots,
  timeToMinutes,
} = require('../utils/timeHelper');

/**
 * Return default 7-day disabled schedule template
 */
const getDefaultSchedule = () => [
  { dayOfWeek: 0, isEnabled: false, startTime: null, endTime: null, breakStartTime: null, breakEndTime: null },
  { dayOfWeek: 1, isEnabled: false, startTime: null, endTime: null, breakStartTime: null, breakEndTime: null },
  { dayOfWeek: 2, isEnabled: false, startTime: null, endTime: null, breakStartTime: null, breakEndTime: null },
  { dayOfWeek: 3, isEnabled: false, startTime: null, endTime: null, breakStartTime: null, breakEndTime: null },
  { dayOfWeek: 4, isEnabled: false, startTime: null, endTime: null, breakStartTime: null, breakEndTime: null },
  { dayOfWeek: 5, isEnabled: false, startTime: null, endTime: null, breakStartTime: null, breakEndTime: null },
  { dayOfWeek: 6, isEnabled: false, startTime: null, endTime: null, breakStartTime: null, breakEndTime: null },
];

/**
 * Normalize and sort weekly schedule ensuring all 7 days (0-6) exist
 * @param {Array} rawSchedule
 * @returns {Array}
 */
const normalizeSchedule = (rawSchedule) => {
  const scheduleMap = new Map();

  // Populate default disabled days
  getDefaultSchedule().forEach((day) => {
    scheduleMap.set(day.dayOfWeek, day);
  });

  // Override with provided days
  if (Array.isArray(rawSchedule)) {
    rawSchedule.forEach((item) => {
      if (typeof item.dayOfWeek === 'number' && item.dayOfWeek >= 0 && item.dayOfWeek <= 6) {
        scheduleMap.set(item.dayOfWeek, {
          dayOfWeek: item.dayOfWeek,
          isEnabled: Boolean(item.isEnabled),
          startTime: item.isEnabled ? item.startTime || null : null,
          endTime: item.isEnabled ? item.endTime || null : null,
          breakStartTime: item.isEnabled ? item.breakStartTime || null : null,
          breakEndTime: item.isEnabled ? item.breakEndTime || null : null,
        });
      }
    });
  }

  // Return sorted 0-6 array
  return Array.from(scheduleMap.values()).sort((a, b) => a.dayOfWeek - b.dayOfWeek);
};

/**
 * Helper to find Specialist document by owning User ID
 * @param {String} userId
 * @returns {Promise<Object>}
 */
const getSpecialistByUserId = async (userId) => {
  const specialist = await Specialist.findOne({ user: userId });
  if (!specialist) {
    throw new ApiError('Specialist profile not found for this user account', 404);
  }
  return specialist;
};

/**
 * Format blocked date document for API response
 * @param {Object} doc
 * @returns {Object}
 */
const formatBlockedDate = (doc) => {
  if (!doc) return null;
  const raw = doc.toObject ? doc.toObject() : { ...doc };
  return {
    id: raw._id ? raw._id.toString() : raw.id,
    specialistId: raw.specialist ? raw.specialist.toString() : undefined,
    date: formatCalendarDate(raw.date),
    reason: raw.reason || '',
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
};

/**
 * Get authenticated specialist's weekly availability schedule
 * @param {String} userId
 */
const getMyAvailability = async (userId) => {
  const specialist = await getSpecialistByUserId(userId);

  let availability = await Availability.findOne({ specialist: specialist._id });
  if (!availability) {
    return {
      specialistId: specialist._id.toString(),
      weeklySchedule: getDefaultSchedule(),
    };
  }

  return {
    specialistId: specialist._id.toString(),
    weeklySchedule: normalizeSchedule(availability.weeklySchedule),
    updatedAt: availability.updatedAt,
  };
};

/**
 * Create or replace authenticated specialist's weekly schedule
 * @param {String} userId
 * @param {Array} rawSchedule
 */
const createOrUpdateAvailability = async (userId, rawSchedule) => {
  const specialist = await getSpecialistByUserId(userId);
  const normalized = normalizeSchedule(rawSchedule);

  const availability = await Availability.findOneAndUpdate(
    { specialist: specialist._id },
    { $set: { weeklySchedule: normalized } },
    { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
  );

  return {
    specialistId: specialist._id.toString(),
    weeklySchedule: availability.weeklySchedule,
    updatedAt: availability.updatedAt,
  };
};

/**
 * Get all blocked dates for authenticated specialist
 * @param {String} userId
 */
const getBlockedDates = async (userId) => {
  const specialist = await getSpecialistByUserId(userId);

  const blocked = await BlockedDate.find({ specialist: specialist._id }).sort({ date: 1 });
  return blocked.map(formatBlockedDate);
};

/**
 * Add a new blocked date for authenticated specialist
 * @param {String} userId
 * @param {Object} data - { date, reason }
 */
const addBlockedDate = async (userId, { date, reason }) => {
  const specialist = await getSpecialistByUserId(userId);
  const parsedDate = parseCalendarDate(date);

  const existing = await BlockedDate.findOne({
    specialist: specialist._id,
    date: parsedDate,
  });

  if (existing) {
    throw new ApiError('This calendar date is already marked as blocked.', 400);
  }

  const blocked = await BlockedDate.create({
    specialist: specialist._id,
    date: parsedDate,
    reason: reason ? reason.trim() : '',
  });

  return formatBlockedDate(blocked);
};

/**
 * Update an existing blocked date owned by authenticated specialist
 * @param {String} userId
 * @param {String} blockedDateId
 * @param {Object} updateData
 */
const updateBlockedDate = async (userId, blockedDateId, updateData) => {
  const specialist = await getSpecialistByUserId(userId);

  const blocked = await BlockedDate.findOne({
    _id: blockedDateId,
    specialist: specialist._id,
  });

  if (!blocked) {
    throw new ApiError('Blocked date not found or you do not have permission to modify it', 404);
  }

  if (updateData.date) {
    const parsedDate = parseCalendarDate(updateData.date);

    // Check conflict with other entries
    const conflict = await BlockedDate.findOne({
      _id: { $ne: blockedDateId },
      specialist: specialist._id,
      date: parsedDate,
    });

    if (conflict) {
      throw new ApiError('Another blocked date entry already exists for this date', 400);
    }

    blocked.date = parsedDate;
  }

  if (updateData.reason !== undefined) {
    blocked.reason = updateData.reason.trim();
  }

  await blocked.save();

  return formatBlockedDate(blocked);
};

/**
 * Delete a blocked date owned by authenticated specialist
 * @param {String} userId
 * @param {String} blockedDateId
 */
const deleteBlockedDate = async (userId, blockedDateId) => {
  const specialist = await getSpecialistByUserId(userId);

  const deleted = await BlockedDate.findOneAndDelete({
    _id: blockedDateId,
    specialist: specialist._id,
  });

  if (!deleted) {
    throw new ApiError('Blocked date not found or you do not have permission to delete it', 404);
  }

  return { id: blockedDateId };
};

/**
 * Get public weekly availability schedule for a visible active specialist
 * @param {String} specialistId
 */
const getPublicAvailability = async (specialistId) => {
  const specialist = await Specialist.findById(specialistId).populate('user', 'status');

  if (!specialist || !specialist.isVisible || specialist.user?.status !== 'active') {
    throw new ApiError('Specialist is not publicly available or does not exist', 404);
  }

  const availability = await Availability.findOne({ specialist: specialistId });
  const weeklySchedule = availability
    ? normalizeSchedule(availability.weeklySchedule)
    : getDefaultSchedule();

  return {
    specialistId,
    weeklySchedule,
  };
};

/**
 * Dynamically generate candidate appointment slots for a requested date and service
 * @param {String} specialistId
 * @param {String} dateStr - YYYY-MM-DD
 * @param {String} serviceId
 */
const getAvailableSlots = async (specialistId, dateStr, serviceId) => {
  // 1. Verify Specialist exists, is active, and publicly visible
  const specialist = await Specialist.findById(specialistId).populate('user', 'status');
  if (!specialist || !specialist.isVisible || specialist.user?.status !== 'active') {
    throw new ApiError('Specialist is not publicly available or does not exist', 404);
  }

  // 2. Verify Service exists, belongs to this specialist, and is active
  const service = await Service.findOne({
    _id: serviceId,
    specialist: specialistId,
    isActive: true,
  });

  if (!service) {
    throw new ApiError(
      'Service not found, inactive, or does not belong to the requested specialist',
      404
    );
  }

  const emptyResponse = {
    date: dateStr,
    specialistId,
    serviceId,
    serviceDuration: service.duration,
    slots: [],
  };

  // 3. Return empty slots if date is in the past
  if (isDateInPast(dateStr)) {
    return emptyResponse;
  }

  // 4. Check if the calendar date is blocked for this specialist
  const parsedDate = parseCalendarDate(dateStr);
  const isBlocked = await BlockedDate.exists({
    specialist: specialistId,
    date: parsedDate,
  });

  if (isBlocked) {
    return emptyResponse;
  }

  // 5. Read specialist weekly availability
  const availability = await Availability.findOne({ specialist: specialistId });
  if (!availability) {
    return emptyResponse;
  }

  // 6. Find schedule for target day of week
  const targetDayOfWeek = getDayOfWeek(dateStr);
  const daySchedule = availability.weeklySchedule.find((d) => d.dayOfWeek === targetDayOfWeek);

  if (!daySchedule || !daySchedule.isEnabled || !daySchedule.startTime || !daySchedule.endTime) {
    return emptyResponse;
  }

  // 7. Generate candidate slots matching working hours, breaks, and service duration
  const candidateSlots = generateCandidateSlots({
    startTime: daySchedule.startTime,
    endTime: daySchedule.endTime,
    breakStartTime: daySchedule.breakStartTime,
    breakEndTime: daySchedule.breakEndTime,
    duration: service.duration,
  });

  // 8. Filter out slots overlapping existing active appointments (pending / confirmed)
  const activeAppointments = await Appointment.find({
    specialist: specialistId,
    date: parsedDate,
    status: { $in: ['pending', 'confirmed'] },
  });

  const availableSlots = candidateSlots.filter((slot) => {
    const slotStart = timeToMinutes(slot.startTime);
    const slotEnd = timeToMinutes(slot.endTime);
    return !activeAppointments.some((appt) => {
      const apptStart = timeToMinutes(appt.startTime);
      const apptEnd = timeToMinutes(appt.endTime);
      return slotStart < apptEnd && slotEnd > apptStart;
    });
  });

  return {
    date: dateStr,
    specialistId,
    serviceId,
    serviceDuration: service.duration,
    slots: availableSlots,
  };
};

module.exports = {
  getMyAvailability,
  createOrUpdateAvailability,
  getBlockedDates,
  addBlockedDate,
  updateBlockedDate,
  deleteBlockedDate,
  getPublicAvailability,
  getAvailableSlots,
};
