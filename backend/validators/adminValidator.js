const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const { isValidDateFormat } = require('../utils/timeHelper');

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
 * Common Mongo ObjectId Validator for Route Params
 */
const mongoIdParamValidator = [
  param('id').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid ID format');
    }
    return true;
  }),
  validate,
];

/**
 * Validation rules for Admin User/Specialist/Patient List Queries
 */
const adminListQueryValidator = [
  query('search').optional().trim(),

  query('status')
    .optional()
    .trim()
    .isIn(['active', 'suspended', 'inactive', 'all'])
    .withMessage('Invalid status filter value'),

  query('specialty')
    .optional()
    .trim()
    .isIn([
      'Dermatologist',
      'Skin Specialist',
      'Aesthetic Practitioner',
      'Cosmetic Dermatologist',
      'Trichologist',
      'Aesthetic Physician',
      'all',
    ])
    .withMessage('Invalid specialty filter value'),

  query('isVisible')
    .optional()
    .trim()
    .isIn(['true', 'false', 'all'])
    .withMessage('isVisible filter must be true or false'),

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
 * Validation rules for Updating Account Status (User.status: active | suspended | inactive)
 */
const updateStatusValidator = [
  param('id').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid ID format');
    }
    return true;
  }),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .trim()
    .isIn(['active', 'suspended', 'inactive'])
    .withMessage('Status must be active, suspended, or inactive'),

  validate,
];

/**
 * Validation rules for Updating Specialist Profile Visibility
 */
const updateVisibilityValidator = [
  param('id').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid specialist ID format');
    }
    return true;
  }),

  body('isVisible')
    .notEmpty()
    .withMessage('isVisible field is required')
    .isBoolean()
    .withMessage('isVisible must be a boolean (true or false)'),

  validate,
];

/**
 * Validation rules for Safe Admin Specialist Profile Editing
 */
const updateSpecialistProfileValidator = [
  param('id').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid specialist ID format');
    }
    return true;
  }),

  body('firstName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('First name cannot be empty')
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),

  body('lastName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Last name cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),

  body('phone')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Phone cannot exceed 30 characters'),

  body('title')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Title cannot exceed 20 characters'),

  body('specialty')
    .optional()
    .trim()
    .isIn([
      'Dermatologist',
      'Skin Specialist',
      'Aesthetic Practitioner',
      'Cosmetic Dermatologist',
      'Trichologist',
      'Aesthetic Physician',
    ])
    .withMessage('Invalid specialty'),

  body('experience')
    .optional()
    .isInt({ min: 0, max: 70 })
    .withMessage('Experience must be between 0 and 70 years'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Bio cannot exceed 2000 characters'),

  body('clinicName')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Clinic name cannot exceed 150 characters'),

  body('clinicAddress')
    .optional()
    .trim()
    .isLength({ max: 250 })
    .withMessage('Clinic address cannot exceed 250 characters'),

  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City cannot exceed 100 characters'),

  body('cancellationPolicy')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Cancellation policy cannot exceed 500 characters'),

  body('qualifications')
    .optional()
    .isArray()
    .withMessage('Qualifications must be an array of strings'),

  validate,
];

/**
 * Validation rules for Admin Appointment Listing
 */
const adminAppointmentListQueryValidator = [
  query('search').optional().trim(),

  query('status')
    .optional()
    .trim()
    .isIn(['pending', 'confirmed', 'completed', 'cancelled', 'no_show', 'all'])
    .withMessage('Invalid appointment status filter'),

  query('date').optional().trim(),

  query('specialistId')
    .optional()
    .trim()
    .custom((value) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid specialist ID filter');
      }
      return true;
    }),

  query('patientId')
    .optional()
    .trim()
    .custom((value) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid patient ID filter');
      }
      return true;
    }),

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
 * Validation rules for Admin Appointment Cancellation
 */
const adminCancelAppointmentValidator = [
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
 * Validation rules for Admin Reports / Analytics Query
 */
const adminReportsQueryValidator = [
  query('from')
    .optional()
    .trim()
    .custom((value) => {
      if (value && !isValidDateFormat(value)) {
        throw new Error('from parameter must follow YYYY-MM-DD format');
      }
      return true;
    }),

  query('to')
    .optional()
    .trim()
    .custom((value) => {
      if (value && !isValidDateFormat(value)) {
        throw new Error('to parameter must follow YYYY-MM-DD format');
      }
      return true;
    }),

  validate,
];

module.exports = {
  mongoIdParamValidator,
  adminListQueryValidator,
  updateStatusValidator,
  updateVisibilityValidator,
  updateSpecialistProfileValidator,
  adminAppointmentListQueryValidator,
  adminCancelAppointmentValidator,
  adminReportsQueryValidator,
};
