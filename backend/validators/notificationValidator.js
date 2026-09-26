const { param, query, validationResult } = require('express-validator');
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
 * Validation rules for querying user notifications (GET /api/notifications)
 */
const listNotificationsValidator = [
  query('unread')
    .optional()
    .trim()
    .isIn(['true', 'false'])
    .withMessage('unread parameter must be true or false'),

  query('type')
    .optional()
    .trim()
    .isIn([
      'appointment_created',
      'appointment_rescheduled',
      'appointment_cancelled',
      'appointment_completed',
      'appointment_no_show',
      'appointment_reminder',
      'system',
    ])
    .withMessage('Invalid notification type filter'),

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
 * Validation rules for notification ID parameter
 */
const notificationIdValidator = [
  param('id').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid notification ID format');
    }
    return true;
  }),

  validate,
];

module.exports = {
  listNotificationsValidator,
  notificationIdValidator,
};
