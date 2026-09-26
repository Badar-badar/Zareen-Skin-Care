const patientService = require('../services/patientService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get authenticated patient's profile
 * @route   GET /api/patients/me
 * @access  Private (Patient Only)
 */
const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await patientService.getMyProfile(req.user._id);

  res.status(200).json({
    success: true,
    data: {
      profile,
    },
  });
});

/**
 * @desc    Update authenticated patient's profile
 * @route   PATCH /api/patients/me
 * @access  Private (Patient Only)
 */
const updateMyProfile = asyncHandler(async (req, res) => {
  const profile = await patientService.updateMyProfile(req.user._id, req.body);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      profile,
    },
  });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
};
