const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/trade.controller');
const { fromGateway, verifyToken } = require('../middleware/auth.middleware');

router.use(fromGateway);
router.use(verifyToken);

router.post('/', tradeController.create);
router.get('/incoming', tradeController.incoming);
router.get('/outgoing', tradeController.outgoing);
router.get('/history', tradeController.history);
router.post('/:id/accept', tradeController.accept);
router.post('/:id/decline', tradeController.decline);
router.post('/:id/cancel', tradeController.cancel);

module.exports = router;
