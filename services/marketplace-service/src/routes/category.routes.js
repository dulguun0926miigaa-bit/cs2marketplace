const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { fromGateway, verifyToken, requireAdmin } = require('../middleware/auth.middleware');

router.use(fromGateway);

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', verifyToken, requireAdmin, categoryController.create);
router.put('/:id', verifyToken, requireAdmin, categoryController.update);
router.delete('/:id', verifyToken, requireAdmin, categoryController.delete);

module.exports = router;
