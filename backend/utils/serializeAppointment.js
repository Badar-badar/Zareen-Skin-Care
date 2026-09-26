const { formatCalendarDate } = require('./timeHelper');

/**
 * Format an Appointment document for clean client responses
 * @param {Object} doc - Populated appointment document
 * @returns {Object}
 */
const serializeAppointment = (doc) => {
  if (!doc) return null;
  const raw = doc.toObject ? doc.toObject() : { ...doc };

  const specialistObj = raw.specialist || {};
  const specialistUser = specialistObj.user || {};
  const specialistTitle = specialistObj.title || 'Dr.';
  const specialistName = specialistUser.firstName
    ? `${specialistTitle} ${specialistUser.firstName} ${specialistUser.lastName || ''}`.trim()
    : specialistObj.name || 'Specialist';

  const serviceObj = raw.service || {};

  return {
    id: raw._id ? raw._id.toString() : raw.id,
    referenceNumber: raw.referenceNumber,
    date: formatCalendarDate(raw.date),
    startTime: raw.startTime,
    endTime: raw.endTime,
    status: raw.status,
    patient: {
      id: raw.patient ? (raw.patient._id ? raw.patient._id.toString() : raw.patient.toString()) : undefined,
      name: raw.patientName,
      email: raw.patientEmail,
      phone: raw.patientPhone,
    },
    specialist: {
      id: specialistObj._id ? specialistObj._id.toString() : specialistObj.toString(),
      name: specialistName,
      specialty: specialistObj.specialty || '',
      clinicName: specialistObj.clinicName || '',
      clinicAddress: specialistObj.clinicAddress || '',
      city: specialistObj.city || '',
      profileImage: specialistObj.profileImage || '',
    },
    service: {
      id: serviceObj._id ? serviceObj._id.toString() : serviceObj.toString(),
      name: serviceObj.name || '',
      duration: serviceObj.duration || 0,
      price: serviceObj.price !== undefined ? serviceObj.price : 0,
    },
    patientNotes: raw.patientNotes || '',
    cancellationReason: raw.cancellationReason || '',
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
};

module.exports = {
  serializeAppointment,
};
