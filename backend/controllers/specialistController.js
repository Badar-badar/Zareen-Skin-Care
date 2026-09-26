const specialistService = require('../services/specialistService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get authenticated specialist's own profile
 * @route   GET /api/specialists/me
 * @access  Private (Specialist Only)
 */
const getMyProfile = asyncHandler(async (req, res) => {
  const specialist = await specialistService.getMyProfile(req.user._id);

  res.status(200).json({
    success: true,
    data: {
      specialist,
    },
  });
});

/**
 * @desc    Update authenticated specialist's own profile and user details
 * @route   PATCH /api/specialists/me
 * @access  Private (Specialist Only)
 */
const updateMyProfile = asyncHandler(async (req, res) => {
  const specialist = await specialistService.updateMyProfile(req.user._id, req.body);

  res.status(200).json({
    success: true,
    message: 'Specialist profile updated successfully',
    data: {
      specialist,
    },
  });
});

/**
 * @desc    List public specialists with search, filter, and pagination
 * @route   GET /api/specialists
 * @access  Public
 */
const listSpecialists = asyncHandler(async (req, res) => {
  const result = await specialistService.listPublicSpecialists(req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Get public specialist details by ID
 * @route   GET /api/specialists/:id
 * @access  Public
 */
const getSpecialistById = asyncHandler(async (req, res) => {
  const specialist = await specialistService.getPublicSpecialistById(req.params.id);

  res.status(200).json({
    success: true,
    data: {
      specialist,
    },
  });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  listSpecialists,
  getSpecialistById,
};
