const express = require('express');
const router = express.Router();

const {
  getDashboard,
  getSpecialists,
  getSpecialistById,
  updateSpecialistStatus,
  updateSpecialistVisibility,
  updateSpecialistProfile,
  getPatients,
  getPatientById,
  updatePatientStatus,
  getAppointments,
  getAppointmentById,
  cancelAppointment,
  completeAppointment,
  markAppointmentNoShow,
  getReports,
} = require('../controllers/adminController');

const {
  mongoIdParamValidator,
  adminListQueryValidator,
  updateStatusValidator,
  updateVisibilityValidator,
  updateSpecialistProfileValidator,
  adminAppointmentListQueryValidator,
  adminCancelAppointmentValidator,
  adminReportsQueryValidator,
} = require('../validators/adminValidator');

const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Enforce authentication and admin role for all routes in this module
router.use(authenticate, authorizeRoles('admin'));

// 1. Dashboard Metrics
router.get('/dashboard', getDashboard);

// 2. Specialist Management Routes
router.get('/specialists', adminListQueryValidator, getSpecialists);
router.get('/specialists/:id', mongoIdParamValidator, getSpecialistById);
router.patch('/specialists/:id/status', updateStatusValidator, updateSpecialistStatus);
router.patch('/specialists/:id/visibility', updateVisibilityValidator, updateSpecialistVisibility);
router.patch('/specialists/:id', updateSpecialistProfileValidator, updateSpecialistProfile);

// 3. Patient Management Routes
router.get('/patients', adminListQueryValidator, getPatients);
router.get('/patients/:id', mongoIdParamValidator, getPatientById);
router.patch('/patients/:id/status', updateStatusValidator, updatePatientStatus);

// 4. Appointment Management Routes
router.get('/appointments', adminAppointmentListQueryValidator, getAppointments);
router.get('/appointments/:id', mongoIdParamValidator, getAppointmentById);
router.patch('/appointments/:id/cancel', adminCancelAppointmentValidator, cancelAppointment);
router.patch('/appointments/:id/complete', mongoIdParamValidator, completeAppointment);
router.patch('/appointments/:id/no-show', mongoIdParamValidator, markAppointmentNoShow);

// 5. Analytics & Reports
router.get('/reports', adminReportsQueryValidator, getReports);

module.exports = router;
