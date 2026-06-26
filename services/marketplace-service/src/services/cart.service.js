const cartRepository = require('../repositories/cart.repository');
const skinRepository = require('../repositories/skin.repository');

const cartService = {
  getCart: (userId) => cartRepository.findByUser(userId),

  addItem: async (userId, skinId, quantity = 1) => {
    const skin = await skinRepository.findById(skinId);
    if (!skin) {
      const err = new Error('Skin not found');
      err.statusCode = 404;
      throw err;
    }
    if (!skin.isAvailable || skin.stock < quantity) {
      const err = new Error('Skin not available or insufficient stock');
      err.statusCode = 400;
      throw err;
    }
    const existing = await cartRepository.findItem(userId, skinId);
    const newQty = existing ? existing.quantity + quantity : quantity;
    return cartRepository.upsert(userId, skinId, newQty);
  },

  updateItem: async (userId, skinId, quantity) => {
    if (quantity <= 0) return cartRepository.remove(userId, skinId);
    return cartRepository.upsert(userId, skinId, quantity);
  },

  removeItem: (userId, skinId) => cartRepository.remove(userId, skinId),

  clearCart: (userId) => cartRepository.clear(userId),

  getTotal: async (userId) => {
    const items = await cartRepository.findByUser(userId);
    const total = items.reduce((sum, item) => sum + parseFloat(item.skin.price) * item.quantity, 0);
    return { items, total: total.toFixed(2), count: items.length };
  },
};

module.exports = cartService;
