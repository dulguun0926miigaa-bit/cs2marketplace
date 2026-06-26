require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./config');
const logger = require('./utils/logger');
const authRoutes = require('./routes/auth.routes');
const { notFound, globalErrorHandler } = require('./middleware/error.middleware');
const { connect: connectRabbitMQ } = require('./utils/rabbitmq');
const prisma = require('./config/prisma');

const app = express();

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));

// ─── Logging ─────────────────────────────────────────────────────────────────
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// ─── Body Parser ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health ──────────────────────────────────────────────────────────────────
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, service: 'auth-service', db: 'ok', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ success: false, service: 'auth-service', db: 'error', error: err.message });
  }
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/', authRoutes);

// ─── Error Handling ──────────────────────────────────────────────────────────
app.use(notFound);
app.use(globalErrorHandler);

// ─── Bootstrap ───────────────────────────────────────────────────────────────
const start = async () => {
  // Verify DB connection on startup — fail fast with a clear error
  try {
    await prisma.$connect();
    logger.info('✅ Database connected');
  } catch (err) {
    logger.error(`❌ Database connection failed: ${err.message}`);
    logger.error(`   DATABASE_URL: ${process.env.DATABASE_URL ? '[SET]' : '[NOT SET — this is the problem!]'}`);
    process.exit(1);
  }

  // RabbitMQ is optional — never block startup
  connectRabbitMQ().catch(() => {});

  app.listen(config.port, () => {
    logger.info(`🔐 Auth Service running on port ${config.port} [${config.env}]`);
  });
};

start().catch((err) => {
  logger.error(`Failed to start auth service: ${err.message}`);
  process.exit(1);
});

module.exports = app;
