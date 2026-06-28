const prisma = require('../config/prisma');
const walletService = require('./wallet.service');

const parseSkin = (skin) => {
  if (!skin) return skin;
  try {
    skin.images = typeof skin.images === 'string' ? JSON.parse(skin.images) : skin.images;
  } catch {
    skin.images = [];
  }
  return skin;
};

const pickWeightedItem = (items) => {
  const totalWeight = items.reduce((sum, item) => sum + item.dropRate, 0);
  let random = Math.random() * totalWeight;
  for (const item of items) {
    random -= item.dropRate;
    if (random <= 0) return item;
  }
  return items[items.length - 1];
};

const caseService = {
  getCases: async ({ featured } = {}) => {
    const where = { isActive: true };
    if (featured) where.isFeatured = true;
    return prisma.case.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
      include: { _count: { select: { caseItems: true } } },
    });
  },

  getCaseBySlug: async (slug) => {
    const caseData = await prisma.case.findUnique({
      where: { slug },
      include: {
        caseItems: {
          include: { skin: { include: { category: true } } },
          orderBy: { dropRate: 'asc' },
        },
      },
    });
    if (!caseData) {
      const err = new Error('Case not found');
      err.statusCode = 404;
      throw err;
    }
    caseData.caseItems = caseData.caseItems.map((item) => ({
      ...item,
      skin: parseSkin(item.skin),
    }));
    return caseData;
  },

  getRecentDrops: async (limit = 20) => {
    const drops = await prisma.recentDrop.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { skin: { include: { category: true } } },
    });
    return drops.map((drop) => ({
      ...drop,
      skin: parseSkin(drop.skin),
    }));
  },

  openCase: async (userId, slug, username) => {
    const caseData = await caseService.getCaseBySlug(slug);
    if (!caseData.caseItems.length) {
      const err = new Error('Case has no items');
      err.statusCode = 400;
      throw err;
    }

    const wallet = await walletService.getOrCreateWallet(userId);
    if (wallet.balance < caseData.price) {
      const err = new Error('Insufficient wallet balance');
      err.statusCode = 400;
      throw err;
    }

    const wonItem = pickWeightedItem(caseData.caseItems);
    const wonSkin = wonItem.skin;

    const result = await prisma.$transaction(async (tx) => {
      const currentWallet = await tx.wallet.findUnique({ where: { userId } });
      const newBalance = currentWallet.balance - caseData.price;
      await tx.wallet.update({
        where: { id: currentWallet.id },
        data: { balance: newBalance },
      });
      await tx.walletTransaction.create({
        data: {
          walletId: currentWallet.id,
          type: 'CASE_OPEN',
          amount: -caseData.price,
          balanceAfter: newBalance,
          description: `Opened ${caseData.name}`,
          referenceId: String(caseData.id),
          status: 'COMPLETED',
        },
      });

      const inventoryItem = await tx.userInventoryItem.create({
        data: {
          userId,
          skinId: wonSkin.id,
          source: 'CASE_OPEN',
          status: 'ACTIVE',
          wonPrice: wonSkin.price,
        },
        include: { skin: { include: { category: true } } },
      });

      await tx.recentDrop.create({
        data: {
          userId,
          username: username || `User${userId}`,
          skinId: wonSkin.id,
          caseId: caseData.id,
          caseName: caseData.name,
          price: wonSkin.price,
        },
      });

      await tx.caseOpeningHistory.create({
        data: {
          userId,
          caseId: caseData.id,
          skinId: wonSkin.id,
          price: caseData.price,
        },
      });

      await tx.skin.update({
        where: { id: wonSkin.id },
        data: { popularity: { increment: 1 } },
      });

      return { inventoryItem, newBalance, wonSkin };
    });

    return {
      won: result.wonSkin,
      inventoryItem: result.inventoryItem,
      balance: result.newBalance,
      caseName: caseData.name,
    };
  },

  getOpeningHistory: async (userId, { page = 1, limit = 20 } = {}) => {
    const skip = (page - 1) * limit;
    const [history, total] = await Promise.all([
      prisma.caseOpeningHistory.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          case: true,
          skin: { include: { category: true } },
        },
      }),
      prisma.caseOpeningHistory.count({ where: { userId } }),
    ]);
    return {
      history: history.map((h) => ({ ...h, skin: parseSkin(h.skin) })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
  getUserStats: async (userId) => {
    const [totalOpened, history] = await Promise.all([
      prisma.caseOpeningHistory.count({ where: { userId } }),
      prisma.caseOpeningHistory.findMany({
        where: { userId },
        include: { case: true, skin: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const totalSpent = history.reduce((s, h) => s + h.price, 0);

    // Highest value drop
    let highestDrop = null;
    let highestVal  = 0;
    for (const h of history) {
      if (h.skin?.price > highestVal) { highestVal = h.skin.price; highestDrop = parseSkin(h.skin); }
    }

    // Most opened case
    const caseCounts = {};
    for (const h of history) {
      caseCounts[h.case?.name] = (caseCounts[h.case?.name] || 0) + 1;
    }
    const mostOpened = Object.entries(caseCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      totalOpened,
      totalSpent: parseFloat(totalSpent.toFixed(2)),
      highestDrop,
      mostOpenedCase: mostOpened ? { name: mostOpened[0], count: mostOpened[1] } : null,
    };
  },
};

caseService.pickWeightedItem = pickWeightedItem;

module.exports = caseService;

// Admin helpers for case items
caseService.addCaseItem = async (caseId, skinId, dropRate = 1) => {
  const created = await prisma.caseItem.create({
    data: { caseId: parseInt(caseId, 10), skinId: parseInt(skinId, 10), dropRate: parseFloat(dropRate) },
    include: { skin: true },
  });
  return created;
};

caseService.updateCaseItem = async (itemId, data) => {
  const updated = await prisma.caseItem.update({
    where: { id: parseInt(itemId, 10) },
    data: { ...(data.dropRate !== undefined && { dropRate: parseFloat(data.dropRate) }) },
    include: { skin: true },
  });
  return updated;
};

caseService.removeCaseItem = async (itemId) => {
  const removed = await prisma.caseItem.delete({ where: { id: parseInt(itemId, 10) } });
  return removed;
};
