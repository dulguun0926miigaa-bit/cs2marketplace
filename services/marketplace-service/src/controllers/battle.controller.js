const battleService = require('../services/battle.service');
const { success, created, paginated } = require('../utils/response');

const battleController = {
  list: async (req, res, next) => {
    try {
      const { page, limit, status, mode, isPrivate } = req.query;
      const result = await battleService.listBattles({
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 20,
        status,
        mode,
        isPrivate,
      });
      return paginated(res, result.battles, result.pagination);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      await battleService.autoStartReadyBattles();
      const battle = await battleService.getBattle(req.params.id);
      return success(res, { battle });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const battle = await battleService.createBattle(
        req.user.id,
        req.user.username || req.user.email,
        req.body
      );
      return created(res, { battle }, 'Battle created');
    } catch (err) {
      next(err);
    }
  },

  join: async (req, res, next) => {
    try {
      const battle = await battleService.joinBattle(
        req.user.id,
        req.user.username || req.user.email,
        req.params.id,
        req.body
      );
      if (battle.status === 'COUNTDOWN') {
        setTimeout(() => battleService.runBattle(battle.id).catch(() => {}), 5000);
      }
      return success(res, { battle }, 'Joined battle');
    } catch (err) {
      next(err);
    }
  },

  history: async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const result = await battleService.getHistory(req.user.id, {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 20,
      });
      return paginated(res, result.battles, result.pagination);
    } catch (err) {
      next(err);
    }
  },

  rankings: async (req, res, next) => {
    try {
      const rankings = await battleService.getRankings(parseInt(req.query.limit, 10) || 20);
      return success(res, { rankings });
    } catch (err) {
      next(err);
    }
  },

  sendMessage: async (req, res, next) => {
    try {
      const message = await battleService.sendMessage(
        req.params.id,
        req.user.id,
        req.user.username || req.user.email,
        req.body.message
      );
      return created(res, { message }, 'Message sent');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = battleController;
