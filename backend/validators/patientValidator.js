const { body, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');
const { isValidDateFormat } = require('../utils/timeHelper');

/**
 * Validation error handler middleware
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
 * Validation rules for updating authenticated patient's profile (PATCH /api/patients/me)
 */
const updatePatientValidator = [
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
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),

  body('phone')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Phone number cannot exceed 30 characters'),

  body('dateOfBirth')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (value && !isValidDateFormat(value)) {
        throw new Error('Date of birth must follow YYYY-MM-DD format');
      }
      return true;
    }),

  body('gender')
    .optional()
    .isIn(['female', 'male', 'other', 'prefer_not_to_say'])
    .withMessage('Invalid gender option'),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address cannot exceed 200 characters'),

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

  body('emergencyContact.name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Emergency contact name cannot exceed 100 characters'),

  body('emergencyContact.phone')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Emergency contact phone cannot exceed 30 characters'),

  body('emergencyContact.relationship')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Emergency contact relationship cannot exceed 50 characters'),

  validate,
];

module.exports = {
  updatePatientValidator,
};
