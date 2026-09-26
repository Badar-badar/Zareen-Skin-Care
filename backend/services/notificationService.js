const Notification = require('../models/Notification');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Specialist = require('../models/Specialist');
const ApiError = require('../utils/ApiError');
const { formatCalendarDate } = require('../utils/timeHelper');
const emailService = require('./emailService');

/**
 * Format a Notification document for safe client responses
 * @param {Object} doc - Notification document
 * @returns {Object}
 */
const serializeNotification = (doc) => {
  if (!doc) return null;
  const raw = doc.toObject ? doc.toObject() : { ...doc };

  return {
    id: raw._id ? raw._id.toString() : raw.id,
    type: raw.type,
    title: raw.title,
    message: raw.message,
    appointmentId: raw.appointment
      ? raw.appointment._id
        ? raw.appointment._id.toString()
        : raw.appointment.toString()
      : null,
    isRead: Boolean(raw.isRead),
    readAt: raw.readAt || null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
};

/**
 * Create a direct in-app notification for a user
 * @param {Object} data - { recipientId, type, title, message, appointmentId }
 */
const createNotification = async ({
  recipientId,
  type,
  title,
  message,
  appointmentId = null,
}) => {
  if (!recipientId || !type || !title || !message) {
    return null;
  }

  const notification = await Notification.create({
    recipient: recipientId,
    type,
    title: title.trim(),
    message: message.trim(),
    appointment: appointmentId,
    isRead: false,
    readAt: null,
  });

  return serializeNotification(notification);
};

/**
 * Helper to extract User IDs and formatted metadata from an Appointment document
 * @param {Object} appointment
 */
const resolveAppointmentUsers = async (appointment) => {
  let patientUserId = null;
  let specialistUserId = null;
  let specialistTitle = 'Dr.';
  let specialistName = 'Specialist';
  let serviceName = 'Skin Consultation';

  // 1. Resolve Patient User ID
  if (appointment.patient) {
    const patientDoc = await Patient.findById(
      appointment.patient._id || appointment.patient
    ).select('user');
    if (patientDoc && patientDoc.user) {
      patientUserId = patientDoc.user._id
        ? patientDoc.user._id.toString()
        : patientDoc.user.toString();
    }
  }

  // 2. Resolve Specialist User ID & Details
  if (appointment.specialist) {
    const specialistDoc = await Specialist.findById(
      appointment.specialist._id || appointment.specialist
    ).populate('user', 'firstName lastName email');
    if (specialistDoc) {
      if (specialistDoc.user) {
        specialistUserId = specialistDoc.user._id
          ? specialistDoc.user._id.toString()
          : specialistDoc.user.toString();
        specialistTitle = specialistDoc.title || 'Dr.';
        specialistName = `${specialistTitle} ${specialistDoc.user.firstName || ''} ${specialistDoc.user.lastName || ''}`.trim();
      }
    }
  }

  // 3. Resolve Service Name
  if (appointment.service && appointment.service.name) {
    serviceName = appointment.service.name;
  }

  const dateStr = formatCalendarDate(appointment.date);

  return {
    patientUserId,
    specialistUserId,
    specialistName,
    serviceName,
    dateStr,
  };
};

/**
 * Create and dispatch in-app notifications for appointment lifecycle events
 * @param {String} event - 'appointment_created' | 'appointment_rescheduled' | 'appointment_cancelled' | 'appointment_completed' | 'appointment_no_show' | 'appointment_reminder'
 * @param {Object} appointment - Appointment document
 * @param {Object} meta - Optional metadata (e.g., cancelledByRole, reason)
 */
const createAppointmentNotifications = async (event, appointment, meta = {}) => {
  try {
    const {
      patientUserId,
      specialistUserId,
      specialistName,
      dateStr,
    } = await resolveAppointmentUsers(appointment);

    const apptId = appointment._id ? appointment._id.toString() : appointment.id;
    const ref = appointment.referenceNumber;

    if (event === 'appointment_created') {
      // 1. Patient notification
      if (patientUserId) {
        await createNotification({
          recipientId: patientUserId,
          type: 'appointment_created',
          title: 'Appointment Confirmed',
          message: `Your consultation with ${specialistName} on ${dateStr} at ${appointment.startTime} is confirmed. (Ref: ${ref})`,
          appointmentId: apptId,
        });
      }

      // 2. Specialist notification
      if (specialistUserId) {
        await createNotification({
          recipientId: specialistUserId,
          type: 'appointment_created',
          title: 'New Consultation Booking',
          message: `New consultation booked by ${appointment.patientName} for ${dateStr} at ${appointment.startTime}. (Ref: ${ref})`,
          appointmentId: apptId,
        });
      }
    } else if (event === 'appointment_rescheduled') {
      // 1. Patient notification
      if (patientUserId) {
        await createNotification({
          recipientId: patientUserId,
          type: 'appointment_rescheduled',
          title: 'Appointment Rescheduled',
          message: `Your appointment with ${specialistName} has been rescheduled to ${dateStr} at ${appointment.startTime}. (Ref: ${ref})`,
          appointmentId: apptId,
        });
      }

      // 2. Specialist notification
      if (specialistUserId) {
        await createNotification({
          recipientId: specialistUserId,
          type: 'appointment_rescheduled',
          title: 'Appointment Rescheduled',
          message: `Consultation with ${appointment.patientName} was rescheduled to ${dateStr} at ${appointment.startTime}. (Ref: ${ref})`,
          appointmentId: apptId,
        });
      }
    } else if (event === 'appointment_cancelled') {
      if (meta.cancelledByRole === 'patient') {
        // Notify specialist
        if (specialistUserId) {
          const reasonText = meta.reason ? ` Reason: ${meta.reason.trim()}` : '';
          await createNotification({
            recipientId: specialistUserId,
            type: 'appointment_cancelled',
            title: 'Appointment Cancelled',
            message: `Appointment with ${appointment.patientName} for ${dateStr} at ${appointment.startTime} was cancelled by the patient.${reasonText} (Ref: ${ref})`,
            appointmentId: apptId,
          });
        }
      } else {
        // Notify patient
        if (patientUserId) {
          const reasonText = meta.reason ? ` Reason: ${meta.reason.trim()}` : '';
          await createNotification({
            recipientId: patientUserId,
            type: 'appointment_cancelled',
            title: 'Appointment Cancelled',
            message: `Your appointment with ${specialistName} for ${dateStr} at ${appointment.startTime} was cancelled by the specialist.${reasonText} (Ref: ${ref})`,
            appointmentId: apptId,
          });
        }
      }
    } else if (event === 'appointment_completed') {
      // Patient notification
      if (patientUserId) {
        await createNotification({
          recipientId: patientUserId,
          type: 'appointment_completed',
          title: 'Consultation Completed',
          message: `Your consultation with ${specialistName} on ${dateStr} has been marked as completed. (Ref: ${ref})`,
          appointmentId: apptId,
        });
      }
    } else if (event === 'appointment_no_show') {
      // Patient notification
      if (patientUserId) {
        await createNotification({
          recipientId: patientUserId,
          type: 'appointment_no_show',
          title: 'Missed Appointment',
          message: `Your scheduled consultation with ${specialistName} on ${dateStr} was marked as unattended. (Ref: ${ref})`,
          appointmentId: apptId,
        });
      }
    } else if (event === 'appointment_reminder') {
      // Patient notification
      if (patientUserId) {
        await createNotification({
          recipientId: patientUserId,
          type: 'appointment_reminder',
          title: 'Upcoming Appointment Reminder',
          message: `Friendly reminder: You have an upcoming consultation with ${specialistName} on ${dateStr} at ${appointment.startTime}. (Ref: ${ref})`,
          appointmentId: apptId,
        });
      }
    }
  } catch (error) {
    // Log safely without crashing the calling workflow
    console.error(
      `[NotificationService] Failed to generate appointment notification: ${error.message}`
    );
  }
};

/**
 * Retrieve paginated in-app notifications for authenticated user
 * @param {String} userId
 * @param {Object} queryParams - { unread, type, page, limit }
 */
const getUserNotifications = async (userId, queryParams = {}) => {
  const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(queryParams.limit, 10) || 20));

  const filter = { recipient: userId };

  if (queryParams.unread === 'true' || queryParams.unread === true) {
    filter.isRead = false;
  }

  if (queryParams.type && queryParams.type.trim()) {
    filter.type = queryParams.type.trim();
  }

  const [total, unreadCount, notifications] = await Promise.all([
    Notification.countDocuments(filter),
    Notification.countDocuments({ recipient: userId, isRead: false }),
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
  ]);

  return {
    notifications: notifications.map(serializeNotification),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
    unreadCount,
  };
};

/**
 * Get unread notification count for authenticated user
 * @param {String} userId
 * @returns {Promise<Number>}
 */
const getUnreadNotificationCount = async (userId) => {
  const count = await Notification.countDocuments({
    recipient: userId,
    isRead: false,
  });
  return count;
};

/**
 * Mark a single notification as read for authenticated user
 * @param {String} userId
 * @param {String} notificationId
 */
const markNotificationAsRead = async (userId, notificationId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    throw new ApiError('Notification not found or you do not have permission to view it', 404);
  }

  if (!notification.isRead) {
    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();
  }

  return serializeNotification(notification);
};

/**
 * Mark all unread notifications as read for authenticated user
 * @param {String} userId
 */
const markAllNotificationsAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { recipient: userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );

  return {
    success: true,
    modifiedCount: result.modifiedCount || 0,
  };
};

/**
 * Delete a notification owned by authenticated user
 * @param {String} userId
 * @param {String} notificationId
 */
const deleteNotification = async (userId, notificationId) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    throw new ApiError('Notification not found or you do not have permission to delete it', 404);
  }

  return { id: notificationId };
};

/**
 * Reusable function to dispatch an appointment reminder
 * @param {String} appointmentId
 */
const sendAppointmentReminder = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId).populate([
    { path: 'specialist', populate: { path: 'user', select: 'firstName lastName email' } },
    { path: 'service' },
  ]);

  if (!appointment) {
    throw new ApiError('Appointment not found', 404);
  }

  if (appointment.status !== 'confirmed') {
    throw new ApiError('Can only send reminders for confirmed appointments', 400);
  }

  // 1. Create in-app reminder notification
  await createAppointmentNotifications('appointment_reminder', appointment);

  // 2. Dispatch reminder email
  await emailService.sendAppointmentReminderEmail(appointment);

  return {
    success: true,
    message: 'Appointment reminder dispatched successfully',
  };
};

module.exports = {
  createNotification,
  createAppointmentNotifications,
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  sendAppointmentReminder,
};
