const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { verifyToken } = require('../utils/jwt');
const { getCookieName } = require('../utils/cookies');

/**
 * Authentication Middleware
 * Protects private routes by extracting and validating the JWT from HTTP-only cookie or Bearer header.
 */
const authenticate = asyncHandler(async (req, res, next) => {
  let token = null;

  // 1. Check HTTP-only cookie first
  const cookieName = getCookieName();
  if (req.cookies && req.cookies[cookieName]) {
    token = req.cookies[cookieName];
  } else if (req.cookies && req.cookies.auth_token) {
    token = req.cookies.auth_token;
  }
  // 2. Fallback to Authorization Bearer header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError('Authentication required. Please log in to continue.', 401);
  }

  try {
    // 3. Verify token
    const decoded = verifyToken(token);

    // 4. Load current user record
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new ApiError('User account associated with this session no longer exists.', 401);
    }

    // 5. Check account status
    if (user.status === 'suspended') {
      throw new ApiError('Your account has been suspended. Please contact support.', 403);
    }
    if (user.status === 'inactive') {
      throw new ApiError('Your account is currently inactive. Please contact support.', 403);
    }

    // 6. Attach sanitized user metadata to request
    req.user = user;
    req.userId = user._id.toString();
    req.userRole = user.role;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new ApiError('Session expired or invalid. Please log in again.', 401);
    }
    throw error;
  }
});

module.exports = {
  authenticate,
};
