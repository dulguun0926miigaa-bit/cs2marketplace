const jwt = require('jsonwebtoken');
const config = require('../config');

const verifyToken = (req, res, next) => {
  try {
    const token = (req.headers['authorization'] || '').split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Access token required' });
    req.user = jwt.verify(token, config.jwt.secret);
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Accept forwarded user from gateway
const fromGateway = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (userId) {
    req.user = {
      id: parseInt(userId, 10),
      email: req.headers['x-user-email'],
      role: req.headers['x-user-role'],
    };
  }
  next();
};

module.exports = { verifyToken, fromGateway };
