const prisma = require('../config/prisma');
const { success } = require('../utils/response');

const collectionController = {
  getAll: async (req, res, next) => {
    try {
      const collections = await prisma.collection.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
        include: { _count: { select: { skins: true } } },
      });
      return success(res, { collections });
    } catch (err) {
      next(err);
    }
  },

  getBySlug: async (req, res, next) => {
    try {
      const collection = await prisma.collection.findUnique({
        where: { slug: req.params.slug },
        include: {
          skins: {
            where: { isAvailable: true },
            take: 50,
            include: { category: true },
          },
        },
      });
      if (!collection) {
        return res.status(404).json({ success: false, message: 'Collection not found' });
      }
      collection.skins = collection.skins.map((skin) => {
        try {
          skin.images = typeof skin.images === 'string' ? JSON.parse(skin.images) : skin.images;
        } catch {
          skin.images = [];
        }
        return skin;
      });
      return success(res, { collection });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = collectionController;
