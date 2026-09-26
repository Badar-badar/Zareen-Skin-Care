const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Specialist = require('../models/Specialist');
const Patient = require('../models/Patient');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/jwt');
const { generateRandomToken, hashToken } = require('../utils/crypto');
const sanitizeUser = require('../utils/sanitizeUser');
const emailService = require('./emailService');

/**
 * Register a new User and associated Specialist or Patient profile
 */
const registerUser = async (registrationData) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    role,
    specialty,
    location,
    city,
  } = registrationData;

  // 1. Guard against admin registration through public endpoint
  if (role === 'admin') {
    throw new ApiError('Admin accounts cannot be created through public registration', 403);
  }

  // 2. Check for duplicate email
  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    throw new ApiError('An account with this email already exists', 400);
  }

  // 3. Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 4. Generate email verification token (24-hour validity)
  const rawVerificationToken = generateRandomToken(32);
  const hashedVerificationToken = hashToken(rawVerificationToken);
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // 5. Create User record
  const user = await User.create({
    firstName,
    lastName,
    email: email.toLowerCase().trim(),
    phone: phone || '',
    password: hashedPassword,
    role: role || 'patient',
    status: 'active',
    isEmailVerified: false,
    emailVerificationToken: hashedVerificationToken,
    emailVerificationExpires: verificationExpires,
  });

  // 6. Create associated profile based on role
  let profile = null;
  try {
    if (user.role === 'specialist') {
      profile = await Specialist.create({
        user: user._id,
        specialty: specialty || 'Dermatologist',
        city: city || location || '',
        clinicAddress: location || '',
      });
    } else if (user.role === 'patient') {
      profile = await Patient.create({
        user: user._id,
        city: city || location || '',
      });
    }
  } catch (profileError) {
    // Clean up created user to prevent orphaned data
    await User.findByIdAndDelete(user._id);
    throw new ApiError(`Failed to initialize ${user.role} profile: ${profileError.message}`, 500);
  }

  // 7. Generate JWT authentication token
  const token = generateToken({
    userId: user._id.toString(),
    role: user.role,
  });

  // 8. Dispatch email verification in background (safely)
  emailService
    .sendVerificationEmail(user, rawVerificationToken)
    .catch((err) => console.error('[Email] verification send error:', err.message));

  return {
    user: sanitizeUser(user, profile),
    token,
  };
};

/**
 * Authenticate User credentials and issue session JWT
 */
const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Retrieve user including hidden password
  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) {
    throw new ApiError('Invalid email or password', 401);
  }

  // 2. Check account status
  if (user.status === 'suspended') {
    throw new ApiError('Your account has been suspended. Please contact support.', 403);
  }
  if (user.status === 'inactive') {
    throw new ApiError('Your account is currently inactive. Please contact support.', 403);
  }

  // 3. Compare password hash
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError('Invalid email or password', 401);
  }

  // 4. Update last login timestamp
  user.lastLoginAt = new Date();
  await user.save();

  // 5. Load associated profile
  let profile = null;
  if (user.role === 'specialist') {
    profile = await Specialist.findOne({ user: user._id });
  } else if (user.role === 'patient') {
    profile = await Patient.findOne({ user: user._id });
  }

  // 6. Generate JWT token
  const token = generateToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return {
    user: sanitizeUser(user, profile),
    token,
  };
};

/**
 * Retrieve authenticated user profile by ID
 */
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError('User account not found', 404);
  }

  if (user.status !== 'active') {
    throw new ApiError('Account is not active', 403);
  }

  let profile = null;
  if (user.role === 'specialist') {
    profile = await Specialist.findOne({ user: user._id });
  } else if (user.role === 'patient') {
    profile = await Patient.findOne({ user: user._id });
  }

  return sanitizeUser(user, profile);
};

/**
 * Verify User email using raw token
 */
const verifyEmail = async (rawToken) => {
  const hashed = hashToken(rawToken.trim());

  const user = await User.findOne({
    emailVerificationToken: hashed,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new ApiError('Invalid or expired email verification token', 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  let profile = null;
  if (user.role === 'specialist') {
    profile = await Specialist.findOne({ user: user._id });
  } else if (user.role === 'patient') {
    profile = await Patient.findOne({ user: user._id });
  }

  return sanitizeUser(user, profile);
};

/**
 * Resend email verification token
 */
const resendVerification = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (user && !user.isEmailVerified) {
    const rawToken = generateRandomToken(32);
    user.emailVerificationToken = hashToken(rawToken);
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    // Dispatch verification email in background (safely)
    emailService
      .sendVerificationEmail(user, rawToken)
      .catch((err) => console.error('[Email] resend verification error:', err.message));

    return {
      success: true,
      message: 'If the account exists and is unverified, a verification link has been sent.',
    };
  }

  return {
    success: true,
    message: 'If the account exists and is unverified, a verification link has been sent.',
  };
};

/**
 * Initiate password reset workflow
 */
const forgotPassword = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (user && user.status === 'active') {
    const rawToken = generateRandomToken(32);
    user.passwordResetToken = hashToken(rawToken);
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour validity
    await user.save();

    // Dispatch password reset email in background (safely)
    emailService
      .sendPasswordResetEmail(user, rawToken)
      .catch((err) => console.error('[Email] password reset error:', err.message));

    return {
      success: true,
      message: 'If an account exists with that email, password reset instructions have been sent.',
    };
  }

  return {
    success: true,
    message: 'If an account exists with that email, password reset instructions have been sent.',
  };
};

/**
 * Execute password reset with valid token and new password
 */
const resetPassword = async ({ token, newPassword }) => {
  const hashed = hashToken(token.trim());

  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new ApiError('Invalid or expired password reset token', 400);
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return {
    success: true,
    message: 'Password has been reset successfully. Please log in with your new password.',
  };
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};
