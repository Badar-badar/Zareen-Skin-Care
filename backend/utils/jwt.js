const jwt = require('jsonwebtoken');

/**
 * Generate a signed JSON Web Token
 * @param {Object} payload - { userId, role }
 * @param {String} [expiresIn] - Custom expiration override
 * @returns {String} Signed JWT
 */
const generateToken = (payload, expiresIn) => {
  const secret = process.env.JWT_SECRET || 'zareen_skin_care_jwt_dev_secret_2026_key';
  const expiration = expiresIn || process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(payload, secret, {
    expiresIn: expiration,
  });
};

/**
 * Verify and decode a JSON Web Token
 * @param {String} token
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'zareen_skin_care_jwt_dev_secret_2026_key';
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken,
};
