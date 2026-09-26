/**
 * Sanitize user object for safe public/client API responses
 * Strips password, tokens, internal versioning, and sensitive fields.
 * @param {Object} user - Mongoose document or plain user object
 * @param {Object} [profile] - Attached Specialist or Patient profile object
 * @returns {Object} Sanitized user payload
 */
const sanitizeUser = (user, profile = null) => {
  if (!user) return null;

  const rawUser = user.toObject ? user.toObject() : { ...user };

  delete rawUser.password;
  delete rawUser.passwordResetToken;
  delete rawUser.passwordResetExpires;
  delete rawUser.emailVerificationToken;
  delete rawUser.emailVerificationExpires;
  delete rawUser.__v;

  const sanitized = {
    id: rawUser._id ? rawUser._id.toString() : rawUser.id,
    firstName: rawUser.firstName,
    lastName: rawUser.lastName,
    fullName: `${rawUser.firstName} ${rawUser.lastName}`.trim(),
    email: rawUser.email,
    phone: rawUser.phone || '',
    role: rawUser.role,
    status: rawUser.status,
    isEmailVerified: rawUser.isEmailVerified,
    lastLoginAt: rawUser.lastLoginAt,
    createdAt: rawUser.createdAt,
    updatedAt: rawUser.updatedAt,
  };

  if (profile) {
    const rawProfile = profile.toObject ? profile.toObject() : { ...profile };
    delete rawProfile.__v;
    sanitized.profile = rawProfile;
  }

  return sanitized;
};

module.exports = sanitizeUser;
