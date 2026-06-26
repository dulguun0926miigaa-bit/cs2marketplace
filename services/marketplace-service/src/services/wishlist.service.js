const wishlistRepository = require('../repositories/wishlist.repository');
const skinRepository = require('../repositories/skin.repository');

const wishlistService = {
  getWishlist: (userId) => wishlistRepository.findByUser(userId),

  toggle: async (userId, skinId) => {
    const skin = await skinRepository.findById(skinId);
    if (!skin) {
      const err = new Error('Skin not found');
      err.statusCode = 404;
      throw err;
    }
    const existing = await wishlistRepository.findItem(userId, skinId);
    if (existing) {
      await wishlistRepository.remove(userId, skinId);
      return { added: false, message: 'Removed from wishlist' };
    }
    await wishlistRepository.add(userId, skinId);
    return { added: true, message: 'Added to wishlist' };
  },

  remove: (userId, skinId) => wishlistRepository.remove(userId, skinId),
};

module.exports = wishlistService;
