require('dotenv').config();
module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3003,
  database: { url: process.env.DATABASE_URL },
  rabbitmq: { url: process.env.RABBITMQ_URL || 'amqp://localhost:5672' },
  redis: { url: process.env.REDIS_URL || 'redis://localhost:6379' },
  jwt: { secret: process.env.JWT_SECRET || 'fallback_secret' },
};
