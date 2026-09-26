const appointmentService = require('../services/appointmentService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Book a new appointment for authenticated patient
 * @route   POST /api/appointments
 * @access  Private (Patient Only)
 */
const createAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.createAppointment(req.user._id, req.body);

  res.status(201).json({
    success: true,
    message: 'Appointment booked successfully',
    data: {
      appointment,
    },
  });
});

/**
 * @desc    Cancel an appointment (owned by patient or specialist)
 * @route   PATCH /api/appointments/:id/cancel
 * @access  Private (Patient or Specialist)
 */
const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.cancelAppointment(
    req.user._id,
    req.user.role,
    req.params.id,
    req.body.reason
  );

  res.status(200).json({
    success: true,
    message: 'Appointment cancelled successfully',
    data: {
      appointment,
    },
  });
});

/**
 * @desc    Reschedule an appointment (owned by patient or specialist)
 * @route   PATCH /api/appointments/:id/reschedule
 * @access  Private (Patient or Specialist)
 */
const rescheduleAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.rescheduleAppointment(
    req.user._id,
    req.user.role,
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: 'Appointment rescheduled successfully',
    data: {
      appointment,
    },
  });
});

/**
 * @desc    Mark appointment completed by specialist
 * @route   PATCH /api/appointments/:id/complete
 * @access  Private (Specialist Only)
 */
const completeAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.completeAppointment(
    req.user._id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: 'Appointment marked as completed',
    data: {
      appointment,
    },
  });
});

/**
 * @desc    Mark appointment as no-show by specialist
 * @route   PATCH /api/appointments/:id/no-show
 * @access  Private (Specialist Only)
 */
const markAppointmentNoShow = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.markAppointmentNoShow(
    req.user._id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: 'Appointment marked as no-show',
    data: {
      appointment,
    },
  });
});

/**
 * @desc    Get appointments for authenticated patient
 * @route   GET /api/appointments/my
 * @access  Private (Patient Only)
 */
const getMyPatientAppointments = asyncHandler(async (req, res) => {
  const result = await appointmentService.getPatientAppointments(req.user._id, req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Get appointment history for authenticated patient (completed, cancelled, no_show)
 * @route   GET /api/appointments/my/history
 * @access  Private (Patient Only)
 */
const getMyPatientHistory = asyncHandler(async (req, res) => {
  const result = await appointmentService.getPatientAppointmentHistory(
    req.user._id,
    req.query
  );

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Get single appointment detail for authenticated patient
 * @route   GET /api/appointments/:id
 * @access  Private (Patient Only)
 */
const getPatientAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.getPatientAppointmentById(
    req.user._id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    data: {
      appointment,
    },
  });
});

/**
 * @desc    Get appointments for authenticated specialist
 * @route   GET /api/appointments/specialist
 * @access  Private (Specialist Only)
 */
const getSpecialistAppointments = asyncHandler(async (req, res) => {
  const result = await appointmentService.getSpecialistAppointments(req.user._id, req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Get appointment history for authenticated specialist (completed, cancelled, no_show)
 * @route   GET /api/appointments/specialist/history
 * @access  Private (Specialist Only)
 */
const getSpecialistHistory = asyncHandler(async (req, res) => {
  const result = await appointmentService.getSpecialistAppointmentHistory(
    req.user._id,
    req.query
  );

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Get single appointment detail for authenticated specialist
 * @route   GET /api/appointments/specialist/:id
 * @access  Private (Specialist Only)
 */
const getSpecialistAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.getSpecialistAppointmentById(
    req.user._id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    data: {
      appointment,
    },
  });
});

module.exports = {
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
};
