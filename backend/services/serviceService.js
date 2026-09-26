const Service = require('../models/Service');
const Specialist = require('../models/Specialist');
const ApiError = require('../utils/ApiError');

/**
 * Escape regex special characters
 * @param {String} text
 * @returns {String}
 */
const escapeRegex = (text) => {
  return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

/**
 * Format a Service document for clean API response
 * @param {Object} serviceDoc
 * @returns {Object}
 */
const formatService = (serviceDoc) => {
  if (!serviceDoc) return null;
  const raw = serviceDoc.toObject ? serviceDoc.toObject() : { ...serviceDoc };

  return {
    id: raw._id ? raw._id.toString() : raw.id,
    specialistId: raw.specialist ? raw.specialist.toString() : undefined,
    name: raw.name,
    description: raw.description || '',
    duration: raw.duration,
    price: raw.price,
    isActive: raw.isActive,
    sortOrder: raw.sortOrder || 0,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
};

/**
 * Helper to get the authenticated Specialist profile from user ID
 * @param {String} userId
 * @returns {Promise<Object>} Specialist document
 */
const getSpecialistByUserId = async (userId) => {
  const specialist = await Specialist.findOne({ user: userId });
  if (!specialist) {
    throw new ApiError('Specialist profile not found for this user account', 404);
  }
  return specialist;
};

/**
 * Create a new service for the authenticated specialist
 * @param {String} userId
 * @param {Object} serviceData
 */
const createService = async (userId, serviceData) => {
  const specialist = await getSpecialistByUserId(userId);

  const service = await Service.create({
    specialist: specialist._id,
    name: serviceData.name.trim(),
    description: serviceData.description ? serviceData.description.trim() : '',
    duration: Number(serviceData.duration),
    price: Number(serviceData.price),
    isActive: serviceData.isActive !== undefined ? Boolean(serviceData.isActive) : true,
    sortOrder: serviceData.sortOrder !== undefined ? Number(serviceData.sortOrder) : 0,
  });

  return formatService(service);
};

/**
 * Get all services belonging to the authenticated specialist
 * @param {String} userId
 * @param {Object} queryParams
 */
const getMyServices = async (userId, queryParams = {}) => {
  const specialist = await getSpecialistByUserId(userId);

  const filterQuery = { specialist: specialist._id };

  if (queryParams.isActive !== undefined) {
    filterQuery.isActive = queryParams.isActive === 'true' || queryParams.isActive === true;
  }

  if (queryParams.search && queryParams.search.trim()) {
    const escaped = escapeRegex(queryParams.search.trim());
    filterQuery.name = new RegExp(escaped, 'i');
  }

  const services = await Service.find(filterQuery).sort({ sortOrder: 1, createdAt: -1 });

  return services.map(formatService);
};

/**
 * Get a single service by ID owned by the authenticated specialist
 * @param {String} userId
 * @param {String} serviceId
 */
const getServiceById = async (userId, serviceId) => {
  const specialist = await getSpecialistByUserId(userId);

  const service = await Service.findOne({
    _id: serviceId,
    specialist: specialist._id,
  });

  if (!service) {
    throw new ApiError('Service not found or you do not have permission to view it', 404);
  }

  return formatService(service);
};

/**
 * Update an existing service owned by the authenticated specialist
 * @param {String} userId
 * @param {String} serviceId
 * @param {Object} updateData
 */
const updateService = async (userId, serviceId, updateData) => {
  const specialist = await getSpecialistByUserId(userId);

  const service = await Service.findOne({
    _id: serviceId,
    specialist: specialist._id,
  });

  if (!service) {
    throw new ApiError('Service not found or you do not have permission to modify it', 404);
  }

  // Apply whitelisted field updates
  if (updateData.name !== undefined) {
    service.name = updateData.name.trim();
  }
  if (updateData.description !== undefined) {
    service.description = updateData.description.trim();
  }
  if (updateData.duration !== undefined) {
    service.duration = Number(updateData.duration);
  }
  if (updateData.price !== undefined) {
    service.price = Number(updateData.price);
  }
  if (updateData.isActive !== undefined) {
    service.isActive = Boolean(updateData.isActive);
  }
  if (updateData.sortOrder !== undefined) {
    service.sortOrder = Number(updateData.sortOrder);
  }

  await service.save();

  return formatService(service);
};

/**
 * Delete a service owned by the authenticated specialist
 * @param {String} userId
 * @param {String} serviceId
 */
const deleteService = async (userId, serviceId) => {
  const specialist = await getSpecialistByUserId(userId);

  const deletedService = await Service.findOneAndDelete({
    _id: serviceId,
    specialist: specialist._id,
  });

  if (!deletedService) {
    throw new ApiError('Service not found or you do not have permission to delete it', 404);
  }

  return { id: serviceId };
};

/**
 * Toggle active status of a service owned by the authenticated specialist
 * @param {String} userId
 * @param {String} serviceId
 */
const toggleServiceStatus = async (userId, serviceId) => {
  const specialist = await getSpecialistByUserId(userId);

  const service = await Service.findOne({
    _id: serviceId,
    specialist: specialist._id,
  });

  if (!service) {
    throw new ApiError('Service not found or you do not have permission to modify it', 404);
  }

  service.isActive = !service.isActive;
  await service.save();

  return formatService(service);
};

/**
 * Get all active public services offered by a visible active specialist
 * @param {String} specialistId
 */
const getPublicServicesBySpecialist = async (specialistId) => {
  const specialist = await Specialist.findById(specialistId).populate('user', 'status');

  if (!specialist || !specialist.isVisible || specialist.user?.status !== 'active') {
    throw new ApiError('Specialist is not publicly available or does not exist', 404);
  }

  const services = await Service.find({
    specialist: specialistId,
    isActive: true,
  }).sort({ sortOrder: 1, name: 1 });

  return services.map((s) => ({
    id: s._id.toString(),
    name: s.name,
    description: s.description || '',
    duration: s.duration,
    price: s.price,
    sortOrder: s.sortOrder || 0,
  }));
};

module.exports = {
  createService,
  getMyServices,
  getServiceById,
  updateService,
  deleteService,
  toggleServiceStatus,
  getPublicServicesBySpecialist,
};
