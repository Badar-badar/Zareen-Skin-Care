const { body, param, query, validationResult } = require('express-validator');
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

/**
 * Validation rules for creating a specialist service (POST /api/services)
 */
const createServiceValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Service name is required')
    .isLength({ max: 150 })
    .withMessage('Service name cannot exceed 150 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Service description cannot exceed 1000 characters'),

  body('duration')
    .notEmpty()
    .withMessage('Service duration is required')
    .isInt({ min: 5, max: 480 })
    .withMessage('Duration must be an integer between 5 and 480 minutes'),

  body('price')
    .notEmpty()
    .withMessage('Service price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a number equal to or greater than 0'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean (true or false)'),

  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('sortOrder must be a positive integer'),

  validate,
];

/**
 * Validation rules for updating a specialist service (PATCH /api/services/:id)
 */
const updateServiceValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Service name cannot be empty')
    .isLength({ max: 150 })
    .withMessage('Service name cannot exceed 150 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Service description cannot exceed 1000 characters'),

  body('duration')
    .optional()
    .isInt({ min: 5, max: 480 })
    .withMessage('Duration must be an integer between 5 and 480 minutes'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a number equal to or greater than 0'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean (true or false)'),

  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('sortOrder must be a positive integer'),

  validate,
];

/**
 * Validation rules for service ID parameter
 */
const serviceIdValidator = [
  param('id').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid service ID format');
    }
    return true;
  }),

  validate,
];

module.exports = {
  createServiceValidator,
  updateServiceValidator,
  serviceIdValidator,
};
