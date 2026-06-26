const express = require('express');
const router = express.Router();
const battleController = require('../controllers/battle.controller');
const { fromGateway, verifyToken, optionalAuth } = require('../middleware/auth.middleware');

router.use(fromGateway);

router.get('/', optionalAuth, battleController.list);
router.get('/rankings', battleController.rankings);
router.get('/history', verifyToken, battleController.history);
router.get('/:id', optionalAuth, battleController.getById);
router.post('/', verifyToken, battleController.create);
router.post('/:id/join', verifyToken, battleController.join);
router.post('/:id/messages', verifyToken, battleController.sendMessage);

module.exports = router;
