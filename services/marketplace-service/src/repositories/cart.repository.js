const prisma = require('../config/prisma');

const cartRepository = {
  findByUser: (userId) =>
    prisma.cartItem.findMany({
      where: { userId },
      include: { skin: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    }),

  findItem: (userId, skinId) =>
    prisma.cartItem.findUnique({ where: { userId_skinId: { userId, skinId } } }),

  upsert: (userId, skinId, quantity) =>
    prisma.cartItem.upsert({
      where: { userId_skinId: { userId, skinId } },
      update: { quantity },
      create: { userId, skinId, quantity },
      include: { skin: true },
    }),

  remove: (userId, skinId) =>
    prisma.cartItem.delete({ where: { userId_skinId: { userId, skinId } } }),

  clear: (userId) => prisma.cartItem.deleteMany({ where: { userId } }),
};

module.exports = cartRepository;
