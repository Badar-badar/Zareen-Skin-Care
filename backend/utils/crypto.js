const crypto = require('crypto');

/**
 * Generate a cryptographically secure random token (hex string)
 * @param {Number} [bytes=32]
 * @returns {String}
 */
const generateRandomToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Hash a plain token using SHA-256 for secure database storage
 * @param {String} plainToken
 * @returns {String} Hex digest
 */
const hashToken = (plainToken) => {
  return crypto.createHash('sha256').update(plainToken).digest('hex');
};

module.exports = {
  generateRandomToken,
  hashToken,
};
