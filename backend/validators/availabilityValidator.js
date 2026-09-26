const { body, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const { isValidTimeFormat, timeToMinutes, isValidDateFormat } = require('../utils/timeHelper');

/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));
    return next(new ApiError(formattedErrors[0].message, 400, formattedErrors));
  }
  next();
};

/**
 * Validator for updating specialist weekly availability (PUT /api/availability/me)
 */
const updateAvailabilityValidator = [
  body('weeklySchedule')
    .isArray({ min: 1, max: 7 })
    .withMessage('weeklySchedule must be an array containing between 1 and 7 day schedules')
    .custom((schedule) => {
      const seenDays = new Set();

      for (let i = 0; i < schedule.length; i++) {
        const item = schedule[i];

        // 1. Day of week checks
        if (typeof item.dayOfWeek !== 'number' || item.dayOfWeek < 0 || item.dayOfWeek > 6) {
          throw new Error(`Schedule item at index ${i} has invalid dayOfWeek (must be 0-6)`);
        }
        if (seenDays.has(item.dayOfWeek)) {
          throw new Error(`Duplicate dayOfWeek ${item.dayOfWeek} found in weeklySchedule`);
        }
        seenDays.add(item.dayOfWeek);

        // 2. Enabled day validation
        if (item.isEnabled === true) {
          if (!item.startTime || !isValidTimeFormat(item.startTime)) {
            throw new Error(`Enabled day ${item.dayOfWeek} requires valid startTime in HH:mm format`);
          }
          if (!item.endTime || !isValidTimeFormat(item.endTime)) {
            throw new Error(`Enabled day ${item.dayOfWeek} requires valid endTime in HH:mm format`);
          }

          const startMin = timeToMinutes(item.startTime);
          const endMin = timeToMinutes(item.endTime);

          if (startMin >= endMin) {
            throw new Error(`Day ${item.dayOfWeek}: startTime (${item.startTime}) must be earlier than endTime (${item.endTime})`);
          }

          // 3. Break validation (if either break time is specified)
          const hasBreakStart = Boolean(item.breakStartTime);
          const hasBreakEnd = Boolean(item.breakEndTime);

          if (hasBreakStart || hasBreakEnd) {
            if (!hasBreakStart || !hasBreakEnd) {
              throw new Error(`Day ${item.dayOfWeek}: both breakStartTime and breakEndTime must be provided together`);
            }
            if (!isValidTimeFormat(item.breakStartTime) || !isValidTimeFormat(item.breakEndTime)) {
              throw new Error(`Day ${item.dayOfWeek}: break times must follow HH:mm format`);
            }

            const breakStartMin = timeToMinutes(item.breakStartTime);
            const breakEndMin = timeToMinutes(item.breakEndTime);

            if (breakStartMin >= breakEndMin) {
              throw new Error(`Day ${item.dayOfWeek}: breakStartTime must be earlier than breakEndTime`);
            }
            if (breakStartMin < startMin || breakEndMin > endMin) {
              throw new Error(`Day ${item.dayOfWeek}: break interval (${item.breakStartTime}-${item.breakEndTime}) must fall strictly within working hours (${item.startTime}-${item.endTime})`);
            }
          }
        }
      }

      return true;
    }),

  validate,
];

/**
 * Validator for slot generation query parameters (GET /api/specialists/:id/availability/slots)
 */
const slotsQueryValidator = [
  query('date')
    .notEmpty()
    .withMessage('Date query parameter is required (YYYY-MM-DD)')
    .custom((value) => {
      if (!isValidDateFormat(value)) {
        throw new Error('Date must be a valid calendar date formatted as YYYY-MM-DD');
      }
      return true;
    }),

  query('serviceId')
    .notEmpty()
    .withMessage('Service ID query parameter is required')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid serviceId parameter format');
      }
      return true;
    }),

  validate,
];

module.exports = {
  updateAvailabilityValidator,
  slotsQueryValidator,
};
