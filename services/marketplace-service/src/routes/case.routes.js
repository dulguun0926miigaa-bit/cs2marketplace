const express = require('express');
const router = express.Router();
const caseController = require('../controllers/case.controller');
const { fromGateway, verifyToken, optionalAuth } = require('../middleware/auth.middleware');

router.use(fromGateway);

router.get('/', caseController.getCases);
router.get('/drops/recent', caseController.getRecentDrops);
router.get('/:slug', caseController.getCaseBySlug);
router.post('/:slug/open', verifyToken, caseController.openCase);

module.exports = router;
