const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const registerValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Зөв имэйл оруулна уу'),
  body('username')
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Нэвтрэх нэр 3-30 тэмдэгттэй, зөвхөн латин үсэг/тоо/_ байна'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Нууц үг хамгийн багадаа 6 тэмдэгт байна'),
  body('firstName').optional().isLength({ max: 50 }).trim(),
  body('lastName').optional().isLength({ max: 50 }).trim(),
  handleValidation,
];

const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Зөв имэйл оруулна уу'),
  body('password').notEmpty().withMessage('Нууц үг шаардлагатай'),
  handleValidation,
];

const refreshValidator = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  handleValidation,
];

const forgotPasswordValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  handleValidation,
];

const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must be 8+ chars with uppercase, lowercase, and number'),
  handleValidation,
];

const updateProfileValidator = [
  body('firstName').optional().isLength({ max: 50 }).trim(),
  body('lastName').optional().isLength({ max: 50 }).trim(),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
  handleValidation,
];

const adminUpdateUserValidator = [
  body('firstName').optional().isLength({ max: 50 }).trim(),
  body('lastName').optional().isLength({ max: 50 }).trim(),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
  body('role').optional().isString().trim().isIn(['Admin', 'User']).withMessage('Role must be Admin or User'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  body('isVerified').optional().isBoolean().withMessage('isVerified must be a boolean'),
  handleValidation,
];

module.exports = {
  registerValidator,
  loginValidator,
  refreshValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updateProfileValidator,
  adminUpdateUserValidator,
};
