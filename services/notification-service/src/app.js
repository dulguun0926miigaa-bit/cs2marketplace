require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./config');
const logger = require('./utils/logger');
const notificationRoutes = require('./routes/notification.routes');
const { notFound, globalErrorHandler } = require('./middleware/error.middleware');
const { startConsuming } = require('./consumers/event.consumer');

const app = express();

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(express.json());

app.get('/health', (req, res) =>
  res.json({ success: true, service: 'notification-service', timestamp: new Date().toISOString() })
);

app.use('/', notificationRoutes);
app.use(notFound);
app.use(globalErrorHandler);

const start = async () => {
  await startConsuming();
  app.listen(config.port, () => {
    logger.info(`🔔 Notification Service running on port ${config.port} [${config.env}]`);
  });
};

start().catch((err) => {
  logger.error(`Failed to start notification service: ${err.message}`);
  process.exit(1);
});

module.exports = app;
