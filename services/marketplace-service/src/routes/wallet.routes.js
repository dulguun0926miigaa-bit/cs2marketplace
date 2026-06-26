const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');
const { fromGateway, verifyToken } = require('../middleware/auth.middleware');

router.use(fromGateway, verifyToken);

router.get('/balance', walletController.getBalance);
router.get('/transactions', walletController.getTransactions);
router.post('/deposit', walletController.createDeposit);
router.post('/deposit/confirm', walletController.confirmDeposit);

module.exports = router;
