const { body, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Middleware to check validation results and pass standardized ApiError on failure
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
 * Validation rules for user registration
 */
const registerValidator = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('phone')
    .optional()
    .trim(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['patient', 'specialist'])
    .withMessage('Role must be either patient or specialist. Admin registration is not permitted.'),

  // Specialist-specific validation
  body('specialty')
    .if(body('role').equals('specialist'))
    .notEmpty()
    .withMessage('Specialty is required for specialist registration')
    .isIn(allowedSpecialties)
    .withMessage(`Specialty must be one of: ${allowedSpecialties.join(', ')}`),

  body('location')
    .optional()
    .trim(),

  body('city')
    .optional()
    .trim(),

  validate,
];

/**
 * Validation rules for user login
 */
const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  validate,
];

/**
 * Validation rules for email verification
 */
const verifyEmailValidator = [
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Verification token is required'),

  validate,
];

/**
 * Validation rules for resending verification email
 */
const resendVerificationValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  validate,
];

/**
 * Validation rules for forgot password request
 */
const forgotPasswordValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  validate,
];

/**
 * Validation rules for password reset execution
 */
const resetPasswordValidator = [
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Reset token is required'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  validate,
];

module.exports = {
  validate,
  registerValidator,
  loginValidator,
  verifyEmailValidator,
  resendVerificationValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
};
