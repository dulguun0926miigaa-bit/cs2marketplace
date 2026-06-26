const tradeService = require('../services/trade.service');
const { success, created, paginated } = require('../utils/response');

const tradeController = {
  create: async (req, res, next) => {
    try {
      const offer = await tradeService.createOffer(req.user.id, req.body);
      return created(res, { offer }, 'Trade offer sent');
    } catch (err) {
      next(err);
    }
  },

  incoming: async (req, res, next) => {
    try {
      const offers = await tradeService.getIncoming(req.user.id);
      return success(res, { offers });
    } catch (err) {
      next(err);
    }
  },

  outgoing: async (req, res, next) => {
    try {
      const offers = await tradeService.getOutgoing(req.user.id);
      return success(res, { offers });
    } catch (err) {
      next(err);
    }
  },

  history: async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const result = await tradeService.getHistory(req.user.id, {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 20,
      });
      return paginated(res, result.offers, result.pagination);
    } catch (err) {
      next(err);
    }
  },

  accept: async (req, res, next) => {
    try {
      const offer = await tradeService.acceptOffer(req.user.id, req.params.id);
      return success(res, { offer }, 'Trade accepted');
    } catch (err) {
      next(err);
    }
  },

  decline: async (req, res, next) => {
    try {
      await tradeService.declineOffer(req.user.id, req.params.id);
      return success(res, {}, 'Trade declined');
    } catch (err) {
      next(err);
    }
  },

  cancel: async (req, res, next) => {
    try {
      await tradeService.cancelOffer(req.user.id, req.params.id);
      return success(res, {}, 'Trade cancelled');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = tradeController;
