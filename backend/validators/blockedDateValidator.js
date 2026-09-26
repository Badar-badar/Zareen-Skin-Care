const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const { isValidDateFormat } = require('../utils/timeHelper');

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
 * Validator for adding a blocked date
 */
const addBlockedDateValidator = [
  body('date')
    .notEmpty()
    .withMessage('Date is required (YYYY-MM-DD)')
    .custom((value) => {
      if (!isValidDateFormat(value)) {
        throw new Error('Date must be formatted as YYYY-MM-DD');
      }
      return true;
    }),

  body('reason')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Reason cannot exceed 200 characters'),

  validate,
];

/**
 * Validator for updating a blocked date
 */
const updateBlockedDateValidator = [
  body('date')
    .optional()
    .custom((value) => {
      if (!isValidDateFormat(value)) {
        throw new Error('Date must be formatted as YYYY-MM-DD');
      }
      return true;
    }),

  body('reason')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Reason cannot exceed 200 characters'),

  validate,
];

/**
 * Validator for blocked date ID parameter
 */
const blockedDateIdValidator = [
  param('id').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid blocked date ID format');
    }
    return true;
  }),

  validate,
];

module.exports = {
  addBlockedDateValidator,
  updateBlockedDateValidator,
  blockedDateIdValidator,
};
