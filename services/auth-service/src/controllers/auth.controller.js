const authService = require('../services/auth.service');
const { userDto, authResponseDto } = require('../dtos/auth.dto');
const { success, created, error, paginated } = require('../utils/response');
const logger = require('../utils/logger');

const authController = {
  register: async (req, res, next) => {
    try {
      const { user, accessToken, refreshToken } = await authService.register(req.body);
      return created(res, authResponseDto(user, accessToken, refreshToken), 'Registration successful');
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { user, accessToken, refreshToken } = await authService.login(req.body);
      return success(res, authResponseDto(user, accessToken, refreshToken), 'Login successful');
    } catch (err) {
      next(err);
    }
  },

  refresh: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshTokens(refreshToken);
      return success(res, authResponseDto(result.user, result.accessToken, result.refreshToken), 'Token refreshed');
    } catch (err) {
      next(err);
    }
  },

  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      await authService.logout(refreshToken);
      return success(res, {}, 'Logged out successfully');
    } catch (err) {
      next(err);
    }
  },

  logoutAll: async (req, res, next) => {
    try {
      await authService.logoutAll(req.user.id);
      return success(res, {}, 'All sessions terminated');
    } catch (err) {
      next(err);
    }
  },

  forgotPassword: async (req, res, next) => {
    try {
      await authService.forgotPassword(req.body.email);
      return success(res, {}, 'If that email exists, a reset link has been sent');
    } catch (err) {
      next(err);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      await authService.resetPassword(req.body.token, req.body.password);
      return success(res, {}, 'Password reset successfully');
    } catch (err) {
      next(err);
    }
  },

  getProfile: async (req, res, next) => {
    try {
      const user = await authService.getProfile(req.user.id);
      return success(res, { user: userDto(user) });
    } catch (err) {
      next(err);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const { firstName, lastName, avatar } = req.body;
      const user = await authService.updateProfile(req.user.id, { firstName, lastName, avatar });
      return success(res, { user: userDto(user) }, 'Profile updated');
    } catch (err) {
      next(err);
    }
  },

  // Admin
  listUsers: async (req, res, next) => {
    try {
      const { page = 1, limit = 20, search = '' } = req.query;
      const result = await authService.listUsers({
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        search,
      });
      return paginated(res, result.users.map(userDto), result.pagination);
    } catch (err) {
      next(err);
    }
  },

  getUserById: async (req, res, next) => {
    try {
      const user = await authService.getProfile(parseInt(req.params.id, 10));
      return success(res, { user: userDto(user) });
    } catch (err) {
      next(err);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id, 10);
      const { firstName, lastName, avatar, role, isActive, isVerified } = req.body;
      const user = await authService.updateUser(userId, { firstName, lastName, avatar, role, isActive, isVerified });
      return success(res, { user: userDto(user) }, 'User updated successfully');
    } catch (err) {
      next(err);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id, 10);
      if (req.user?.id === userId) {
        const error = new Error('Self-deletion is not allowed');
        error.statusCode = 400;
        throw error;
      }
      const user = await authService.deactivateUser(userId);
      return success(res, { user: userDto(user) }, 'User deactivated successfully');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
