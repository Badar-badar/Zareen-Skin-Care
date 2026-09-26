const express = require('express');
const router = express.Router();

const availabilityController = require('../controllers/availabilityController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { updateAvailabilityValidator } = require('../validators/availabilityValidator');
const {
  addBlockedDateValidator,
  updateBlockedDateValidator,
  blockedDateIdValidator,
} = require('../validators/blockedDateValidator');

// All /api/availability routes are protected and restricted to authenticated Specialists
router.use(authenticate, authorizeRoles('specialist'));

// Weekly Recurring Schedule Endpoints
router.get('/me', availabilityController.getMyAvailability);
router.put('/me', updateAvailabilityValidator, availabilityController.updateMyAvailability);

// Blocked Calendar Dates Endpoints
router.get('/blocked-dates', availabilityController.getBlockedDates);
router.post('/blocked-dates', addBlockedDateValidator, availabilityController.addBlockedDate);
router.patch(
  '/blocked-dates/:id',
  blockedDateIdValidator,
  updateBlockedDateValidator,
  availabilityController.updateBlockedDate
);
router.delete(
  '/blocked-dates/:id',
  blockedDateIdValidator,
  availabilityController.deleteBlockedDate
);

module.exports = router;
