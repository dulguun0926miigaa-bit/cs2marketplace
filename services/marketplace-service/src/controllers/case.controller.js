const caseService = require('../services/case.service');
const { success } = require('../utils/response');

const caseController = {
  getCases: async (req, res, next) => {
    try {
      const featured = req.query.featured === 'true';
      const cases = await caseService.getCases({ featured });
      return success(res, { cases });
    } catch (err) { next(err); }
  },

  getCaseBySlug: async (req, res, next) => {
    try {
      const caseData = await caseService.getCaseBySlug(req.params.slug);
      return success(res, { case: caseData });
    } catch (err) { next(err); }
  },

  getRecentDrops: async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit, 10) || 20;
      const drops = await caseService.getRecentDrops(limit);
      return success(res, { drops });
    } catch (err) { next(err); }
  },

  openCase: async (req, res, next) => {
    try {
      const result = await caseService.openCase(
        req.user.id,
        req.params.slug,
        req.user.username || req.user.email?.split('@')[0] || `User${req.user.id}`
      );
      return success(res, result, 'Case opened!');
    } catch (err) { next(err); }
  },

  getHistory: async (req, res, next) => {
    try {
      const page  = parseInt(req.query.page, 10)  || 1;
      const limit = parseInt(req.query.limit, 10) || 20;
      const result = await caseService.getOpeningHistory(req.user.id, { page, limit });
      return success(res, result);
    } catch (err) { next(err); }
  },

  getStats: async (req, res, next) => {
    try {
      const stats = await caseService.getUserStats(req.user.id);
      return success(res, { stats });
    } catch (err) { next(err); }
  },

  // Admin: add skin to case with drop rate
  addCaseItem: async (req, res, next) => {
    try {
      const caseId = parseInt(req.params.id, 10);
      const { skinId, dropRate = 1 } = req.body;
      const item = await caseService.addCaseItem(caseId, skinId, dropRate);
      return success(res, { item }, 'Case item added', 201);
    } catch (err) { next(err); }
  },

  updateCaseItem: async (req, res, next) => {
    try {
      const itemId = parseInt(req.params.itemId, 10);
      const { dropRate } = req.body;
      const item = await caseService.updateCaseItem(itemId, { dropRate });
      return success(res, { item }, 'Case item updated');
    } catch (err) { next(err); }
  },

  removeCaseItem: async (req, res, next) => {
    try {
      const itemId = parseInt(req.params.itemId, 10);
      const item = await caseService.removeCaseItem(itemId);
      return success(res, { item }, 'Case item removed');
    } catch (err) { next(err); }
  },
};

module.exports = caseController;
