/**
 * Async Handler wrapper for Express route controllers
 * Catches rejected Promises and passes errors to centralized error middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
