const nodemailer = require('nodemailer');
const {
  getVerificationEmailTemplate,
  getPasswordResetEmailTemplate,
  getAppointmentCreatedEmailTemplate,
  getAppointmentRescheduledEmailTemplate,
  getAppointmentCancelledEmailTemplate,
  getAppointmentCompletedEmailTemplate,
  getAppointmentNoShowEmailTemplate,
  getAppointmentReminderEmailTemplate,
} = require('../utils/emailTemplates');
const { formatCalendarDate } = require('../utils/timeHelper');

/**
 * Check if SMTP credentials and host are configured
 * @returns {Boolean}
 */
const isMailConfigured = () => {
  const host = process.env.SMTP_HOST || process.env.MAIL_HOST;
  const user = process.env.SMTP_USER || process.env.MAIL_USER;
  return Boolean(host && user);
};

/**
 * Create Nodemailer Transporter
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST || process.env.MAIL_HOST;
  const port = parseInt(process.env.SMTP_PORT || process.env.MAIL_PORT, 10) || 587;
  const user = process.env.SMTP_USER || process.env.MAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.MAIL_PASSWORD;
  const secure =
    process.env.SMTP_SECURE === 'true' ||
    process.env.MAIL_SECURE === 'true' ||
    port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Generic Mail Sender
 * Gracefully skips when SMTP is unconfigured and logs errors safely without leaking credentials.
 * @param {Object} options - { to, subject, html, text }
 * @returns {Promise<{ success: Boolean, messageId?: String, skipped?: Boolean, error?: String }>}
 */
const sendEmail = async ({ to, subject, html, text }) => {
  if (!isMailConfigured()) {
    console.log(
      `[EmailService] SMTP not configured. Skipped sending email to <${to}>: "${subject}"`
    );
    return { success: false, skipped: true, reason: 'SMTP not configured' };
  }

  try {
    const transporter = createTransporter();
    const fromEmail =
      process.env.FROM_EMAIL || process.env.MAIL_FROM || 'no-reply@zareenskincare.com';
    const fromName =
      process.env.FROM_NAME || process.env.MAIL_FROM_NAME || 'Zareen Skin Care';

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Email sent successfully to <${to}>: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(
      `[EmailService] Failed to send email to <${to}>:`,
      error.message
    );
    return { success: false, error: error.message };
  }
};

/**
 * 1. Send Email Verification Link
 * @param {Object} user - User document
 * @param {String} rawToken - Plaintext verification token
 */
const sendVerificationEmail = async (user, rawToken) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const verificationUrl = `${clientUrl}/verify-email?token=${rawToken}`;
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  const template = getVerificationEmailTemplate({
    name: fullName,
    verificationUrl,
  });

  return sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
};

/**
 * 2. Send Password Reset Instructions
 * @param {Object} user - User document
 * @param {String} rawToken - Plaintext reset token
 */
const sendPasswordResetEmail = async (user, rawToken) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/reset-password?token=${rawToken}`;
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  const template = getPasswordResetEmailTemplate({
    name: fullName,
    resetUrl,
  });

  return sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
};

/**
 * Helper to extract Specialist and Service metadata from populated appointment
 */
const getAppointmentMeta = (appointment) => {
  const specialistDoc = appointment.specialist || {};
  const specialistUser = specialistDoc.user || {};
  const specialistTitle = specialistDoc.title || 'Dr.';
  const specialistName = specialistUser.firstName
    ? `${specialistTitle} ${specialistUser.firstName} ${specialistUser.lastName || ''}`.trim()
    : specialistDoc.name || 'Specialist';
  const specialistEmail = specialistUser.email || '';

  const serviceDoc = appointment.service || {};
  const serviceName = serviceDoc.name || 'Skin Consultation';

  const dateStr = formatCalendarDate(appointment.date);

  return {
    specialistName,
    specialistEmail,
    serviceName,
    dateStr,
  };
};

/**
 * 3. Send Booking Emails (Patient confirmation + Specialist booking notification)
 * @param {Object} appointment - Populated Appointment document
 */
const sendAppointmentBookingEmails = async (appointment) => {
  const { specialistName, specialistEmail, serviceName, dateStr } =
    getAppointmentMeta(appointment);

  const patientTemplate = getAppointmentCreatedEmailTemplate({
    recipientName: appointment.patientName,
    isSpecialist: false,
    patientName: appointment.patientName,
    specialistName,
    serviceName,
    date: dateStr,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    referenceNumber: appointment.referenceNumber,
  });

  // 1. Email Patient
  const patientPromise = sendEmail({
    to: appointment.patientEmail,
    subject: patientTemplate.subject,
    html: patientTemplate.html,
    text: patientTemplate.text,
  });

  // 2. Email Specialist (if email available)
  let specialistPromise = Promise.resolve();
  if (specialistEmail) {
    const specialistTemplate = getAppointmentCreatedEmailTemplate({
      recipientName: specialistName,
      isSpecialist: true,
      patientName: appointment.patientName,
      specialistName,
      serviceName,
      date: dateStr,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      referenceNumber: appointment.referenceNumber,
    });

    specialistPromise = sendEmail({
      to: specialistEmail,
      subject: specialistTemplate.subject,
      html: specialistTemplate.html,
      text: specialistTemplate.text,
    });
  }

  return Promise.allSettled([patientPromise, specialistPromise]);
};

/**
 * 4. Send Reschedule Emails to both Patient and Specialist
 * @param {Object} appointment - Populated Appointment document
 */
const sendAppointmentRescheduleEmails = async (appointment) => {
  const { specialistName, specialistEmail, serviceName, dateStr } =
    getAppointmentMeta(appointment);

  const patientTemplate = getAppointmentRescheduledEmailTemplate({
    recipientName: appointment.patientName,
    isSpecialist: false,
    patientName: appointment.patientName,
    specialistName,
    serviceName,
    newDate: dateStr,
    newStartTime: appointment.startTime,
    newEndTime: appointment.endTime,
    referenceNumber: appointment.referenceNumber,
  });

  const patientPromise = sendEmail({
    to: appointment.patientEmail,
    subject: patientTemplate.subject,
    html: patientTemplate.html,
    text: patientTemplate.text,
  });

  let specialistPromise = Promise.resolve();
  if (specialistEmail) {
    const specialistTemplate = getAppointmentRescheduledEmailTemplate({
      recipientName: specialistName,
      isSpecialist: true,
      patientName: appointment.patientName,
      specialistName,
      serviceName,
      newDate: dateStr,
      newStartTime: appointment.startTime,
      newEndTime: appointment.endTime,
      referenceNumber: appointment.referenceNumber,
    });

    specialistPromise = sendEmail({
      to: specialistEmail,
      subject: specialistTemplate.subject,
      html: specialistTemplate.html,
      text: specialistTemplate.text,
    });
  }

  return Promise.allSettled([patientPromise, specialistPromise]);
};

/**
 * 5. Send Cancellation Email to the other party
 * @param {Object} appointment - Populated Appointment document
 * @param {String} cancelledByRole - 'patient' or 'specialist'
 * @param {String} reason - Optional cancellation reason
 */
const sendAppointmentCancellationEmail = async (
  appointment,
  cancelledByRole,
  reason = ''
) => {
  const { specialistName, specialistEmail, serviceName, dateStr } =
    getAppointmentMeta(appointment);

  if (cancelledByRole === 'patient') {
    // Notify Specialist
    if (!specialistEmail) return Promise.resolve();
    const template = getAppointmentCancelledEmailTemplate({
      recipientName: specialistName,
      isSpecialist: true,
      cancelledBy: 'Patient',
      serviceName,
      date: dateStr,
      startTime: appointment.startTime,
      referenceNumber: appointment.referenceNumber,
      reason,
    });

    return sendEmail({
      to: specialistEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  } else {
    // Notify Patient
    const template = getAppointmentCancelledEmailTemplate({
      recipientName: appointment.patientName,
      isSpecialist: false,
      cancelledBy: 'Specialist',
      serviceName,
      date: dateStr,
      startTime: appointment.startTime,
      referenceNumber: appointment.referenceNumber,
      reason,
    });

    return sendEmail({
      to: appointment.patientEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }
};

/**
 * 6. Send Consultation Completion Email to Patient
 * @param {Object} appointment - Populated Appointment document
 */
const sendAppointmentCompletedEmail = async (appointment) => {
  const { specialistName, serviceName, dateStr } = getAppointmentMeta(appointment);

  const template = getAppointmentCompletedEmailTemplate({
    patientName: appointment.patientName,
    specialistName,
    serviceName,
    date: dateStr,
    referenceNumber: appointment.referenceNumber,
  });

  return sendEmail({
    to: appointment.patientEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
};

/**
 * 7. Send Missed Appointment (No-Show) Email to Patient
 * @param {Object} appointment - Populated Appointment document
 */
const sendAppointmentNoShowEmail = async (appointment) => {
  const { specialistName, serviceName, dateStr } = getAppointmentMeta(appointment);

  const template = getAppointmentNoShowEmailTemplate({
    patientName: appointment.patientName,
    specialistName,
    serviceName,
    date: dateStr,
    referenceNumber: appointment.referenceNumber,
  });

  return sendEmail({
    to: appointment.patientEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
};

/**
 * 8. Send Appointment Reminder Email to Patient
 * @param {Object} appointment - Populated Appointment document
 */
const sendAppointmentReminderEmail = async (appointment) => {
  const { specialistName, serviceName, dateStr } = getAppointmentMeta(appointment);

  const template = getAppointmentReminderEmailTemplate({
    patientName: appointment.patientName,
    specialistName,
    serviceName,
    date: dateStr,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    referenceNumber: appointment.referenceNumber,
  });

  return sendEmail({
    to: appointment.patientEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
};

module.exports = {
  isMailConfigured,
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendAppointmentBookingEmails,
  sendAppointmentRescheduleEmails,
  sendAppointmentCancellationEmail,
  sendAppointmentCompletedEmail,
  sendAppointmentNoShowEmail,
  sendAppointmentReminderEmail,
};
