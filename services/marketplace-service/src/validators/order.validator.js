const { body, validationResult } = require('express-validator');

const handle = (req, res, next) => {
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

const checkoutValidator = [
  body('notes').optional().isLength({ max: 500 }).trim(),
  handle,
];

const paymentValidator = [
  body('method').isIn(['CARD', 'PAYPAL', 'CRYPTO', 'BALANCE']).withMessage('Invalid payment method'),
  body('transactionId').optional().isString(),
  handle,
];

module.exports = { checkoutValidator, paymentValidator };
