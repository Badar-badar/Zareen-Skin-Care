const Specialist = require('../models/Specialist');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const {
  serializePublicSpecialist,
  serializePrivateSpecialist,
} = require('../utils/serializeSpecialist');

/**
 * Escape regular expression special characters to prevent ReDoS / injection
 * @param {String} text
 * @returns {String}
 */
const escapeRegex = (text) => {
  return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

/**
 * Retrieve authenticated specialist's private profile
 * @param {String} userId
 */
const getMyProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError('User account not found', 404);
  }

  const specialist = await Specialist.findOne({ user: userId });
  if (!specialist) {
    throw new ApiError('Specialist profile not found for this account', 404);
  }

  return serializePrivateSpecialist(specialist, user);
};

/**
 * Update authenticated specialist's profile and whitelisted User fields
 * @param {String} userId
 * @param {Object} updateData
 */
const updateMyProfile = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError('User account not found', 404);
  }

  const specialist = await Specialist.findOne({ user: userId });
  if (!specialist) {
    throw new ApiError('Specialist profile not found for this account', 404);
  }

  // 1. Update whitelisted User fields
  let userModified = false;
  if (updateData.firstName !== undefined) {
    user.firstName = updateData.firstName.trim();
    userModified = true;
  }
  if (updateData.lastName !== undefined) {
    user.lastName = updateData.lastName.trim();
    userModified = true;
  }
  if (updateData.phone !== undefined) {
    user.phone = updateData.phone.trim();
    userModified = true;
  }
  if (userModified) {
    await user.save();
  }

  // 2. Update whitelisted Specialist fields
  if (updateData.title !== undefined) {
    specialist.title = updateData.title.trim();
  }
  if (updateData.specialty !== undefined) {
    specialist.specialty = updateData.specialty;
  }
  if (updateData.bio !== undefined) {
    specialist.bio = updateData.bio.trim();
  }
  if (updateData.profileImage !== undefined) {
    specialist.profileImage = updateData.profileImage;
  }
  if (updateData.licenseNumber !== undefined) {
    specialist.licenseNumber = updateData.licenseNumber.trim();
  }
  if (updateData.experience !== undefined) {
    specialist.experience = Number(updateData.experience);
  }
  if (updateData.qualifications !== undefined) {
    specialist.qualifications = Array.isArray(updateData.qualifications)
      ? updateData.qualifications.map((q) => q.trim()).filter(Boolean)
      : [];
  }
  if (updateData.clinicName !== undefined) {
    specialist.clinicName = updateData.clinicName.trim();
  }
  if (updateData.clinicAddress !== undefined) {
    specialist.clinicAddress = updateData.clinicAddress.trim();
  }
  if (updateData.city !== undefined) {
    specialist.city = updateData.city.trim();
  }
  if (updateData.country !== undefined) {
    specialist.country = updateData.country.trim();
  }
  if (updateData.cancellationPolicy !== undefined) {
    specialist.cancellationPolicy = updateData.cancellationPolicy.trim();
  }
  if (updateData.isVisible !== undefined) {
    specialist.isVisible = Boolean(updateData.isVisible);
  }

  await specialist.save();

  return serializePrivateSpecialist(specialist, user);
};

/**
 * List publicly visible active specialists with search, filter, and pagination
 * @param {Object} queryParams
 */
const listPublicSpecialists = async (queryParams) => {
  const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(queryParams.limit, 10) || 12));
  const { search, specialty, city, country, sort } = queryParams;

  // 1. Fetch active specialist users only (suspended/inactive users are excluded)
  const activeSpecialistUsers = await User.find({
    role: 'specialist',
    status: 'active',
  }).select('_id firstName lastName');

  const activeUserIds = activeSpecialistUsers.map((u) => u._id);

  // Base query: Only visible profiles belonging to active users
  const filterQuery = {
    isVisible: true,
    user: { $in: activeUserIds },
  };

  // 2. Specialty Filter
  if (specialty && specialty.trim()) {
    const escapedSpecialty = escapeRegex(specialty.trim());
    filterQuery.specialty = new RegExp(`^${escapedSpecialty}$`, 'i');
  }

  // 3. Location Filters (City / Country)
  if (city && city.trim()) {
    const escapedCity = escapeRegex(city.trim());
    filterQuery.city = new RegExp(escapedCity, 'i');
  }
  if (country && country.trim()) {
    const escapedCountry = escapeRegex(country.trim());
    filterQuery.country = new RegExp(escapedCountry, 'i');
  }

  // 4. Free-text Search (Name, Specialty, City, Clinic)
  if (search && search.trim()) {
    const escapedSearch = escapeRegex(search.trim());
    const searchRegex = new RegExp(escapedSearch, 'i');

    // Find users whose name matches search query
    const matchingUserIds = activeSpecialistUsers
      .filter((u) => {
        const full = `${u.firstName} ${u.lastName}`.toLowerCase();
        return full.includes(search.trim().toLowerCase());
      })
      .map((u) => u._id);

    filterQuery.$or = [
      { user: { $in: matchingUserIds } },
      { specialty: searchRegex },
      { city: searchRegex },
      { clinicName: searchRegex },
    ];
  }

  // 5. Sorting
  let sortOption = { rating: -1, reviewCount: -1, createdAt: -1 };
  if (sort === 'rating') {
    sortOption = { rating: -1, reviewCount: -1 };
  } else if (sort === 'experience') {
    sortOption = { experience: -1 };
  } else if (sort === 'newest') {
    sortOption = { createdAt: -1 };
  }

  // Count total matching documents
  const total = await Specialist.countDocuments(filterQuery);

  // Fetch paginated results with populated user
  let specialists = await Specialist.find(filterQuery)
    .populate('user', 'firstName lastName')
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit);

  // In-memory sort for name if requested
  if (sort === 'name') {
    specialists.sort((a, b) => {
      const nameA = `${a.user?.firstName || ''} ${a.user?.lastName || ''}`.toLowerCase();
      const nameB = `${b.user?.firstName || ''} ${b.user?.lastName || ''}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  } else if (sort === 'name_desc') {
    specialists.sort((a, b) => {
      const nameA = `${a.user?.firstName || ''} ${a.user?.lastName || ''}`.toLowerCase();
      const nameB = `${b.user?.firstName || ''} ${b.user?.lastName || ''}`.toLowerCase();
      return nameB.localeCompare(nameA);
    });
  }

  const formattedSpecialists = specialists.map(serializePublicSpecialist);

  return {
    specialists: formattedSpecialists,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Retrieve public specialist profile details by ID
 * @param {String} specialistId
 */
const getPublicSpecialistById = async (specialistId) => {
  const specialist = await Specialist.findById(specialistId).populate(
    'user',
    'firstName lastName status'
  );

  if (!specialist) {
    throw new ApiError('Specialist not found', 404);
  }

  // Guard: Return 404 if specialist is hidden or associated user is inactive/suspended
  if (!specialist.isVisible || specialist.user?.status !== 'active') {
    throw new ApiError('Specialist profile is currently not available', 404);
  }

  return serializePublicSpecialist(specialist);
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  listPublicSpecialists,
  getPublicSpecialistById,
};
