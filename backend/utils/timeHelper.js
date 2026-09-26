/**
 * Time and Date Helper Utilities for Schedule & Slot Generation
 */

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validate HH:mm 24-hour time format
 * @param {String} timeStr
 * @returns {Boolean}
 */
const isValidTimeFormat = (timeStr) => {
  if (typeof timeStr !== 'string') return false;
  return TIME_REGEX.test(timeStr.trim());
};

/**
 * Validate YYYY-MM-DD calendar date string
 * @param {String} dateStr
 * @returns {Boolean}
 */
const isValidDateFormat = (dateStr) => {
  if (typeof dateStr !== 'string') return false;
  return DATE_REGEX.test(dateStr.trim());
};

/**
 * Convert HH:mm string to total minutes from midnight
 * @param {String} timeStr - e.g., "09:30"
 * @returns {Number} Minutes - e.g., 570
 */
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.trim().split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Convert minutes from midnight back to HH:mm string
 * @param {Number} totalMinutes - e.g., 570
 * @returns {String} "09:30"
 */
const minutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  return `${hh}:${mm}`;
};

/**
 * Normalize a YYYY-MM-DD string into a deterministic UTC midnight Date object
 * @param {String|Date} input
 * @returns {Date}
 */
const parseCalendarDate = (input) => {
  if (input instanceof Date) {
    return new Date(Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate()));
  }
  const dateStr = String(input).trim().substring(0, 10);
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
};

/**
 * Format a Date object to YYYY-MM-DD string
 * @param {Date} dateObj
 * @returns {String}
 */
const formatCalendarDate = (dateObj) => {
  const d = new Date(dateObj);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Determine day of week index (0=Sunday, 6=Saturday) from YYYY-MM-DD
 * @param {String} dateStr - "2026-09-15"
 * @returns {Number} 0 to 6
 */
const getDayOfWeek = (dateStr) => {
  const dateObj = parseCalendarDate(dateStr);
  return dateObj.getUTCDay();
};

/**
 * Check if a YYYY-MM-DD calendar date is in the past compared to current UTC date
 * @param {String} dateStr
 * @returns {Boolean}
 */
const isDateInPast = (dateStr) => {
  const target = parseCalendarDate(dateStr);
  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return target.getTime() < todayUTC.getTime();
};

/**
 * Generate candidate time slot intervals for a given daily schedule & service duration
 * @param {Object} params
 * @param {String} params.startTime - e.g. "09:00"
 * @param {String} params.endTime - e.g. "17:00"
 * @param {String} [params.breakStartTime] - e.g. "13:00"
 * @param {String} [params.breakEndTime] - e.g. "14:00"
 * @param {Number} params.duration - in minutes, e.g. 30
 * @returns {Array<{ startTime: String, endTime: String }>}
 */
const generateCandidateSlots = ({
  startTime,
  endTime,
  breakStartTime,
  breakEndTime,
  duration,
}) => {
  if (!startTime || !endTime || !duration || duration <= 0) {
    return [];
  }

  const workStart = timeToMinutes(startTime);
  const workEnd = timeToMinutes(endTime);

  const hasBreak = Boolean(breakStartTime && breakEndTime);
  const breakStart = hasBreak ? timeToMinutes(breakStartTime) : null;
  const breakEnd = hasBreak ? timeToMinutes(breakEndTime) : null;

  const slots = [];
  let currentStart = workStart;

  while (currentStart + duration <= workEnd) {
    const currentEnd = currentStart + duration;

    // Check if candidate slot overlaps with scheduled break
    let overlapsBreak = false;
    if (hasBreak) {
      // Overlap occurs if slot start is before breakEnd AND slot end is after breakStart
      overlapsBreak = currentStart < breakEnd && currentEnd > breakStart;
    }

    if (!overlapsBreak) {
      slots.push({
        startTime: minutesToTime(currentStart),
        endTime: minutesToTime(currentEnd),
      });
      currentStart += duration;
    } else {
      // Fast-forward current pointer to the end of the break
      currentStart = Math.max(currentStart + duration, breakEnd);
    }
  }

  return slots;
};

/**
 * Check if an appointment's scheduled date and start time has reached or passed current time
 * @param {Date|String} date - Appointment calendar date
 * @param {String} startTime - Appointment start time in HH:mm
 * @returns {Boolean}
 */
const hasAppointmentTimePassed = (date, startTime) => {
  if (!date || !startTime) return false;
  const dateStr = formatCalendarDate(date);
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = startTime.split(':').map(Number);
  const appointmentEpoch = Date.UTC(year, month - 1, day, hours, minutes, 0, 0);
  return Date.now() >= appointmentEpoch;
};

/**
 * Escape special regex characters in a search string
 * @param {String} string
 * @returns {String}
 */
const escapeRegex = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

module.exports = {
  isValidTimeFormat,
  isValidDateFormat,
  timeToMinutes,
  minutesToTime,
  parseCalendarDate,
  formatCalendarDate,
  getDayOfWeek,
  isDateInPast,
  generateCandidateSlots,
  hasAppointmentTimePassed,
  escapeRegex,
};
