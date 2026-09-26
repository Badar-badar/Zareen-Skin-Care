const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const { setAuthCookie, clearAuthCookie } = require('../utils/cookies');

/**
 * @desc    Register a new user account (Patient or Specialist)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);

  // Set HTTP-only session cookie
  setAuthCookie(res, result.token);

  res.status(201).json({
    success: true,
    message: 'Registration successful. Account created.',
    data: {
      user: result.user,
    },
  });
});

/**
 * @desc    Authenticate existing user credentials and establish session
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);

  // Set HTTP-only session cookie
  setAuthCookie(res, result.token);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: result.user,
    },
  });
});

/**
 * @desc    Terminate user session and clear authentication cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * @desc    Get currently authenticated user details
 * @route   GET /api/auth/me
 * @access  Private (Protected)
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user._id);

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

/**
 * @desc    Verify email address using verification token
 * @route   POST /api/auth/verify-email
 * @access  Public
 */
const verifyEmail = asyncHandler(async (req, res) => {
  const user = await authService.verifyEmail(req.body.token);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
    data: {
      user,
    },
  });
});

/**
 * @desc    Resend verification email token
 * @route   POST /api/auth/resend-verification
 * @access  Public
 */
const resendVerification = asyncHandler(async (req, res) => {
  const result = await authService.resendVerification(req.body.email);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

/**
 * @desc    Initiate password reset flow
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

/**
 * @desc    Execute password reset with token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword({
    token: req.body.token,
    newPassword: req.body.newPassword,
  });

  // Clear any existing cookie to require fresh login
  clearAuthCookie(res);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};
