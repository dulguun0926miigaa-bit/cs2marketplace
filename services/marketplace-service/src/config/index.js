require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3002,
  database: { url: process.env.DATABASE_URL },
  jwt: { secret: process.env.JWT_SECRET || 'fallback_secret' },
  redis: { url: process.env.REDIS_URL || 'redis://localhost:6379' },
  rabbitmq: { url: process.env.RABBITMQ_URL || 'amqp://localhost:5672' },
  upload: {
    dest: process.env.UPLOAD_DIR || 'uploads',
    maxSize: 5 * 1024 * 1024, // 5 MB
  },
  cache: {
    ttl: 300, // seconds
    popularSkinsTtl: 600,
    dashboardTtl: 120,
  },
};

module.exports = config;
