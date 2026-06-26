const prisma = require('../config/prisma');

const notificationRepository = {
  create: (data) => prisma.notification.create({ data }),

  findByUser: (userId, { skip = 0, take = 20 } = {}) =>
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),

  countByUser: (userId) => prisma.notification.count({ where: { userId } }),

  countUnread: (userId) => prisma.notification.count({ where: { userId, isRead: false } }),

  markRead: (id, userId) =>
    prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } }),

  markAllRead: (userId) =>
    prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } }),

  logEvent: (data) => prisma.notificationLog.create({ data }),
};

module.exports = notificationRepository;
