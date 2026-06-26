const notificationRepository = require('../repositories/notification.repository');

const notificationService = {
  getMyNotifications: async (userId, { page = 1, limit = 20 } = {}) => {
    const skip = (page - 1) * limit;
    const [notifications, total, unread] = await Promise.all([
      notificationRepository.findByUser(userId, { skip, take: limit }),
      notificationRepository.countByUser(userId),
      notificationRepository.countUnread(userId),
    ]);
    return {
      notifications,
      unread,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  markRead: (id, userId) => notificationRepository.markRead(id, userId),

  markAllRead: (userId) => notificationRepository.markAllRead(userId),

  createForUser: (userId, type, title, message, metadata = null) =>
    notificationRepository.create({ userId, type, title, message, metadata }),
};

module.exports = notificationService;
