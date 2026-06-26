const prisma = require('../config/prisma');

const orderRepository = {
  findById: (id) =>
    prisma.order.findUnique({
      where: { id },
      include: { orderItems: { include: { skin: true } }, payment: true },
    }),

  findByUser: (userId, { skip = 0, take = 20 } = {}) =>
    prisma.order.findMany({
      where: { userId },
      include: { orderItems: { include: { skin: true } }, payment: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),

  countByUser: (userId) => prisma.order.count({ where: { userId } }),

  create: (data) =>
    prisma.order.create({
      data,
      include: { orderItems: { include: { skin: true } }, payment: true },
    }),

  update: (id, data) =>
    prisma.order.update({
      where: { id },
      data,
      include: { orderItems: { include: { skin: true } }, payment: true },
    }),

  // Admin
  findAll: ({ skip = 0, take = 20, status } = {}) =>
    prisma.order.findMany({
      where: status ? { status } : undefined,
      include: { orderItems: { include: { skin: true } }, payment: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),

  countAll: (status) => prisma.order.count({ where: status ? { status } : undefined }),

  salesStats: () =>
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      _count: { id: true },
      where: { status: 'COMPLETED' },
    }),
};

module.exports = orderRepository;
