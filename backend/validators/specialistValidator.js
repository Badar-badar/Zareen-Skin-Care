const { body, query, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');

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

const allowedSpecialties = [
  'Dermatologist',
  'Skin Specialist',
  'Aesthetic Practitioner',
  'Cosmetic Dermatologist',
  'Trichologist',
  'Aesthetic Physician',
];

/**
 * Validation rules for updating specialist profile (PATCH /api/specialists/me)
 */
const updateSpecialistValidator = [
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
    .trim(),

  body('title')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Title cannot exceed 20 characters'),

  body('specialty')
    .optional()
    .trim()
    .isIn(allowedSpecialties)
    .withMessage(`Specialty must be one of: ${allowedSpecialties.join(', ')}`),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Bio cannot exceed 2000 characters'),

  body('profileImage')
    .optional()
    .trim(),

  body('licenseNumber')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('License number cannot exceed 50 characters'),

  body('experience')
    .optional()
    .isInt({ min: 0, max: 70 })
    .withMessage('Experience must be a valid number of years between 0 and 70'),

  body('qualifications')
    .optional()
    .isArray()
    .withMessage('Qualifications must be provided as an array of strings'),

  body('qualifications.*')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Each qualification cannot exceed 100 characters'),

  body('clinicName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Clinic name cannot exceed 100 characters'),

  body('clinicAddress')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Clinic address cannot exceed 200 characters'),

  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City cannot exceed 100 characters'),

  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country cannot exceed 100 characters'),

  body('cancellationPolicy')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Cancellation policy cannot exceed 500 characters'),

  body('isVisible')
    .optional()
    .isBoolean()
    .withMessage('isVisible must be a boolean (true or false)'),

  validate,
];

/**
 * Validation rules for public directory query parameters (GET /api/specialists)
 */
const listSpecialistsValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer starting at 1'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be an integer between 1 and 50'),

  query('search')
    .optional()
    .trim(),

  query('specialty')
    .optional()
    .trim(),

  query('city')
    .optional()
    .trim(),

  query('country')
    .optional()
    .trim(),

  query('sort')
    .optional()
    .trim()
    .isIn(['name', 'name_desc', 'rating', 'experience', 'newest', 'recommended'])
    .withMessage('Invalid sort parameter'),

  validate,
];

/**
 * Validation rules for specialist ID parameter (GET /api/specialists/:id)
 */
const specialistIdValidator = [
  param('id')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid specialist ID format');
      }
      return true;
    }),

  validate,
];

module.exports = {
  updateSpecialistValidator,
  listSpecialistsValidator,
  specialistIdValidator,
};
