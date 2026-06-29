const rateLimit = require('express-rate-limit');
const config = require('../config');

const globalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  // Allow safe GET traffic through without gateway-level throttling.
  // This prevents fast browsing on marketplace/catalog routes from hitting the gateway too quickly.
  skip: (req) => req.method === 'GET' || req.originalUrl?.startsWith('/api/auth'),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many auth attempts, please try again after 15 minutes.',
  },
});

const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Rate limit exceeded.',
  },
});

module.exports = { globalLimiter, authLimiter, strictLimiter };
