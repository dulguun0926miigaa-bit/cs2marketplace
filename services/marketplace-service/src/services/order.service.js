const prisma = require('../config/prisma');
const orderRepository = require('../repositories/order.repository');
const cartRepository = require('../repositories/cart.repository');
const skinRepository = require('../repositories/skin.repository');
const { publish } = require('../utils/rabbitmq');
const { getOrSet, invalidate } = require('../utils/cache');
const config = require('../config');

const orderService = {
  checkout: async (userId, { notes } = {}) => {
    const cartItems = await cartRepository.findByUser(userId);
    if (!cartItems.length) {
      const err = new Error('Cart is empty');
      err.statusCode = 400;
      throw err;
    }

    // Validate stock
    for (const item of cartItems) {
      if (!item.skin.isAvailable || item.skin.stock < item.quantity) {
        const err = new Error(`Insufficient stock for: ${item.skin.name}`);
        err.statusCode = 400;
        throw err;
      }
    }

    // Prisma transaction: create order + decrement stock + clear cart
    const order = await prisma.$transaction(async (tx) => {
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.skin.price) * item.quantity,
        0
      );

      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          notes: notes || null,
          orderItems: {
            create: cartItems.map((item) => ({
              skinId: item.skinId,
              quantity: item.quantity,
              price: item.skin.price,
            })),
          },
        },
        include: { orderItems: { include: { skin: true } } },
      });

      // Decrement stock
      for (const item of cartItems) {
        await tx.skin.update({
          where: { id: item.skinId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { userId } });

      return newOrder;
    });

    await publish('order.created', {
      orderId: order.id,
      userId,
      totalAmount: order.totalAmount,
      timestamp: new Date().toISOString(),
    });

    await invalidate('dashboard:stats');
    return order;
  },

  getMyOrders: async (userId, { page = 1, limit = 20 } = {}) => {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      orderRepository.findByUser(userId, { skip, take: limit }),
      orderRepository.countByUser(userId),
    ]);
    return { orders, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getOrderById: async (id, userId) => {
    const order = await orderRepository.findById(id);
    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }
    // Non-admin can only see own orders
    if (userId && order.userId !== userId) {
      const err = new Error('Forbidden');
      err.statusCode = 403;
      throw err;
    }
    return order;
  },

  cancelOrder: async (orderId, userId) => {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }
    if (order.userId !== userId) {
      const err = new Error('Forbidden');
      err.statusCode = 403;
      throw err;
    }
    if (!['PENDING', 'PROCESSING'].includes(order.status)) {
      const err = new Error('Order cannot be cancelled');
      err.statusCode = 400;
      throw err;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const o = await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
        include: { orderItems: true },
      });
      // Restore stock
      for (const item of o.orderItems) {
        await tx.skin.update({
          where: { id: item.skinId },
          data: { stock: { increment: item.quantity } },
        });
      }
      return o;
    });

    await publish('order.cancelled', { orderId, userId, timestamp: new Date().toISOString() });
    return updated;
  },

  processPayment: async (orderId, userId, { method, transactionId }) => {
    const order = await orderRepository.findById(orderId);
    if (!order || order.userId !== userId) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }

    if (method === 'BALANCE' || method === 'WALLET') {
      const walletService = require('./wallet.service');
      await walletService.deduct(userId, order.totalAmount, {
        type: 'PURCHASE',
        description: `Order #${orderId}`,
        referenceId: orderId,
      });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.upsert({
        where: { orderId },
        update: { status: 'COMPLETED', method, transactionId: transactionId || null },
        create: { orderId, amount: order.totalAmount, method, status: 'COMPLETED', transactionId: transactionId || null },
      });
      await tx.order.update({ where: { id: orderId }, data: { status: 'COMPLETED' } });
      return payment;
    });

    await publish('payment.completed', {
      orderId,
      userId,
      amount: order.totalAmount,
      timestamp: new Date().toISOString(),
    });
    await invalidate('dashboard:stats');
    return updated;
  },

  // Admin
  getAllOrders: async ({ page = 1, limit = 20, status } = {}) => {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      orderRepository.findAll({ skip, take: limit, status }),
      orderRepository.countAll(status),
    ]);
    return { orders, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getDashboardStats: async () => {
    return getOrSet('dashboard:stats', async () => {
      const [sales, totalSkins, totalOrders, totalCases, totalWallets, totalInventoryItems, totalBattles, totalTransactions, totalCaseOpenings, recentOrders, recentCaseOpens] = await Promise.all([
        orderRepository.salesStats(),
        prisma.skin.count(),
        prisma.order.count(),
        prisma.case.count(),
        prisma.wallet.count(),
        prisma.userInventoryItem.count(),
        prisma.battle.count(),
        prisma.walletTransaction.count(),
        prisma.caseOpeningHistory.count(),
        prisma.order.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { orderItems: true } }),
        prisma.caseOpeningHistory.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { case: true, skin: true },
        }),
      ]);
      return {
        totalRevenue: sales._sum.totalAmount || 0,
        completedOrders: sales._count.id,
        totalSkins,
        totalOrders,
        totalCases,
        totalWallets,
        totalInventoryItems,
        totalBattles,
        totalTransactions,
        totalCaseOpenings,
        recentOrders,
        recentCaseOpens,
      };
    }, config.cache.dashboardTtl);
  },
};

module.exports = orderService;
