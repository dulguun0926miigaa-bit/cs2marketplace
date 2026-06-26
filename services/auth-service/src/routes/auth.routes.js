const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');
const {
  registerValidator,
  loginValidator,
  refreshValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updateProfileValidator,
} = require('../validators/auth.validator');

// Public routes
router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);
router.post('/refresh', refreshValidator, authController.refresh);
router.post('/logout', authController.logout);
router.post('/forgot-password', forgotPasswordValidator, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidator, authController.resetPassword);

// Protected routes
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, updateProfileValidator, authController.updateProfile);
router.post('/logout-all', verifyToken, authController.logoutAll);

// Admin routes
router.get('/admin/users', verifyToken, requireAdmin, authController.listUsers);
router.get('/admin/users/:id', verifyToken, requireAdmin, authController.getUserById);

module.exports = router;
