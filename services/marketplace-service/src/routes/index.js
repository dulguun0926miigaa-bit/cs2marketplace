const express = require('express');
const router = express.Router();

const skinRoutes = require('./skin.routes');
const categoryRoutes = require('./category.routes');
const cartRoutes = require('./cart.routes');
const wishlistRoutes = require('./wishlist.routes');
const orderRoutes = require('./order.routes');
const adminRoutes = require('./admin.routes');
const caseRoutes = require('./case.routes');
const walletRoutes = require('./wallet.routes');
const inventoryRoutes = require('./inventory.routes');
const battleRoutes = require('./battle.routes');
const tradeRoutes = require('./trade.routes');
const collectionRoutes = require('./collection.routes');

router.use('/skins', skinRoutes);
router.use('/categories', categoryRoutes);
router.use('/collections', collectionRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);
router.use('/cases', caseRoutes);
router.use('/wallet', walletRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/battles', battleRoutes);
router.use('/trades', tradeRoutes);

router.get('/health', (req, res) =>
  res.json({ success: true, service: 'marketplace-service', timestamp: new Date().toISOString() })
);

module.exports = router;
