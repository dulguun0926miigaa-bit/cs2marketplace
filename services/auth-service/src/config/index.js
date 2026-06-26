require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3001,
  database: { url: process.env.DATABASE_URL },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  redis: { url: process.env.REDIS_URL || 'redis://localhost:6379' },
  rabbitmq: { url: process.env.RABBITMQ_URL || 'amqp://localhost:5672' },
  bcrypt: { rounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10 },
};

module.exports = config;
