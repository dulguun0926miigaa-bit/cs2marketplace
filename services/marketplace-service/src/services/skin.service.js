const skinRepository = require('../repositories/skin.repository');
const prisma = require('../config/prisma');
const { publish } = require('../utils/rabbitmq');
const { getOrSet, invalidate } = require('../utils/cache');
const config = require('../config');

const parseSkin = (skin) => {
  if (!skin) return skin;
  try {
    skin.images = typeof skin.images === 'string' ? JSON.parse(skin.images) : skin.images;
  } catch {
    skin.images = [];
  }
  return skin;
};

const parseSkins = (skins) => skins.map(parseSkin);

const skinService = {
  getAll: async ({
    page = 1, limit = 20, search, weapon, rarity, exterior,
    minPrice, maxPrice, minFloat, maxFloat, categoryId, collectionId,
    sortBy = 'createdAt', sortOrder = 'desc', isAvailable,
    isStatTrak, isSouvenir, sellerName,
  } = {}) => {
    const skip = (page - 1) * limit;
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { weapon: { contains: search } },
        { description: { contains: search } },
        { lore: { contains: search } },
      ];
    }
    if (weapon) where.weapon = { contains: weapon };
    if (rarity) where.rarity = rarity;
    if (exterior) where.exterior = exterior;
    if (categoryId) where.categoryId = parseInt(categoryId, 10);
    if (collectionId) where.collectionId = parseInt(collectionId, 10);
    if (isAvailable !== undefined) where.isAvailable = isAvailable === 'true' || isAvailable === true;
    if (isStatTrak !== undefined && isStatTrak !== '') {
      where.isStatTrak = isStatTrak === 'true' || isStatTrak === true;
    }
    if (isSouvenir !== undefined && isSouvenir !== '') {
      where.isSouvenir = isSouvenir === 'true' || isSouvenir === true;
    }
    if (sellerName) where.sellerName = { contains: sellerName };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (minFloat || maxFloat) {
      where.float = {};
      if (minFloat) where.float.gte = parseFloat(minFloat);
      if (maxFloat) where.float.lte = parseFloat(maxFloat);
    }

    const validSortFields = ['price', 'createdAt', 'name', 'float', 'popularity'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderBy = { [orderField]: sortOrder === 'asc' ? 'asc' : 'desc' };

    const { skins, total } = await skinRepository.findAll({ skip, take: limit, where, orderBy });
    return {
      skins: parseSkins(skins),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  getById: async (id, userId) => {
    const skin = await skinRepository.findById(id);
    if (!skin) {
      const err = new Error('Skin not found');
      err.statusCode = 404;
      throw err;
    }

    if (userId) {
      await prisma.recentlyViewed.upsert({
        where: { userId_skinId: { userId, skinId: id } },
        update: { viewedAt: new Date() },
        create: { userId, skinId: id },
      }).catch(() => {});
    }

    const [relatedSkins, recommendedSkins, marketStats] = await Promise.all([
      skinRepository.findRelated(skin, 6),
      skinRepository.findRecommended(skin, 6),
      skinRepository.getMarketStats(id),
    ]);

    return {
      ...parseSkin(skin),
      relatedSkins: parseSkins(relatedSkins),
      recommendedSkins: parseSkins(recommendedSkins),
      marketStats,
    };
  },

  getPopular: async () => {
    const skins = await getOrSet(
      'skins:popular',
      () => skinRepository.findPopular(10),
      config.cache.popularSkinsTtl
    );
    return parseSkins(skins);
  },

  getLatest: async () => {
    const skins = await getOrSet(
      'skins:latest',
      () => skinRepository.findLatest(10),
      config.cache.ttl
    );
    return parseSkins(skins);
  },

  getRecentlyViewed: async (userId, limit = 10) => {
    const items = await prisma.recentlyViewed.findMany({
      where: { userId },
      orderBy: { viewedAt: 'desc' },
      take: limit,
      include: { skin: { include: { category: true, collection: true } } },
    });
    return parseSkins(items.map((i) => i.skin));
  },

  create: async (data, files = []) => {
    const images = files.map((f) => `/uploads/${f.filename}`);
    const skinData = { ...data, images: JSON.stringify(images) };
    const skin = await skinRepository.create(skinData);
    await invalidate('skins:popular', 'skins:latest');
    await publish('skin.added', { skinId: skin.id, name: skin.name, timestamp: new Date().toISOString() });
    return parseSkin(skin);
  },

  update: async (id, data, files = []) => {
    const existing = await skinRepository.findById(id);
    if (!existing) {
      const err = new Error('Skin not found');
      err.statusCode = 404;
      throw err;
    }
    const existingImages = typeof existing.images === 'string'
      ? JSON.parse(existing.images)
      : existing.images;

    // Honor explicit images list in request body (for reordering / selecting main image)
    let newImages = existingImages;
    if (data && data.images) {
      try {
        newImages = typeof data.images === 'string' ? JSON.parse(data.images) : data.images;
      } catch {
        newImages = existingImages;
      }
    } else if (files.length > 0) {
      newImages = files.map((f) => `/uploads/${f.filename}`);
    }

    const skin = await skinRepository.update(id, { ...data, images: JSON.stringify(newImages) });
    await invalidate('skins:popular', 'skins:latest', `skin:${id}`);
    await publish('skin.updated', { skinId: skin.id, name: skin.name, timestamp: new Date().toISOString() });
    return parseSkin(skin);
  },

  delete: async (id) => {
    const existing = await skinRepository.findById(id);
    if (!existing) {
      const err = new Error('Skin not found');
      err.statusCode = 404;
      throw err;
    }
    await skinRepository.delete(id);
    await invalidate('skins:popular', 'skins:latest', `skin:${id}`);
  },
};

module.exports = skinService;
