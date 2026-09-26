const ApiError = require('../utils/ApiError');

/**
 * Role-Based Access Control Middleware
 * Restricts route access to specified user roles (e.g., 'specialist', 'patient', 'admin').
 * @param  {...String} allowedRoles
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError('Authentication required before role authorization.', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          `Access denied. Role '${req.user.role}' is not authorized to perform this action.`,
          403
        )
      );
    }

    next();
  };
};

module.exports = {
  authorizeRoles,
};
