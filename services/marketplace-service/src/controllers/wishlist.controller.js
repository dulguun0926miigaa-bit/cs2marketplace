const wishlistService = require('../services/wishlist.service');
const { success } = require('../utils/response');

const wishlistController = {
  getWishlist: async (req, res, next) => {
    try {
      const items = await wishlistService.getWishlist(req.user.id);
      return success(res, { items });
    } catch (err) { next(err); }
  },

  toggle: async (req, res, next) => {
    try {
      const result = await wishlistService.toggle(req.user.id, parseInt(req.params.skinId, 10));
      return success(res, result, result.message);
    } catch (err) { next(err); }
  },

  remove: async (req, res, next) => {
    try {
      await wishlistService.remove(req.user.id, parseInt(req.params.skinId, 10));
      return success(res, {}, 'Removed from wishlist');
    } catch (err) { next(err); }
  },
};

module.exports = wishlistController;
