const availabilityService = require('../services/availabilityService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get authenticated specialist's recurring weekly schedule
 * @route   GET /api/availability/me
 * @access  Private (Specialist Only)
 */
const getMyAvailability = asyncHandler(async (req, res) => {
  const data = await availabilityService.getMyAvailability(req.user._id);

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * @desc    Create or update authenticated specialist's weekly schedule
 * @route   PUT /api/availability/me
 * @access  Private (Specialist Only)
 */
const updateMyAvailability = asyncHandler(async (req, res) => {
  const data = await availabilityService.createOrUpdateAvailability(
    req.user._id,
    req.body.weeklySchedule
  );

  res.status(200).json({
    success: true,
    message: 'Weekly availability updated successfully',
    data,
  });
});

/**
 * @desc    Get all blocked calendar dates for authenticated specialist
 * @route   GET /api/availability/blocked-dates
 * @access  Private (Specialist Only)
 */
const getBlockedDates = asyncHandler(async (req, res) => {
  const blockedDates = await availabilityService.getBlockedDates(req.user._id);

  res.status(200).json({
    success: true,
    data: {
      blockedDates,
      total: blockedDates.length,
    },
  });
});

/**
 * @desc    Add a new blocked calendar date
 * @route   POST /api/availability/blocked-dates
 * @access  Private (Specialist Only)
 */
const addBlockedDate = asyncHandler(async (req, res) => {
  const blockedDate = await availabilityService.addBlockedDate(req.user._id, req.body);

  res.status(201).json({
    success: true,
    message: 'Blocked date added successfully',
    data: {
      blockedDate,
    },
  });
});

/**
 * @desc    Update an existing blocked date
 * @route   PATCH /api/availability/blocked-dates/:id
 * @access  Private (Specialist Only)
 */
const updateBlockedDate = asyncHandler(async (req, res) => {
  const blockedDate = await availabilityService.updateBlockedDate(
    req.user._id,
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: 'Blocked date updated successfully',
    data: {
      blockedDate,
    },
  });
});

/**
 * @desc    Delete a blocked date
 * @route   DELETE /api/availability/blocked-dates/:id
 * @access  Private (Specialist Only)
 */
const deleteBlockedDate = asyncHandler(async (req, res) => {
  const result = await availabilityService.deleteBlockedDate(req.user._id, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Blocked date removed successfully',
    data: result,
  });
});

/**
 * @desc    Get public weekly schedule for a specialist
 * @route   GET /api/specialists/:id/availability
 * @access  Public
 */
const getPublicAvailability = asyncHandler(async (req, res) => {
  const data = await availabilityService.getPublicAvailability(req.params.id);

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * @desc    Generate candidate appointment slots for a specialist on a date for a service
 * @route   GET /api/specialists/:id/availability/slots
 * @access  Public
 */
const getAvailableSlots = asyncHandler(async (req, res) => {
  const data = await availabilityService.getAvailableSlots(
    req.params.id,
    req.query.date,
    req.query.serviceId
  );

  res.status(200).json({
    success: true,
    data,
  });
});

module.exports = {
  getMyAvailability,
  updateMyAvailability,
  getBlockedDates,
  addBlockedDate,
  updateBlockedDate,
  deleteBlockedDate,
  getPublicAvailability,
  getAvailableSlots,
};
