const inventoryService = require('../services/inventory.service');
const { success } = require('../utils/response');

const inventoryController = {
  getInventory: async (req, res, next) => {
    try {
      const { status, rarity, weapon, page, limit } = req.query;
      const result = await inventoryService.getInventory(req.user.id, {
        status,
        rarity,
        weapon,
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 50,
      });
      return success(res, result);
    } catch (err) { next(err); }
  },

  sellItem: async (req, res, next) => {
    try {
      const result = await inventoryService.sellItem(req.user.id, parseInt(req.params.id, 10));
      return success(res, result, 'Item sold');
    } catch (err) { next(err); }
  },

  sellAll: async (req, res, next) => {
    try {
      const result = await inventoryService.sellAll(req.user.id);
      return success(res, result, 'All items sold');
    } catch (err) { next(err); }
  },

  withdraw: async (req, res, next) => {
    try {
      const { itemIds } = req.body;
      const result = await inventoryService.withdraw(req.user.id, itemIds);
      return success(res, result, 'Withdrawal submitted');
    } catch (err) { next(err); }
  },
};

module.exports = inventoryController;
