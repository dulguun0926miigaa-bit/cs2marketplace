const logger = require('../utils/logger');

const notFound = (req, res) =>
  res.status(404).json({ success: false, message: `${req.method} ${req.originalUrl} not found` });

// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { notFound, globalErrorHandler };
