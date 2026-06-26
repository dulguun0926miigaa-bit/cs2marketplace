const prisma = require('../config/prisma');

const parseSkin = (skin) => {
  if (!skin) return skin;
  try {
    skin.images = typeof skin.images === 'string' ? JSON.parse(skin.images) : skin.images;
  } catch {
    skin.images = [];
  }
  return skin;
};

const tradeService = {
  createOffer: async (senderId, { receiverId, inventoryItemIds, message }) => {
    if (!receiverId || senderId === parseInt(receiverId, 10)) {
      const err = new Error('Invalid trade recipient');
      err.statusCode = 400;
      throw err;
    }
    if (!inventoryItemIds?.length) {
      const err = new Error('At least one item is required');
      err.statusCode = 400;
      throw err;
    }

    const items = await prisma.userInventoryItem.findMany({
      where: {
        id: { in: inventoryItemIds.map((id) => parseInt(id, 10)) },
        userId: senderId,
        status: 'ACTIVE',
      },
      include: { skin: true },
    });

    if (items.length !== inventoryItemIds.length) {
      const err = new Error('One or more items are unavailable');
      err.statusCode = 400;
      throw err;
    }

    return prisma.$transaction(async (tx) => {
      const offer = await tx.tradeOffer.create({
        data: {
          senderId,
          receiverId: parseInt(receiverId, 10),
          message: message || null,
          items: {
            create: items.map((item) => ({
              inventoryItemId: item.id,
              ownerId: senderId,
              skinId: item.skinId,
            })),
          },
        },
        include: { items: { include: { skin: true, inventoryItem: true } } },
      });
      await tx.userInventoryItem.updateMany({
        where: { id: { in: items.map((i) => i.id) } },
        data: { status: 'IN_TRADE' },
      });
      return offer;
    });
  },

  getIncoming: async (userId) => {
    const offers = await prisma.tradeOffer.findMany({
      where: { receiverId: userId, status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { skin: true } } },
    });
    return offers.map((o) => ({
      ...o,
      items: o.items.map((i) => ({ ...i, skin: parseSkin(i.skin) })),
    }));
  },

  getOutgoing: async (userId) => {
    const offers = await prisma.tradeOffer.findMany({
      where: { senderId: userId },
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { skin: true } } },
    });
    return offers.map((o) => ({
      ...o,
      items: o.items.map((i) => ({ ...i, skin: parseSkin(i.skin) })),
    }));
  },

  getHistory: async (userId, { page = 1, limit = 20 } = {}) => {
    const skip = (page - 1) * limit;
    const where = {
      OR: [{ senderId: userId }, { receiverId: userId }],
      status: { in: ['ACCEPTED', 'DECLINED', 'CANCELLED'] },
    };
    const [offers, total] = await Promise.all([
      prisma.tradeOffer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: { items: { include: { skin: true } } },
      }),
      prisma.tradeOffer.count({ where }),
    ]);
    return {
      offers: offers.map((o) => ({
        ...o,
        items: o.items.map((i) => ({ ...i, skin: parseSkin(i.skin) })),
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  acceptOffer: async (userId, offerId) => {
    const offer = await prisma.tradeOffer.findUnique({
      where: { id: parseInt(offerId, 10) },
      include: { items: true },
    });
    if (!offer || offer.receiverId !== userId) {
      const err = new Error('Trade offer not found');
      err.statusCode = 404;
      throw err;
    }
    if (offer.status !== 'PENDING') {
      const err = new Error('Trade offer is no longer pending');
      err.statusCode = 400;
      throw err;
    }

    return prisma.$transaction(async (tx) => {
      for (const item of offer.items) {
        await tx.userInventoryItem.update({
          where: { id: item.inventoryItemId },
          data: { userId, status: 'ACTIVE' },
        });
      }
      return tx.tradeOffer.update({
        where: { id: offer.id },
        data: { status: 'ACCEPTED' },
        include: { items: { include: { skin: true } } },
      });
    });
  },

  declineOffer: async (userId, offerId) => {
    const offer = await prisma.tradeOffer.findUnique({
      where: { id: parseInt(offerId, 10) },
      include: { items: true },
    });
    if (!offer || offer.receiverId !== userId) {
      const err = new Error('Trade offer not found');
      err.statusCode = 404;
      throw err;
    }
    if (offer.status !== 'PENDING') {
      const err = new Error('Trade offer is no longer pending');
      err.statusCode = 400;
      throw err;
    }

    return prisma.$transaction(async (tx) => {
      await tx.userInventoryItem.updateMany({
        where: { id: { in: offer.items.map((i) => i.inventoryItemId) } },
        data: { status: 'ACTIVE' },
      });
      return tx.tradeOffer.update({
        where: { id: offer.id },
        data: { status: 'DECLINED' },
      });
    });
  },

  cancelOffer: async (userId, offerId) => {
    const offer = await prisma.tradeOffer.findUnique({
      where: { id: parseInt(offerId, 10) },
      include: { items: true },
    });
    if (!offer || offer.senderId !== userId) {
      const err = new Error('Trade offer not found');
      err.statusCode = 404;
      throw err;
    }
    if (offer.status !== 'PENDING') {
      const err = new Error('Trade offer is no longer pending');
      err.statusCode = 400;
      throw err;
    }

    return prisma.$transaction(async (tx) => {
      await tx.userInventoryItem.updateMany({
        where: { id: { in: offer.items.map((i) => i.inventoryItemId) } },
        data: { status: 'ACTIVE' },
      });
      return tx.tradeOffer.update({
        where: { id: offer.id },
        data: { status: 'CANCELLED' },
      });
    });
  },
};

module.exports = tradeService;
