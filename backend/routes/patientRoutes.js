const express = require('express');
const router = express.Router();

const { getMyProfile, updateMyProfile } = require('../controllers/patientController');
const { updatePatientValidator } = require('../validators/patientValidator');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All patient profile routes require authenticated patient
router.use(authenticate, authorizeRoles('patient'));

router.get('/me', getMyProfile);
router.patch('/me', updatePatientValidator, updateMyProfile);

module.exports = router;
