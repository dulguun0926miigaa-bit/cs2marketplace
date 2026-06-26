const skinService = require('../services/skin.service');
const { success, created, error, paginated } = require('../utils/response');

const skinController = {
  getAll: async (req, res, next) => {
    try {
      const result = await skinService.getAll({ ...req.query, limit: parseInt(req.query.limit, 10) || 20, page: parseInt(req.query.page, 10) || 1 });
      return paginated(res, result.skins, result.pagination);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const skin = await skinService.getById(parseInt(req.params.id, 10), req.user?.id);
      return success(res, { skin });
    } catch (err) { next(err); }
  },

  getRecentlyViewed: async (req, res, next) => {
    try {
      const skins = await skinService.getRecentlyViewed(req.user.id, parseInt(req.query.limit, 10) || 10);
      return success(res, { skins });
    } catch (err) { next(err); }
  },

  getPopular: async (req, res, next) => {
    try {
      const skins = await skinService.getPopular();
      return success(res, { skins });
    } catch (err) { next(err); }
  },

  getLatest: async (req, res, next) => {
    try {
      const skins = await skinService.getLatest();
      return success(res, { skins });
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const data = { ...req.body, categoryId: parseInt(req.body.categoryId, 10), price: parseFloat(req.body.price), float: parseFloat(req.body.float || 0), stock: parseInt(req.body.stock, 10) || 0, isAvailable: req.body.isAvailable !== 'false' };
      const skin = await skinService.create(data, req.files || []);
      return created(res, { skin }, 'Skin created successfully');
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const data = { ...req.body };
      if (data.price) data.price = parseFloat(data.price);
      if (data.float) data.float = parseFloat(data.float);
      if (data.stock) data.stock = parseInt(data.stock, 10);
      if (data.categoryId) data.categoryId = parseInt(data.categoryId, 10);
      const skin = await skinService.update(parseInt(req.params.id, 10), data, req.files || []);
      return success(res, { skin }, 'Skin updated successfully');
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await skinService.delete(parseInt(req.params.id, 10));
      return success(res, {}, 'Skin deleted successfully');
    } catch (err) { next(err); }
  },
};

module.exports = skinController;
