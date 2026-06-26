const express = require('express');
const router = express.Router();
const config = require('../config');
const { verifyToken, requireAdmin, optionalAuth } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimiter.middleware');
const { buildProxy } = require('../middleware/proxy.middleware');

// ─── Auth Service Proxy ─────────────────────────────────────────────────────
// /api/auth/login  →  http://auth-service:3001/login
const authProxy = buildProxy(config.services.auth, {
  '^/api/auth': '',
});

router.use('/api/auth/login', authLimiter);
router.use('/api/auth/register', authLimiter);
router.use('/api/auth/forgot-password', authLimiter);
router.use('/api/auth', authProxy);

// ─── Marketplace Service Proxy ──────────────────────────────────────────────
// /api/marketplace/skins  →  http://marketplace-service:3002/skins
const marketplaceProxy = buildProxy(config.services.marketplace, {
  '^/api/marketplace': '',
});

// Public
router.use('/api/marketplace/skins', optionalAuth, marketplaceProxy);
router.use('/api/marketplace/categories', optionalAuth, marketplaceProxy);

// Protected
router.use('/api/marketplace/cart', verifyToken, marketplaceProxy);
router.use('/api/marketplace/wishlist', verifyToken, marketplaceProxy);
router.use('/api/marketplace/orders', verifyToken, marketplaceProxy);
router.use('/api/marketplace/checkout', verifyToken, marketplaceProxy);
router.use('/api/marketplace/wallet', verifyToken, marketplaceProxy);
router.use('/api/marketplace/inventory', verifyToken, marketplaceProxy);
router.use('/api/marketplace/battles', optionalAuth, marketplaceProxy);
router.use('/api/marketplace/trades', verifyToken, marketplaceProxy);
router.use('/api/marketplace/collections', optionalAuth, marketplaceProxy);

// Cases - public read, open requires token at service level
router.use('/api/marketplace/cases', optionalAuth, marketplaceProxy);

// Admin marketplace
router.use('/api/marketplace/admin', verifyToken, requireAdmin, marketplaceProxy);

// Fallback
router.use('/api/marketplace', optionalAuth, marketplaceProxy);

// ─── Notification Service Proxy ──────────────────────────────────────────────
// /api/notification  →  http://notification-service:3003/
const notificationProxy = buildProxy(config.services.notification, {
  '^/api/notification': '',
});
router.use('/api/notification', verifyToken, notificationProxy);

// ─── Gateway health ──────────────────────────────────────────────────────────
router.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'API Gateway',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
