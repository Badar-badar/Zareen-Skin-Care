const crypto = require('crypto');

/**
 * Generate a unique human-friendly booking reference number
 * Example: ZSC-20260915-A8F42
 * @param {String} dateStr - YYYY-MM-DD
 * @returns {String}
 */
const generateReferenceNumber = (dateStr) => {
  const cleanDate = dateStr ? dateStr.replace(/-/g, '') : new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 5);
  return `ZSC-${cleanDate}-${randomSuffix}`;
};

module.exports = {
  generateReferenceNumber,
};
