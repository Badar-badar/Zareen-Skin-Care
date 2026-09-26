const express = require('express');
const router = express.Router();

const serviceController = require('../controllers/serviceController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const {
  createServiceValidator,
  updateServiceValidator,
  serviceIdValidator,
} = require('../validators/serviceValidator');

// All /api/services routes are protected and restricted to authenticated Specialists
router.use(authenticate, authorizeRoles('specialist'));

router.get('/me', serviceController.getMyServices);
router.post('/', createServiceValidator, serviceController.createService);
router.get('/:id', serviceIdValidator, serviceController.getServiceById);
router.patch('/:id', serviceIdValidator, updateServiceValidator, serviceController.updateService);
router.delete('/:id', serviceIdValidator, serviceController.deleteService);
router.patch('/:id/toggle', serviceIdValidator, serviceController.toggleServiceStatus);

module.exports = router;
