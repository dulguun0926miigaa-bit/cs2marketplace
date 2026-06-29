const jwt = require('jsonwebtoken');
const config = require('../config');

const verifyToken = (req, res, next) => {
  try {
    const token = (req.headers['authorization'] || '').split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Access token required' });
    req.user = jwt.verify(token, config.jwt.secret);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token' });
  }
};

const optionalAuth = (req, res, next) => {
  try {
    const token = (req.headers['authorization'] || '').split(' ')[1];
    if (token) req.user = jwt.verify(token, config.jwt.secret);
  } catch { /* ignore */ }
  next();
};

// Accept X-User-* headers forwarded by API Gateway (after gateway already verified JWT)
const fromGateway = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (userId) {
    req.user = {
      id: parseInt(userId, 10),
      email: req.headers['x-user-email'],
      role: req.headers['x-user-role'],
      username: req.headers['x-user-username'],
    };
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user || String(req.user.role).toLowerCase() !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

module.exports = { verifyToken, optionalAuth, fromGateway, requireAdmin };
