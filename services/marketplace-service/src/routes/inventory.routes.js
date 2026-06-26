const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { fromGateway, verifyToken } = require('../middleware/auth.middleware');

router.use(fromGateway, verifyToken);

router.get('/', inventoryController.getInventory);
router.post('/sell-all', inventoryController.sellAll);
router.post('/withdraw', inventoryController.withdraw);
router.post('/:id/sell', inventoryController.sellItem);

module.exports = router;
