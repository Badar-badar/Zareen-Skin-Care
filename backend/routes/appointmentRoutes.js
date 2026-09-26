const express = require('express');
const router = express.Router();

const {
  createAppointment,
  cancelAppointment,
  rescheduleAppointment,
  completeAppointment,
  markAppointmentNoShow,
  getMyPatientAppointments,
  getMyPatientHistory,
  getPatientAppointmentById,
  getSpecialistAppointments,
  getSpecialistHistory,
  getSpecialistAppointmentById,
} = require('../controllers/appointmentController');

const {
  createAppointmentValidator,
  cancelAppointmentValidator,
  rescheduleAppointmentValidator,
  listPatientAppointmentsValidator,
  listSpecialistAppointmentsValidator,
  historyQueryValidator,
  appointmentIdValidator,
} = require('../validators/appointmentValidator');

const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// ==========================================
// 1. Patient Routes
// ==========================================
router.post(
  '/',
  authenticate,
  authorizeRoles('patient'),
  createAppointmentValidator,
  createAppointment
);

router.get(
  '/my',
  authenticate,
  authorizeRoles('patient'),
  listPatientAppointmentsValidator,
  getMyPatientAppointments
);

router.get(
  '/my/history',
  authenticate,
  authorizeRoles('patient'),
  historyQueryValidator,
  getMyPatientHistory
);

// ==========================================
// 2. Specialist Routes
// ==========================================
router.get(
  '/specialist',
  authenticate,
  authorizeRoles('specialist'),
  listSpecialistAppointmentsValidator,
  getSpecialistAppointments
);

router.get(
  '/specialist/history',
  authenticate,
  authorizeRoles('specialist'),
  historyQueryValidator,
  getSpecialistHistory
);

router.get(
  '/specialist/:id',
  authenticate,
  authorizeRoles('specialist'),
  appointmentIdValidator,
  getSpecialistAppointmentById
);

// ==========================================
// 3. Appointment Action / Status Routes
// ==========================================
router.patch(
  '/:id/cancel',
  authenticate,
  authorizeRoles('patient', 'specialist'),
  cancelAppointmentValidator,
  cancelAppointment
);

router.patch(
  '/:id/reschedule',
  authenticate,
  authorizeRoles('patient', 'specialist'),
  rescheduleAppointmentValidator,
  rescheduleAppointment
);

router.patch(
  '/:id/complete',
  authenticate,
  authorizeRoles('specialist'),
  appointmentIdValidator,
  completeAppointment
);

router.patch(
  '/specialist/:id/complete',
  authenticate,
  authorizeRoles('specialist'),
  appointmentIdValidator,
  completeAppointment
);

router.patch(
  '/:id/no-show',
  authenticate,
  authorizeRoles('specialist'),
  appointmentIdValidator,
  markAppointmentNoShow
);

router.patch(
  '/specialist/:id/no-show',
  authenticate,
  authorizeRoles('specialist'),
  appointmentIdValidator,
  markAppointmentNoShow
);

// ==========================================
// 4. Patient Single Appointment Route
// ==========================================
router.get(
  '/:id',
  authenticate,
  authorizeRoles('patient'),
  appointmentIdValidator,
  getPatientAppointmentById
);

module.exports = router;
