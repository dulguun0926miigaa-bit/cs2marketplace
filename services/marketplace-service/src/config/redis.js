const Redis = require('ioredis');
const config = require('./index');
const logger = require('../utils/logger');

let redis = null;

try {
  redis = new Redis(config.redis.url, {
    retryStrategy: (times) => {
      if (times > 3) return null;
      return Math.min(times * 200, 2000);
    },
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    enableOfflineQueue: false,
  });
  redis.on('connect', () => logger.info('Redis connected (marketplace-service)'));
  redis.on('error', (err) => logger.warn(`Redis unavailable: ${err.message}`));
} catch (err) {
  logger.warn(`Redis init failed: ${err.message}`);
}

module.exports = redis;
