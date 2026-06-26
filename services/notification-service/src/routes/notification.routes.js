const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { fromGateway, verifyToken } = require('../middleware/auth.middleware');

router.use(fromGateway, verifyToken);

router.get('/', notificationController.getMyNotifications);
router.patch('/:id/read', notificationController.markRead);
router.patch('/read-all', notificationController.markAllRead);

module.exports = router;
