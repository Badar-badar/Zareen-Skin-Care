const Patient = require('../models/Patient');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { formatCalendarDate, parseCalendarDate, isValidDateFormat } = require('../utils/timeHelper');

/**
 * Serialize a Patient and User document for client responses
 * @param {Object} patientDoc
 * @param {Object} userDoc
 * @returns {Object}
 */
const serializePatientProfile = (patientDoc, userDoc) => {
  const patientRaw = patientDoc.toObject ? patientDoc.toObject() : { ...patientDoc };
  const userRaw = userDoc ? (userDoc.toObject ? userDoc.toObject() : { ...userDoc }) : patientRaw.user || {};

  const firstName = userRaw.firstName || '';
  const lastName = userRaw.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();

  let dobString = '';
  if (patientRaw.dateOfBirth) {
    try {
      dobString = formatCalendarDate(patientRaw.dateOfBirth);
    } catch {
      dobString = '';
    }
  }

  return {
    id: patientRaw._id ? patientRaw._id.toString() : patientRaw.id,
    userId: userRaw._id ? userRaw._id.toString() : userRaw.id,
    firstName,
    lastName,
    name: fullName || 'Patient',
    email: userRaw.email || '',
    phone: userRaw.phone || '',
    role: userRaw.role || 'patient',
    isEmailVerified: Boolean(userRaw.isEmailVerified),
    dateOfBirth: dobString,
    gender: patientRaw.gender || 'prefer_not_to_say',
    profileImage: patientRaw.profileImage || '',
    address: patientRaw.address || '',
    city: patientRaw.city || '',
    country: patientRaw.country || '',
    emergencyContact: patientRaw.emergencyContact || {
      name: '',
      phone: '',
      relationship: '',
    },
    createdAt: patientRaw.createdAt,
    updatedAt: patientRaw.updatedAt,
  };
};

/**
 * Get authenticated patient's profile
 * @param {String} userId
 * @returns {Promise<Object>}
 */
const getMyProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError('User account not found', 404);
  }

  let patient = await Patient.findOne({ user: userId });
  if (!patient) {
    // Create default patient profile if one doesn't exist
    patient = await Patient.create({
      user: userId,
    });
  }

  return serializePatientProfile(patient, user);
};

/**
 * Update authenticated patient's profile
 * @param {String} userId
 * @param {Object} updateData
 * @returns {Promise<Object>}
 */
const updateMyProfile = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError('User account not found', 404);
  }

  let patient = await Patient.findOne({ user: userId });
  if (!patient) {
    patient = await Patient.create({ user: userId });
  }

  // 1. Update User basic fields
  if (updateData.firstName !== undefined) {
    user.firstName = updateData.firstName.trim();
  }
  if (updateData.lastName !== undefined) {
    user.lastName = updateData.lastName.trim();
  }
  if (updateData.phone !== undefined) {
    user.phone = updateData.phone.trim();
  }
  await user.save();

  // 2. Update Patient specific profile fields
  if (updateData.dateOfBirth !== undefined) {
    if (updateData.dateOfBirth && isValidDateFormat(updateData.dateOfBirth)) {
      patient.dateOfBirth = parseCalendarDate(updateData.dateOfBirth);
    } else if (!updateData.dateOfBirth) {
      patient.dateOfBirth = null;
    }
  }

  if (updateData.gender !== undefined) {
    patient.gender = updateData.gender;
  }
  if (updateData.profileImage !== undefined) {
    patient.profileImage = updateData.profileImage;
  }
  if (updateData.address !== undefined) {
    patient.address = updateData.address.trim();
  }
  if (updateData.city !== undefined) {
    patient.city = updateData.city.trim();
  }
  if (updateData.country !== undefined) {
    patient.country = updateData.country.trim();
  }

  if (updateData.emergencyContact && typeof updateData.emergencyContact === 'object') {
    patient.emergencyContact = {
      name: updateData.emergencyContact.name ? updateData.emergencyContact.name.trim() : '',
      phone: updateData.emergencyContact.phone ? updateData.emergencyContact.phone.trim() : '',
      relationship: updateData.emergencyContact.relationship ? updateData.emergencyContact.relationship.trim() : '',
    };
  }

  await patient.save();

  return serializePatientProfile(patient, user);
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};
