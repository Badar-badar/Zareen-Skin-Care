const express = require('express');
const router = express.Router();

const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require('../controllers/notificationController');

const {
  listNotificationsValidator,
  notificationIdValidator,
} = require('../validators/notificationValidator');

const { authenticate } = require('../middleware/authMiddleware');

// All notification routes are private for authenticated users (Patient & Specialist)
router.use(authenticate);

router.get('/', listNotificationsValidator, getMyNotifications);
router.get('/unread-count', getUnreadCount);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', notificationIdValidator, markAsRead);
router.delete('/:id', notificationIdValidator, deleteNotification);

module.exports = router;
