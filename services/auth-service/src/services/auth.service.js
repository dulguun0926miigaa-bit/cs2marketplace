const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const config = require('../config');
const userRepository = require('../repositories/user.repository');
const tokenRepository = require('../repositories/token.repository');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { publish } = require('../utils/rabbitmq');
const { safeGet, safeSet, safeDel } = require('../config/redis');
const logger = require('../utils/logger');

const authService = {
  register: async ({ email, username, password, firstName, lastName }) => {
    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
      const err = new Error('Email already registered');
      err.statusCode = 409;
      throw err;
    }
    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
      const err = new Error('Username already taken');
      err.statusCode = 409;
      throw err;
    }

    const userRole = await userRepository.findOrCreateUserRole();
    const hashedPassword = await bcrypt.hash(password, config.bcrypt.rounds);
    const user = await userRepository.create({
      email,
      username,
      password: hashedPassword,
      firstName: firstName || null,
      lastName: lastName || null,
      roleId: userRole.id,
    });

    // RabbitMQ is optional — never block registration if it's down
    publish('user.registered', {
      userId: user.id,
      email: user.email,
      username: user.username,
      timestamp: new Date().toISOString(),
    }).catch(() => {});

    const roleName = user.role?.name || 'User';
    const tokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: roleName,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await tokenRepository.create({ token: refreshToken, userId: user.id, expiresAt });

    logger.info(`User registered: ${email}`);
    return { user, accessToken, refreshToken };
  },

  login: async ({ email, password }) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }
    if (!user.isActive) {
      const err = new Error('Account is deactivated');
      err.statusCode = 403;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const roleName = user.role?.name || 'User';
    const tokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: roleName,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await tokenRepository.create({ token: refreshToken, userId: user.id, expiresAt });

    logger.info(`User logged in: ${email}`);
    return { user, accessToken, refreshToken };
  },

  refreshTokens: async (refreshToken) => {
    const record = await tokenRepository.findValid(refreshToken);
    if (!record) {
      const err = new Error('Invalid or expired refresh token');
      err.statusCode = 401;
      throw err;
    }

    await tokenRepository.revoke(refreshToken);

    const { user } = record;
    const tokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role?.name || 'User',
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await tokenRepository.create({ token: newRefreshToken, userId: user.id, expiresAt });

    return { user, accessToken: newAccessToken, refreshToken: newRefreshToken };
  },

  logout: async (refreshToken) => {
    if (refreshToken) await tokenRepository.revoke(refreshToken);
  },

  logoutAll: async (userId) => {
    await tokenRepository.revokeAllForUser(userId);
  },

  forgotPassword: async (email) => {
    const user = await userRepository.findByEmail(email);
    if (!user) return null;

    const resetToken = crypto.randomBytes(32).toString('hex');
    await safeSet(`pwd_reset:${resetToken}`, 3600, String(user.id));

    logger.info(`Password reset token for ${email}: ${resetToken}`);
    return resetToken;
  },

  resetPassword: async (token, newPassword) => {
    const userId = await safeGet(`pwd_reset:${token}`);
    if (!userId) {
      const err = new Error('Invalid or expired reset token');
      err.statusCode = 400;
      throw err;
    }

    const hashed = await bcrypt.hash(newPassword, config.bcrypt.rounds);
    await userRepository.update(parseInt(userId, 10), { password: hashed });
    await safeDel(`pwd_reset:${token}`);
    await tokenRepository.revokeAllForUser(parseInt(userId, 10));
  },

  getProfile: async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    return user;
  },

  updateProfile: async (userId, data) => {
    return userRepository.update(userId, data);
  },

  listUsers: async ({ page = 1, limit = 20, search = '' } = {}) => {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      userRepository.findAll({ skip, take: limit, search }),
      userRepository.count(search),
    ]);
    return {
      users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
};

module.exports = authService;
