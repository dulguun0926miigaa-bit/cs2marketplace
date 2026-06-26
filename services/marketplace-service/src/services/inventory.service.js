const prisma = require('../config/prisma');
const walletService = require('./wallet.service');

const inventoryService = {
  getInventory: async (userId, { status = 'ACTIVE', rarity, weapon, page = 1, limit = 50 } = {}) => {
    const where = { userId, status };
    if (rarity) where.skin = { rarity };
    if (weapon) where.skin = { ...where.skin, weapon };

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.userInventoryItem.findMany({
        where,
        include: { skin: { include: { category: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.userInventoryItem.count({ where }),
    ]);

    const totalValue = items.reduce((sum, item) => sum + parseFloat(item.skin.price), 0);
    return {
      items,
      totalValue: totalValue.toFixed(2),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  sellItem: async (userId, itemId) => {
    const item = await prisma.userInventoryItem.findFirst({
      where: { id: itemId, userId, status: 'ACTIVE' },
      include: { skin: true },
    });
    if (!item) {
      const err = new Error('Inventory item not found');
      err.statusCode = 404;
      throw err;
    }

    const sellPrice = parseFloat(item.skin.price) * 0.85;

    await prisma.$transaction(async (tx) => {
      await tx.userInventoryItem.update({
        where: { id: itemId },
        data: { status: 'SOLD' },
      });
    });

    const wallet = await walletService.credit(userId, sellPrice, {
      type: 'SELL',
      description: `Sold ${item.skin.name}`,
      referenceId: itemId,
    });

    return { sold: item.skin, amount: sellPrice, balance: wallet.balance };
  },

  sellAll: async (userId) => {
    const items = await prisma.userInventoryItem.findMany({
      where: { userId, status: 'ACTIVE' },
      include: { skin: true },
    });
    if (!items.length) {
      const err = new Error('No items to sell');
      err.statusCode = 400;
      throw err;
    }

    const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.skin.price) * 0.85, 0);

    await prisma.userInventoryItem.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: { status: 'SOLD' },
    });

    const wallet = await walletService.credit(userId, totalAmount, {
      type: 'SELL_ALL',
      description: `Sold ${items.length} items`,
    });

    return { count: items.length, amount: totalAmount, balance: wallet.balance };
  },

  withdraw: async (userId, itemIds) => {
    const ids = Array.isArray(itemIds) ? itemIds : [itemIds];
    const items = await prisma.userInventoryItem.findMany({
      where: { id: { in: ids.map(Number) }, userId, status: 'ACTIVE' },
      include: { skin: true },
    });
    if (!items.length) {
      const err = new Error('No valid items to withdraw');
      err.statusCode = 400;
      throw err;
    }

    await prisma.userInventoryItem.updateMany({
      where: { id: { in: items.map((i) => i.id) } },
      data: { status: 'WITHDRAWN' },
    });

    return {
      withdrawn: items.map((i) => i.skin),
      count: items.length,
      message: 'Withdrawal request submitted. Items will be sent to your Steam account within 24h.',
    };
  },
};

module.exports = inventoryService;
