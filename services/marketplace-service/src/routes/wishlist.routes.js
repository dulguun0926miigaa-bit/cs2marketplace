const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const { fromGateway, verifyToken } = require('../middleware/auth.middleware');

router.use(fromGateway, verifyToken);

router.get('/', wishlistController.getWishlist);
router.post('/:skinId', wishlistController.toggle);
router.delete('/:skinId', wishlistController.remove);

module.exports = router;
