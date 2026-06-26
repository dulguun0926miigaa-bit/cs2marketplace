const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { fromGateway, verifyToken } = require('../middleware/auth.middleware');
const { checkoutValidator, paymentValidator } = require('../validators/order.validator');

router.use(fromGateway, verifyToken);

router.post('/checkout', checkoutValidator, orderController.checkout);
router.get('/', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/cancel', orderController.cancelOrder);
router.post('/:id/payment', paymentValidator, orderController.processPayment);

module.exports = router;
