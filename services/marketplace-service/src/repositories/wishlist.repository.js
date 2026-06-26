const prisma = require('../config/prisma');

const wishlistRepository = {
  findByUser: (userId) =>
    prisma.wishlistItem.findMany({
      where: { userId },
      include: { skin: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    }),

  findItem: (userId, skinId) =>
    prisma.wishlistItem.findUnique({ where: { userId_skinId: { userId, skinId } } }),

  add: (userId, skinId) =>
    prisma.wishlistItem.create({ data: { userId, skinId }, include: { skin: true } }),

  remove: (userId, skinId) =>
    prisma.wishlistItem.delete({ where: { userId_skinId: { userId, skinId } } }),
};

module.exports = wishlistRepository;
