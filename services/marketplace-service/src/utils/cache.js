const redis = require('../config/redis');
const logger = require('./logger');

const getOrSet = async (key, fetchFn, ttl = 300) => {
  try {
    if (redis) {
      const cached = await redis.get(key);
      if (cached) return JSON.parse(cached);
    }
    const data = await fetchFn();
    if (redis) {
      await redis.setex(key, ttl, JSON.stringify(data)).catch(() => {});
    }
    return data;
  } catch (err) {
    logger.warn(`Cache error [${key}]: ${err.message}`);
    return fetchFn();
  }
};

const invalidate = async (...keys) => {
  try {
    if (redis && keys.length) await redis.del(...keys).catch(() => {});
  } catch { /* ignore */ }
};

const invalidatePattern = async (pattern) => {
  try {
    if (redis) {
      const keys = await redis.keys(pattern);
      if (keys.length) await redis.del(...keys).catch(() => {});
    }
  } catch { /* ignore */ }
};

module.exports = { getOrSet, invalidate, invalidatePattern };
