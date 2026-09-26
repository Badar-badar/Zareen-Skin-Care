const express = require('express');
const router = express.Router();

const specialistController = require('../controllers/specialistController');
const serviceController = require('../controllers/serviceController');
const availabilityController = require('../controllers/availabilityController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const {
  updateSpecialistValidator,
  listSpecialistsValidator,
  specialistIdValidator,
} = require('../validators/specialistValidator');
const { slotsQueryValidator } = require('../validators/availabilityValidator');

// Protected Specialist Self-Service Profile Routes
router.get('/me', authenticate, authorizeRoles('specialist'), specialistController.getMyProfile);
router.patch(
  '/me',
  authenticate,
  authorizeRoles('specialist'),
  updateSpecialistValidator,
  specialistController.updateMyProfile
);

// Public Specialist Discovery & Profile Routes
router.get('/', listSpecialistsValidator, specialistController.listSpecialists);
router.get('/:id', specialistIdValidator, specialistController.getSpecialistById);
router.get('/:id/services', specialistIdValidator, serviceController.getPublicServicesBySpecialist);
router.get('/:id/availability', specialistIdValidator, availabilityController.getPublicAvailability);
router.get(
  '/:id/availability/slots',
  specialistIdValidator,
  slotsQueryValidator,
  availabilityController.getAvailableSlots
);

module.exports = router;
