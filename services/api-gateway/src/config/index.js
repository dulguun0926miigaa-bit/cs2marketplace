require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,

  services: {
    // Prefer explicit IPv4 loopback to avoid possible IPv6/localhost resolution issues
    auth: process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:3001',
    marketplace: process.env.MARKETPLACE_SERVICE_URL || 'http://127.0.0.1:3002',
    notification: process.env.NOTIFICATION_SERVICE_URL || 'http://127.0.0.1:3003',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  cors: {
    origins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(','),
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 200,
  },
};

module.exports = config;
