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
};

module.exports = caseController;
