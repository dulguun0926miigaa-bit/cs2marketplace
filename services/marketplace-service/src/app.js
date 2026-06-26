require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const config = require('./config');
const logger = require('./utils/logger');
const routes = require('./routes');
const { notFound, globalErrorHandler } = require('./middleware/error.middleware');
const { connect: connectRabbitMQ } = require('./utils/rabbitmq');
const prisma = require('./config/prisma');

const app = express();

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/', routes);
app.use(notFound);
app.use(globalErrorHandler);

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
    logger.info(`🛒 Marketplace Service running on port ${config.port} [${config.env}]`);
  });
};

start().catch((err) => {
  logger.error(`Failed to start marketplace service: ${err.message}`);
  process.exit(1);
});

module.exports = app;
