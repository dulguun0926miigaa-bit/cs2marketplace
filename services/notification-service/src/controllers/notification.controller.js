const notificationService = require('../services/notification.service');
const { success, paginated } = require('../utils/response');

const notificationController = {
  getMyNotifications: async (req, res, next) => {
    try {
      const result = await notificationService.getMyNotifications(req.user.id, {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 20,
      });
      return paginated(res, result.notifications, result.pagination);
    } catch (err) { next(err); }
  },

  markRead: async (req, res, next) => {
    try {
      await notificationService.markRead(parseInt(req.params.id, 10), req.user.id);
      return success(res, {}, 'Notification marked as read');
    } catch (err) { next(err); }
  },

  markAllRead: async (req, res, next) => {
    try {
      await notificationService.markAllRead(req.user.id);
      return success(res, {}, 'All notifications marked as read');
    } catch (err) { next(err); }
  },
};

module.exports = notificationController;
