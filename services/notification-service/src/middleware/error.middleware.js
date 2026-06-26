const logger = require('../utils/logger');
const notFound = (req, res) => res.status(404).json({ success: false, message: 'Not found' });
// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
  logger.error(err.message);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Server error' });
};
module.exports = { notFound, globalErrorHandler };
