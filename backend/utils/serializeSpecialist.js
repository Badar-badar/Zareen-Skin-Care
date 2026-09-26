/**
 * Serializer helpers for Specialist profile data
 */

/**
 * Format a Specialist document for safe public discovery/details
 * Strips private user contact, tokens, and internal database meta.
 * @param {Object} doc - Mongoose specialist document with populated user
 * @returns {Object} Publicly safe specialist data
 */
const serializePublicSpecialist = (doc) => {
  if (!doc) return null;

  const raw = doc.toObject ? doc.toObject() : { ...doc };
  const user = raw.user || {};

  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  const title = raw.title || 'Dr.';
  const fullName = `${title} ${firstName} ${lastName}`.trim();

  return {
    id: raw._id ? raw._id.toString() : raw.id,
    name: fullName,
    firstName: firstName,
    lastName: lastName,
    title: title,
    specialty: raw.specialty,
    bio: raw.bio || '',
    profileImage: raw.profileImage || '',
    licenseNumber: raw.licenseNumber || '',
    experience: raw.experience || 0,
    qualifications: raw.qualifications || [],
    clinicName: raw.clinicName || '',
    clinicAddress: raw.clinicAddress || '',
    city: raw.city || '',
    country: raw.country || '',
    cancellationPolicy: raw.cancellationPolicy || '',
    rating: raw.rating !== undefined ? raw.rating : 5.0,
    reviewCount: raw.reviewCount || 0,
    createdAt: raw.createdAt,
  };
};

/**
 * Format a Specialist document for authenticated private profile management
 * Includes visibility setting and specialist contact info.
 * @param {Object} doc - Mongoose specialist document
 * @param {Object} user - Associated User document
 * @returns {Object} Complete private specialist profile
 */
const serializePrivateSpecialist = (doc, user) => {
  if (!doc || !user) return null;

  const rawDoc = doc.toObject ? doc.toObject() : { ...doc };
  const rawUser = user.toObject ? user.toObject() : { ...user };

  const title = rawDoc.title || 'Dr.';
  const firstName = rawUser.firstName || '';
  const lastName = rawUser.lastName || '';
  const fullName = `${title} ${firstName} ${lastName}`.trim();

  return {
    id: rawDoc._id ? rawDoc._id.toString() : rawDoc.id,
    userId: rawUser._id ? rawUser._id.toString() : rawUser.id,
    name: fullName,
    firstName: firstName,
    lastName: lastName,
    email: rawUser.email,
    phone: rawUser.phone || '',
    title: title,
    specialty: rawDoc.specialty,
    bio: rawDoc.bio || '',
    profileImage: rawDoc.profileImage || '',
    licenseNumber: rawDoc.licenseNumber || '',
    experience: rawDoc.experience || 0,
    qualifications: rawDoc.qualifications || [],
    clinicName: rawDoc.clinicName || '',
    clinicAddress: rawDoc.clinicAddress || '',
    city: rawDoc.city || '',
    country: rawDoc.country || '',
    cancellationPolicy: rawDoc.cancellationPolicy || '',
    isVisible: rawDoc.isVisible !== undefined ? rawDoc.isVisible : true,
    rating: rawDoc.rating !== undefined ? rawDoc.rating : 5.0,
    reviewCount: rawDoc.reviewCount || 0,
    createdAt: rawDoc.createdAt,
    updatedAt: rawDoc.updatedAt,
  };
};

module.exports = {
  serializePublicSpecialist,
  serializePrivateSpecialist,
};
