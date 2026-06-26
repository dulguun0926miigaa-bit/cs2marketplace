require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const config = require('./config');
const logger = require('./utils/logger');
const routes = require('./routes');
const { globalLimiter } = require('./middleware/rateLimiter.middleware');
const { notFound, globalErrorHandler } = require('./middleware/error.middleware');

const app = express();

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user-email', 'x-user-role'],
  })
);

// ─── Rate Limiting ───────────────────────────────────────────────────────────
app.use(globalLimiter);

// ─── Request Logging ─────────────────────────────────────────────────────────
app.use(
  morgan('combined', {
    stream: { write: (msg) => logger.info(msg.trim()) },
  })
);

// ─── IMPORTANT: Do NOT parse body here — proxy needs raw stream ──────────────
// Body parsing is ONLY used for the /api/health and /api/docs routes
// Proxy routes forward the raw request body directly to microservices

// ─── Swagger Docs (needs body parsing only for its own routes) ───────────────
app.use('/api/health', express.json(), (req, res) => {
  res.json({ success: true, service: 'API Gateway', timestamp: new Date().toISOString() });
});

try {
  const swaggerUi = require('swagger-ui-express');
  const YAML = require('yamljs');
  const swaggerDoc = YAML.load(path.join(__dirname, '../swagger.yaml'));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
  logger.info('Swagger UI available at /api/docs');
} catch {
  logger.warn('swagger.yaml not found – Swagger UI disabled');
}

// ─── Proxy Routes (NO body parsing before these) ─────────────────────────────
app.use(routes);

// ─── 404 & Error ─────────────────────────────────────────────────────────────
app.use(notFound);
app.use(globalErrorHandler);

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(config.port, () => {
  logger.info(`🚀 API Gateway running on port ${config.port} [${config.env}]`);
});

module.exports = app;
