const walletService = require('../services/wallet.service');
const { success, created } = require('../utils/response');

const walletController = {
  getBalance: async (req, res, next) => {
    try {
      const result = await walletService.getBalance(req.user.id);
      return success(res, result);
    } catch (err) { next(err); }
  },

  getTransactions: async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const result = await walletService.getTransactions(req.user.id, {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 20,
      });
      return success(res, result);
    } catch (err) { next(err); }
  },

  createDeposit: async (req, res, next) => {
    try {
      const { amount, method } = req.body;
      const session = await walletService.createDepositSession(req.user.id, { amount, method });
      return created(res, { session }, 'Deposit session created');
    } catch (err) { next(err); }
  },

  confirmDeposit: async (req, res, next) => {
    try {
      const { sessionId } = req.body;
      const result = await walletService.confirmDeposit(req.user.id, { sessionId });
      return success(res, result, 'Deposit successful');
    } catch (err) { next(err); }
  },
};

module.exports = walletController;
