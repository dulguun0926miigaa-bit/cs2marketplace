const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { fromGateway, verifyToken } = require('../middleware/auth.middleware');

router.use(fromGateway, verifyToken);

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.put('/items/:skinId', cartController.updateItem);
router.delete('/items/:skinId', cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;
