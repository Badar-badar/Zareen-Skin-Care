const notificationService = require('../services/notificationService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get paginated notifications for authenticated user
 * @route   GET /api/notifications
 * @access  Private (Patient or Specialist)
 */
const getMyNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getUserNotifications(
    req.user._id,
    req.query
  );

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Get unread notification count for authenticated user
 * @route   GET /api/notifications/unread-count
 * @access  Private (Patient or Specialist)
 */
const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await notificationService.getUnreadNotificationCount(req.user._id);

  res.status(200).json({
    success: true,
    data: {
      count,
    },
  });
});

/**
 * @desc    Mark a single notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private (Patient or Specialist)
 */
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markNotificationAsRead(
    req.user._id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: {
      notification,
    },
  });
});

/**
 * @desc    Mark all unread notifications as read
 * @route   PATCH /api/notifications/read-all
 * @access  Private (Patient or Specialist)
 */
const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllNotificationsAsRead(req.user._id);

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
    data: result,
  });
});

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Private (Patient or Specialist)
 */
const deleteNotification = asyncHandler(async (req, res) => {
  const result = await notificationService.deleteNotification(
    req.user._id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: 'Notification removed successfully',
    data: result,
  });
});

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
