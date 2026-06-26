const Redis = require('ioredis');
const config = require('./index');
const logger = require('../utils/logger');

let redis = null;

const createRedis = () => {
  try {
    const client = new Redis(config.redis.url, {
      retryStrategy: (times) => {
        if (times > 3) return null; // stop retrying
        return Math.min(times * 200, 2000);
      },
      maxRetriesPerRequest: 1,
      lazyConnect: true,
      enableOfflineQueue: false,
    });

    client.on('connect', () => logger.info('Redis connected (auth-service)'));
    client.on('error', (err) => logger.warn(`Redis unavailable: ${err.message} — running without cache`));

    return client;
  } catch (err) {
    logger.warn(`Redis init failed: ${err.message}`);
    return null;
  }
};

redis = createRedis();

// Safe wrappers — no-op when Redis is down
const safeGet = async (key) => {
  try { return redis ? await redis.get(key) : null; } catch { return null; }
};
const safeSet = async (key, ttl, value) => {
  try { if (redis) await redis.setex(key, ttl, value); } catch { /* ignore */ }
};
const safeDel = async (...keys) => {
  try { if (redis && keys.length) await redis.del(...keys); } catch { /* ignore */ }
};

module.exports = redis;
module.exports.safeGet = safeGet;
module.exports.safeSet = safeSet;
module.exports.safeDel = safeDel;
