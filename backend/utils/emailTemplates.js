/**
 * Email Templates for Zareen Skin Care
 * Provides clean, responsive HTML and plain-text email templates.
 * Designed to be privacy-conscious with no sensitive medical or diagnostic details.
 */

const baseEmailLayout = (title, contentHtml) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; font-size: 14px; opacity: 0.9; }
    .content { padding: 32px 28px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .card-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .card-row:last-child { border-bottom: none; }
    .card-label { color: #64748b; font-weight: 500; }
    .card-value { color: #0f172a; font-weight: 600; text-align: right; }
    .button { display: inline-block; background-color: #0d9488; color: #ffffff !important; padding: 12px 28px; border-radius: 6px; font-weight: 600; text-decoration: none; margin: 20px 0; font-size: 15px; }
    .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .footer p { margin: 4px 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Zareen Skin Care</h1>
      <p>Specialist Dermatology & Skin Health Platform</p>
    </div>
    <div class="content">
      ${contentHtml}
    </div>
    <div class="footer">
      <p>This is an automated notification from Zareen Skin Care.</p>
      <p>Please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * 1. Email Verification Template
 */
const getVerificationEmailTemplate = ({ name, verificationUrl }) => {
  const html = baseEmailLayout(
    'Verify Your Email',
    `
    <h2 style="margin-top: 0; color: #0f172a;">Welcome to Zareen Skin Care, ${name}!</h2>
    <p style="color: #475569; font-size: 15px; line-height: 1.6;">
      Thank you for creating an account. Please verify your email address to complete your registration and secure your profile.
    </p>
    <div style="text-align: center;">
      <a href="${verificationUrl}" class="button">Verify Email Address</a>
    </div>
    <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
      Or copy and paste this link into your browser:<br>
      <a href="${verificationUrl}" style="color: #0d9488; word-break: break-all;">${verificationUrl}</a>
    </p>
    <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
      This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.
    </p>
    `
  );

  const text = `
Welcome to Zareen Skin Care, ${name}!

Please verify your email address by visiting the link below:
${verificationUrl}

This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.

— Zareen Skin Care Team
  `.trim();

  return { html, text, subject: 'Verify your Zareen Skin Care email address' };
};

/**
 * 2. Password Reset Template
 */
const getPasswordResetEmailTemplate = ({ name, resetUrl }) => {
  const html = baseEmailLayout(
    'Password Reset Request',
    `
    <h2 style="margin-top: 0; color: #0f172a;">Password Reset Request</h2>
    <p style="color: #475569; font-size: 15px; line-height: 1.6;">
      Hello ${name}, we received a request to reset your Zareen Skin Care account password. Click the button below to set a new password.
    </p>
    <div style="text-align: center;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </div>
    <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
      Or copy and paste this link into your browser:<br>
      <a href="${resetUrl}" style="color: #0d9488; word-break: break-all;">${resetUrl}</a>
    </p>
    <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
      This link is valid for 1 hour. If you did not request a password reset, your account is secure and no action is needed.
    </p>
    `
  );

  const text = `
Password Reset Request - Zareen Skin Care

Hello ${name}, we received a request to reset your password. Use the link below:
${resetUrl}

This link is valid for 1 hour. If you did not request this, you can safely ignore this message.

— Zareen Skin Care Team
  `.trim();

  return { html, text, subject: 'Reset your Zareen Skin Care password' };
};

/**
 * 3. Appointment Created Template
 */
const getAppointmentCreatedEmailTemplate = ({
  recipientName,
  isSpecialist,
  patientName,
  specialistName,
  serviceName,
  date,
  startTime,
  endTime,
  referenceNumber,
}) => {
  const title = isSpecialist ? 'New Consultation Booking' : 'Appointment Confirmed';
  const subtitle = isSpecialist
    ? `You have a new consultation booked by ${patientName}.`
    : `Your consultation appointment with ${specialistName} is confirmed.`;

  const html = baseEmailLayout(
    title,
    `
    <h2 style="margin-top: 0; color: #0f172a;">${title}</h2>
    <p style="color: #475569; font-size: 15px; line-height: 1.6;">
      Hello ${recipientName}, ${subtitle}
    </p>
    <div class="card">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Reference:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${referenceNumber}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Specialist:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${specialistName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Patient:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${patientName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Service:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${serviceName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Date:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${date}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Time:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${startTime} – ${endTime}</td>
        </tr>
      </table>
    </div>
    <p style="color: #64748b; font-size: 13px;">
      Please arrive on time. If you need to make changes, you can manage your booking via your dashboard.
    </p>
    `
  );

  const text = `
${title} - Zareen Skin Care

Hello ${recipientName},
${subtitle}

Reference: ${referenceNumber}
Specialist: ${specialistName}
Patient: ${patientName}
Service: ${serviceName}
Date: ${date}
Time: ${startTime} - ${endTime}

— Zareen Skin Care Team
  `.trim();

  return { html, text, subject: `${title}: ${referenceNumber}` };
};

/**
 * 4. Appointment Rescheduled Template
 */
const getAppointmentRescheduledEmailTemplate = ({
  recipientName,
  isSpecialist,
  patientName,
  specialistName,
  serviceName,
  newDate,
  newStartTime,
  newEndTime,
  referenceNumber,
}) => {
  const title = 'Appointment Rescheduled';
  const subtitle = isSpecialist
    ? `The appointment with ${patientName} has been rescheduled to a new date and time.`
    : `Your consultation with ${specialistName} has been rescheduled to a new date and time.`;

  const html = baseEmailLayout(
    title,
    `
    <h2 style="margin-top: 0; color: #0f172a;">${title}</h2>
    <p style="color: #475569; font-size: 15px; line-height: 1.6;">
      Hello ${recipientName}, ${subtitle}
    </p>
    <div class="card">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Reference:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${referenceNumber}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Specialist:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${specialistName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Patient:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${patientName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Service:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${serviceName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px;">New Date:</td>
          <td style="padding: 6px 0; color: #0d9488; font-weight: 700; font-size: 14px; text-align: right;">${newDate}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px;">New Time:</td>
          <td style="padding: 6px 0; color: #0d9488; font-weight: 700; font-size: 14px; text-align: right;">${newStartTime} – ${newEndTime}</td>
        </tr>
      </table>
    </div>
    `
  );

  const text = `
Appointment Rescheduled - Zareen Skin Care

Hello ${recipientName},
${subtitle}

Reference: ${referenceNumber}
Specialist: ${specialistName}
Patient: ${patientName}
Service: ${serviceName}
New Date: ${newDate}
New Time: ${newStartTime} - ${newEndTime}

— Zareen Skin Care Team
  `.trim();

  return { html, text, subject: `Rescheduled: Appointment ${referenceNumber}` };
};

/**
 * 5. Appointment Cancelled Template
 */
const getAppointmentCancelledEmailTemplate = ({
  recipientName,
  isSpecialist,
  cancelledBy,
  serviceName,
  date,
  startTime,
  referenceNumber,
  reason,
}) => {
  const title = 'Appointment Cancelled';
  const subtitle = `The consultation appointment scheduled for ${date} at ${startTime} has been cancelled by the ${cancelledBy}.`;

  const html = baseEmailLayout(
    title,
    `
    <h2 style="margin-top: 0; color: #0f172a;">${title}</h2>
    <p style="color: #475569; font-size: 15px; line-height: 1.6;">
      Hello ${recipientName}, ${subtitle}
    </p>
    <div class="card">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Reference:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${referenceNumber}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Service:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${serviceName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Original Date:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${date}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Original Time:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${startTime}</td>
        </tr>
        ${
          reason
            ? `
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Reason:</td>
          <td style="padding: 6px 0; color: #475569; font-size: 14px; text-align: right;">${reason}</td>
        </tr>
        `
            : ''
        }
      </table>
    </div>
    <p style="color: #64748b; font-size: 13px;">
      The scheduled time slot has been released. You can book a new consultation at any time.
    </p>
    `
  );

  const text = `
Appointment Cancelled - Zareen Skin Care

Hello ${recipientName},
${subtitle}

Reference: ${referenceNumber}
Service: ${serviceName}
Date: ${date}
Time: ${startTime}
${reason ? `Reason: ${reason}\n` : ''}
— Zareen Skin Care Team
  `.trim();

  return { html, text, subject: `Cancelled: Appointment ${referenceNumber}` };
};

/**
 * 6. Appointment Completed Template
 */
const getAppointmentCompletedEmailTemplate = ({
  patientName,
  specialistName,
  serviceName,
  date,
  referenceNumber,
}) => {
  const title = 'Consultation Completed';

  const html = baseEmailLayout(
    title,
    `
    <h2 style="margin-top: 0; color: #0f172a;">${title}</h2>
    <p style="color: #475569; font-size: 15px; line-height: 1.6;">
      Hello ${patientName}, your consultation with ${specialistName} on ${date} has been marked as completed.
    </p>
    <div class="card">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Reference:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${referenceNumber}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Specialist:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${specialistName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Service:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${serviceName}</td>
        </tr>
      </table>
    </div>
    <p style="color: #64748b; font-size: 13px;">
      Thank you for choosing Zareen Skin Care for your specialist consultation.
    </p>
    `
  );

  const text = `
Consultation Completed - Zareen Skin Care

Hello ${patientName},
Your consultation with ${specialistName} on ${date} has been marked as completed.

Reference: ${referenceNumber}
Specialist: ${specialistName}
Service: ${serviceName}

— Zareen Skin Care Team
  `.trim();

  return { html, text, subject: `Completed: Appointment ${referenceNumber}` };
};

/**
 * 7. Appointment No-Show Template
 */
const getAppointmentNoShowEmailTemplate = ({
  patientName,
  specialistName,
  serviceName,
  date,
  referenceNumber,
}) => {
  const title = 'Missed Appointment Notification';

  const html = baseEmailLayout(
    title,
    `
    <h2 style="margin-top: 0; color: #0f172a;">${title}</h2>
    <p style="color: #475569; font-size: 15px; line-height: 1.6;">
      Hello ${patientName}, your scheduled appointment with ${specialistName} on ${date} was marked as unattended.
    </p>
    <div class="card">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Reference:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${referenceNumber}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Specialist:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${specialistName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Service:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${serviceName}</td>
        </tr>
      </table>
    </div>
    <p style="color: #64748b; font-size: 13px;">
      If you need to reschedule, please visit your dashboard to book a new appointment slot.
    </p>
    `
  );

  const text = `
Missed Appointment Notification - Zareen Skin Care

Hello ${patientName},
Your scheduled appointment with ${specialistName} on ${date} was marked as unattended.

Reference: ${referenceNumber}
Specialist: ${specialistName}
Service: ${serviceName}

— Zareen Skin Care Team
  `.trim();

  return { html, text, subject: `Status Update: Appointment ${referenceNumber}` };
};

/**
 * 8. Appointment Reminder Template
 */
const getAppointmentReminderEmailTemplate = ({
  patientName,
  specialistName,
  serviceName,
  date,
  startTime,
  endTime,
  referenceNumber,
}) => {
  const title = 'Upcoming Appointment Reminder';

  const html = baseEmailLayout(
    title,
    `
    <h2 style="margin-top: 0; color: #0f172a;">${title}</h2>
    <p style="color: #475569; font-size: 15px; line-height: 1.6;">
      Hello ${patientName}, this is a friendly reminder of your upcoming skin consultation with ${specialistName}.
    </p>
    <div class="card">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Reference:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${referenceNumber}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Specialist:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${specialistName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Service:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">${serviceName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px;">Date:</td>
          <td style="padding: 6px 0; color: #0d9488; font-weight: 700; font-size: 14px; text-align: right;">${date}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-size: 14px;">Time:</td>
          <td style="padding: 6px 0; color: #0d9488; font-weight: 700; font-size: 14px; text-align: right;">${startTime} – ${endTime}</td>
        </tr>
      </table>
    </div>
    `
  );

  const text = `
Upcoming Appointment Reminder - Zareen Skin Care

Hello ${patientName},
This is a reminder for your upcoming consultation with ${specialistName}.

Reference: ${referenceNumber}
Date: ${date}
Time: ${startTime} - ${endTime}
Service: ${serviceName}

— Zareen Skin Care Team
  `.trim();

  return { html, text, subject: `Reminder: Appointment ${referenceNumber} on ${date}` };
};

module.exports = {
  getVerificationEmailTemplate,
  getPasswordResetEmailTemplate,
  getAppointmentCreatedEmailTemplate,
  getAppointmentRescheduledEmailTemplate,
  getAppointmentCancelledEmailTemplate,
  getAppointmentCompletedEmailTemplate,
  getAppointmentNoShowEmailTemplate,
  getAppointmentReminderEmailTemplate,
};
