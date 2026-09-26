const ApiError = require('../utils/ApiError');

/**
 * 404 Not Found Middleware for API Routes
 * Catches unmatched requests and delegates a standardized 404 ApiError.
 */
const notFound = (req, res, next) => {
  const error = new ApiError(`API route not found: ${req.method} ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Centralized Global Error Handler Middleware
 * Normalizes Mongoose, JWT, and custom ApiErrors into structured JSON responses.
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error Handler] ${err.name || 'Error'}: ${err.message}`);
  }

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ApiError(message, 404);
  }

  // Mongoose Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `Duplicate value entered for ${field}. Please use another value.`;
    error = new ApiError(message, 400);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((val) => val.message);
    const message = messages.join(', ');
    error = new ApiError(message, 400);
  }

  // Standard JSON response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = {
  notFound,
  errorHandler,
};
