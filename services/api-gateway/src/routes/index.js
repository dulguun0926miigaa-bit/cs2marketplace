const express = require('express');
const router = express.Router();
const config = require('../config');
const { verifyToken, requireAdmin, optionalAuth } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimiter.middleware');
const { buildProxy } = require('../middleware/proxy.middleware');

// ─── Auth Service Proxy ─────────────────────────────────────────────────────
// Proxy all auth routes to auth-service using the mounted path.
const authProxy = buildProxy(config.services.auth);

router.use('/api/auth/login', authLimiter);
router.use('/api/auth/register', authLimiter);
router.use('/api/auth/forgot-password', authLimiter);
router.use('/api/auth/steam', authProxy);   // Steam OpenID (public)
router.use('/api/auth', authProxy);

// ─── Marketplace Service Proxy ──────────────────────────────────────────────
// Proxy all marketplace routes to marketplace-service using the mounted path.
const marketplaceProxy = buildProxy(config.services.marketplace);

// Admin marketplace is forwarded to marketplace-service without gateway-level auth.
// The marketplace-service itself validates JWT and admin role.
router.use(
  '/api/marketplace/admin',
  buildProxy(config.services.marketplace, (path) => path.replace(/^\/api\/marketplace\/admin/, '/admin'))
);

// All other marketplace requests are forwarded to marketplace-service.
// The downstream service enforces auth/authorization for protected routes.
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
