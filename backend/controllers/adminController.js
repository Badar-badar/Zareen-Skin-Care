const adminService = require('../services/adminService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get overall platform dashboard metrics
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin Only)
 */
const getDashboard = asyncHandler(async (req, res) => {
  const data = await adminService.getAdminDashboard();

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * @desc    Get paginated specialists directory for administration
 * @route   GET /api/admin/specialists
 * @access  Private (Admin Only)
 */
const getSpecialists = asyncHandler(async (req, res) => {
  const result = await adminService.getAdminSpecialists(req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Get single specialist detail
 * @route   GET /api/admin/specialists/:id
 * @access  Private (Admin Only)
 */
const getSpecialistById = asyncHandler(async (req, res) => {
  const result = await adminService.getAdminSpecialistById(req.params.id);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Update specialist account status (active | suspended | inactive)
 * @route   PATCH /api/admin/specialists/:id/status
 * @access  Private (Admin Only)
 */
const updateSpecialistStatus = asyncHandler(async (req, res) => {
  const specialist = await adminService.updateSpecialistStatus(
    req.params.id,
    req.body.status
  );

  res.status(200).json({
    success: true,
    message: `Specialist account status updated to '${req.body.status}'`,
    data: {
      specialist,
    },
  });
});

/**
 * @desc    Toggle specialist public profile visibility
 * @route   PATCH /api/admin/specialists/:id/visibility
 * @access  Private (Admin Only)
 */
const updateSpecialistVisibility = asyncHandler(async (req, res) => {
  const specialist = await adminService.updateSpecialistVisibility(
    req.params.id,
    req.body.isVisible
  );

  res.status(200).json({
    success: true,
    message: `Specialist profile visibility set to ${req.body.isVisible}`,
    data: {
      specialist,
    },
  });
});

/**
 * @desc    Safely edit specialist profile details
 * @route   PATCH /api/admin/specialists/:id
 * @access  Private (Admin Only)
 */
const updateSpecialistProfile = asyncHandler(async (req, res) => {
  const specialist = await adminService.updateSpecialistProfile(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: 'Specialist profile updated successfully',
    data: {
      specialist,
    },
  });
});

/**
 * @desc    Get paginated patients list
 * @route   GET /api/admin/patients
 * @access  Private (Admin Only)
 */
const getPatients = asyncHandler(async (req, res) => {
  const result = await adminService.getAdminPatients(req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Get single patient detail
 * @route   GET /api/admin/patients/:id
 * @access  Private (Admin Only)
 */
const getPatientById = asyncHandler(async (req, res) => {
  const patient = await adminService.getAdminPatientById(req.params.id);

  res.status(200).json({
    success: true,
    data: {
      patient,
    },
  });
});

/**
 * @desc    Update patient account status (active | suspended | inactive)
 * @route   PATCH /api/admin/patients/:id/status
 * @access  Private (Admin Only)
 */
const updatePatientStatus = asyncHandler(async (req, res) => {
  const patient = await adminService.updatePatientStatus(
    req.params.id,
    req.body.status
  );

  res.status(200).json({
    success: true,
    message: `Patient account status updated to '${req.body.status}'`,
    data: {
      patient,
    },
  });
});

/**
 * @desc    Get paginated appointments list for administration
 * @route   GET /api/admin/appointments
 * @access  Private (Admin Only)
 */
const getAppointments = asyncHandler(async (req, res) => {
  const result = await adminService.getAdminAppointments(req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Get single appointment detail
 * @route   GET /api/admin/appointments/:id
 * @access  Private (Admin Only)
 */
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await adminService.getAdminAppointmentById(req.params.id);

  res.status(200).json({
    success: true,
    data: {
      appointment,
    },
  });
});

/**
 * @desc    Admin cancellation of an appointment
 * @route   PATCH /api/admin/appointments/:id/cancel
 * @access  Private (Admin Only)
 */
const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await adminService.cancelAppointmentByAdmin(
    req.params.id,
    req.body.reason
  );

  res.status(200).json({
    success: true,
    message: 'Appointment cancelled by administrator',
    data: {
      appointment,
    },
  });
});

/**
 * @desc    Admin completion of an appointment
 * @route   PATCH /api/admin/appointments/:id/complete
 * @access  Private (Admin Only)
 */
const completeAppointment = asyncHandler(async (req, res) => {
  const appointment = await adminService.completeAppointmentByAdmin(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Appointment marked as completed by administrator',
    data: {
      appointment,
    },
  });
});

/**
 * @desc    Admin mark appointment as no-show
 * @route   PATCH /api/admin/appointments/:id/no-show
 * @access  Private (Admin Only)
 */
const markAppointmentNoShow = asyncHandler(async (req, res) => {
  const appointment = await adminService.markAppointmentNoShowByAdmin(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Appointment marked as no-show by administrator',
    data: {
      appointment,
    },
  });
});

/**
 * @desc    Get analytical reports and aggregation metrics
 * @route   GET /api/admin/reports
 * @access  Private (Admin Only)
 */
const getReports = asyncHandler(async (req, res) => {
  const data = await adminService.getAdminReports(req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

module.exports = {
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
};
