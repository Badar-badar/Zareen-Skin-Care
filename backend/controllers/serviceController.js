const serviceService = require('../services/serviceService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create a new clinical service for the authenticated specialist
 * @route   POST /api/services
 * @access  Private (Specialist Only)
 */
const createService = asyncHandler(async (req, res) => {
  const service = await serviceService.createService(req.user._id, req.body);

  res.status(201).json({
    success: true,
    message: 'Service created successfully',
    data: {
      service,
    },
  });
});

/**
 * @desc    Get all services belonging to the authenticated specialist
 * @route   GET /api/services/me
 * @access  Private (Specialist Only)
 */
const getMyServices = asyncHandler(async (req, res) => {
  const services = await serviceService.getMyServices(req.user._id, req.query);

  res.status(200).json({
    success: true,
    data: {
      services,
      total: services.length,
    },
  });
});

/**
 * @desc    Get single service details by ID for the authenticated specialist
 * @route   GET /api/services/:id
 * @access  Private (Specialist Only)
 */
const getServiceById = asyncHandler(async (req, res) => {
  const service = await serviceService.getServiceById(req.user._id, req.params.id);

  res.status(200).json({
    success: true,
    data: {
      service,
    },
  });
});

/**
 * @desc    Update an existing service owned by the authenticated specialist
 * @route   PATCH /api/services/:id
 * @access  Private (Specialist Only)
 */
const updateService = asyncHandler(async (req, res) => {
  const service = await serviceService.updateService(req.user._id, req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Service updated successfully',
    data: {
      service,
    },
  });
});

/**
 * @desc    Delete a service owned by the authenticated specialist
 * @route   DELETE /api/services/:id
 * @access  Private (Specialist Only)
 */
const deleteService = asyncHandler(async (req, res) => {
  const result = await serviceService.deleteService(req.user._id, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Service deleted successfully',
    data: result,
  });
});

/**
 * @desc    Toggle active status of a service owned by the authenticated specialist
 * @route   PATCH /api/services/:id/toggle
 * @access  Private (Specialist Only)
 */
const toggleServiceStatus = asyncHandler(async (req, res) => {
  const service = await serviceService.toggleServiceStatus(req.user._id, req.params.id);

  res.status(200).json({
    success: true,
    message: `Service is now ${service.isActive ? 'active' : 'inactive'}`,
    data: {
      service,
    },
  });
});

/**
 * @desc    Get all public active services offered by a specialist
 * @route   GET /api/specialists/:id/services
 * @access  Public
 */
const getPublicServicesBySpecialist = asyncHandler(async (req, res) => {
  const services = await serviceService.getPublicServicesBySpecialist(req.params.id);

  res.status(200).json({
    success: true,
    data: {
      services,
      total: services.length,
    },
  });
});

module.exports = {
  createService,
  getMyServices,
  getServiceById,
  updateService,
  deleteService,
  toggleServiceStatus,
  getPublicServicesBySpecialist,
};
