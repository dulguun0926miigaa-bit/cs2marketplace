const express = require('express');
const router = express.Router();
const skinController = require('../controllers/skin.controller');
const { fromGateway, verifyToken, requireAdmin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { createSkinValidator, updateSkinValidator, queryValidator } = require('../validators/skin.validator');

router.use(fromGateway);

router.get('/', queryValidator, skinController.getAll);
router.get('/popular', skinController.getPopular);
router.get('/latest', skinController.getLatest);
router.get('/recently-viewed', verifyToken, skinController.getRecentlyViewed);
router.get('/:id', skinController.getById);

// Admin only
router.post('/', verifyToken, requireAdmin, upload.array('images', 5), createSkinValidator, skinController.create);
router.put('/:id', verifyToken, requireAdmin, upload.array('images', 5), updateSkinValidator, skinController.update);
router.delete('/:id', verifyToken, requireAdmin, skinController.delete);

module.exports = router;
