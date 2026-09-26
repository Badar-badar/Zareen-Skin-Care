const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const { isValidTimeFormat, isValidDateFormat } = require('../utils/timeHelper');

/**
 * Middleware to evaluate validation errors
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
 * Validation rules for creating an appointment booking (POST /api/appointments)
 */
const createAppointmentValidator = [
  body('specialistId')
    .notEmpty()
    .withMessage('Specialist ID is required')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid specialist ID format');
      }
      return true;
    }),

  body('serviceId')
    .notEmpty()
    .withMessage('Service ID is required')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid service ID format');
      }
      return true;
    }),

  body('date')
    .notEmpty()
    .withMessage('Appointment date is required (YYYY-MM-DD)')
    .custom((value) => {
      if (!isValidDateFormat(value)) {
        throw new Error('Appointment date must follow YYYY-MM-DD format');
      }
      return true;
    }),

  body('startTime')
    .notEmpty()
    .withMessage('Start time is required (HH:mm)')
    .custom((value) => {
      if (!isValidTimeFormat(value)) {
        throw new Error('Start time must follow HH:mm format');
      }
      return true;
    }),

  body('patientName')
    .trim()
    .notEmpty()
    .withMessage('Patient name is required')
    .isLength({ max: 100 })
    .withMessage('Patient name cannot exceed 100 characters'),

  body('patientEmail')
    .trim()
    .notEmpty()
    .withMessage('Patient email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('patientPhone')
    .trim()
    .notEmpty()
    .withMessage('Patient phone number is required')
    .isLength({ max: 30 })
    .withMessage('Phone number cannot exceed 30 characters'),

  body('patientNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),

  validate,
];

/**
 * Validation rules for cancelling an appointment (PATCH /api/appointments/:id/cancel)
 */
const cancelAppointmentValidator = [
  param('id').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid appointment ID format');
    }
    return true;
  }),

  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Cancellation reason cannot exceed 500 characters'),

  validate,
];

/**
 * Validation rules for rescheduling an appointment (PATCH /api/appointments/:id/reschedule)
 */
const rescheduleAppointmentValidator = [
  param('id').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid appointment ID format');
    }
    return true;
  }),

  body('date')
    .notEmpty()
    .withMessage('New appointment date is required (YYYY-MM-DD)')
    .custom((value) => {
      if (!isValidDateFormat(value)) {
        throw new Error('Appointment date must follow YYYY-MM-DD format');
      }
      return true;
    }),

  body('startTime')
    .notEmpty()
    .withMessage('New start time is required (HH:mm)')
    .custom((value) => {
      if (!isValidTimeFormat(value)) {
        throw new Error('Start time must follow HH:mm format');
      }
      return true;
    }),

  validate,
];

/**
 * Validation rules for patient appointment listing query (GET /api/appointments/my)
 */
const listPatientAppointmentsValidator = [
  query('scope')
    .optional()
    .trim()
    .isIn(['upcoming', 'all'])
    .withMessage('Invalid scope filter parameter'),

  query('status')
    .optional()
    .trim()
    .isIn(['pending', 'confirmed', 'completed', 'cancelled', 'no_show', 'all'])
    .withMessage('Invalid status filter parameter'),

  query('date')
    .optional()
    .trim(),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),

  validate,
];

/**
 * Validation rules for specialist appointment listing query (GET /api/appointments/specialist)
 */
const listSpecialistAppointmentsValidator = [
  query('scope')
    .optional()
    .trim()
    .isIn(['upcoming', 'all'])
    .withMessage('Invalid scope filter parameter'),

  query('status')
    .optional()
    .trim()
    .isIn(['pending', 'confirmed', 'completed', 'cancelled', 'no_show', 'all'])
    .withMessage('Invalid status filter parameter'),

  query('date')
    .optional()
    .trim(),

  query('search')
    .optional()
    .trim(),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),

  validate,
];

/**
 * Validation rules for history queries (GET /my/history and GET /specialist/history)
 */
const historyQueryValidator = [
  query('status')
    .optional()
    .trim()
    .isIn(['completed', 'cancelled', 'no_show', 'all'])
    .withMessage('Invalid status filter parameter for history'),

  query('date')
    .optional()
    .trim(),

  query('search')
    .optional()
    .trim(),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),

  validate,
];

/**
 * Validation rules for appointment ID parameter
 */
const appointmentIdValidator = [
  param('id').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid appointment ID format');
    }
    return true;
  }),

  validate,
];

module.exports = {
  createAppointmentValidator,
  cancelAppointmentValidator,
  rescheduleAppointmentValidator,
  listPatientAppointmentsValidator,
  listSpecialistAppointmentsValidator,
  historyQueryValidator,
  appointmentIdValidator,
};
