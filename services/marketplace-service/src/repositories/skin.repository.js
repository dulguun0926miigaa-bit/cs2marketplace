const prisma = require('../config/prisma');

const skinRepository = {
  findAll: async ({ skip = 0, take = 20, where = {}, orderBy = { createdAt: 'desc' } } = {}) => {
    const [skins, total] = await Promise.all([
      prisma.skin.findMany({
        where,
        skip,
        take,
        orderBy,
        include: { category: true, collection: true },
      }),
      prisma.skin.count({ where }),
    ]);
    return { skins, total };
  },

  findById: (id) =>
    prisma.skin.findUnique({
      where: { id },
      include: { category: true, collection: true },
    }),

  create: (data) =>
    prisma.skin.create({ data, include: { category: true, collection: true } }),

  update: (id, data) =>
    prisma.skin.update({ where: { id }, data, include: { category: true, collection: true } }),

  delete: (id) => prisma.skin.delete({ where: { id } }),

  findPopular: (take = 10) =>
    prisma.skin.findMany({
      where: { isAvailable: true, stock: { gt: 0 } },
      orderBy: [{ popularity: 'desc' }, { createdAt: 'desc' }],
      take,
      include: { category: true, collection: true },
    }),

  findLatest: (take = 10) =>
    prisma.skin.findMany({
      where: { isAvailable: true },
      orderBy: { createdAt: 'desc' },
      take,
      include: { category: true, collection: true },
    }),

  findRelated: (skin, take = 6) => {
    const orConditions = [
      { weapon: skin.weapon },
      { categoryId: skin.categoryId },
    ];
    if (skin.collectionId) orConditions.unshift({ collectionId: skin.collectionId });
    return prisma.skin.findMany({
      where: {
        id: { not: skin.id },
        isAvailable: true,
        OR: orConditions,
      },
      orderBy: { popularity: 'desc' },
      take,
      include: { category: true, collection: true },
    });
  },

  findRecommended: (skin, take = 6) =>
    prisma.skin.findMany({
      where: {
        id: { not: skin.id },
        isAvailable: true,
        rarity: skin.rarity,
        price: { gte: skin.price * 0.5, lte: skin.price * 1.5 },
      },
      orderBy: { popularity: 'desc' },
      take,
      include: { category: true, collection: true },
    }),

  getMarketStats: async (skinId) => {
    const [orders, openings, wishlistCount] = await Promise.all([
      prisma.orderItem.count({ where: { skinId } }),
      prisma.caseOpeningHistory.count({ where: { skinId } }),
      prisma.wishlistItem.count({ where: { skinId } }),
    ]);
    const recentSales = await prisma.orderItem.findMany({
      where: { skinId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { price: true, createdAt: true },
    });
    return {
      totalSales: orders,
      caseDrops: openings,
      wishlistCount,
      recentSales,
    };
  },

  decrementStock: (id, qty = 1) =>
    prisma.skin.update({
      where: { id },
      data: { stock: { decrement: qty } },
    }),

  incrementStock: (id, qty = 1) =>
    prisma.skin.update({
      where: { id },
      data: { stock: { increment: qty } },
    }),
};

module.exports = skinRepository;
