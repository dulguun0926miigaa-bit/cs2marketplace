const cartService = require('../services/cart.service');
const { success } = require('../utils/response');

const cartController = {
  getCart: async (req, res, next) => {
    try {
      const result = await cartService.getTotal(req.user.id);
      return success(res, result);
    } catch (err) { next(err); }
  },

  addItem: async (req, res, next) => {
    try {
      const { skinId, quantity = 1 } = req.body;
      const item = await cartService.addItem(req.user.id, parseInt(skinId, 10), parseInt(quantity, 10));
      return success(res, { item }, 'Added to cart');
    } catch (err) { next(err); }
  },

  updateItem: async (req, res, next) => {
    try {
      const { quantity } = req.body;
      await cartService.updateItem(req.user.id, parseInt(req.params.skinId, 10), parseInt(quantity, 10));
      return success(res, {}, 'Cart updated');
    } catch (err) { next(err); }
  },

  removeItem: async (req, res, next) => {
    try {
      await cartService.removeItem(req.user.id, parseInt(req.params.skinId, 10));
      return success(res, {}, 'Removed from cart');
    } catch (err) { next(err); }
  },

  clearCart: async (req, res, next) => {
    try {
      await cartService.clearCart(req.user.id);
      return success(res, {}, 'Cart cleared');
    } catch (err) { next(err); }
  },
};

module.exports = cartController;
