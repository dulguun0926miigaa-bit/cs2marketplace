const { body, query, param, validationResult } = require('express-validator');

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

const RARITIES = ['CONSUMER', 'INDUSTRIAL', 'MIL_SPEC', 'RESTRICTED', 'CLASSIFIED', 'COVERT', 'CONTRABAND', 'EXTRAORDINARY'];
const EXTERIORS = ['FACTORY_NEW', 'MINIMAL_WEAR', 'FIELD_TESTED', 'WELL_WORN', 'BATTLE_SCARRED'];

const normalizeEnum = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim().replace(/\s+/g, '_').toUpperCase();
};

const createSkinValidator = [
  body('name').notEmpty().isLength({ max: 255 }).trim().withMessage('Name is required (max 255)'),
  body('weapon').notEmpty().isLength({ max: 100 }).trim().withMessage('Weapon is required'),
  body('rarity')
    .customSanitizer(normalizeEnum)
    .isIn(RARITIES)
    .withMessage(`Rarity must be one of: ${RARITIES.join(', ')}`),
  body('exterior')
    .customSanitizer(normalizeEnum)
    .isIn(EXTERIORS)
    .withMessage(`Exterior must be one of: ${EXTERIORS.join(', ')}`),
  body('float').isFloat({ min: 0, max: 1 }).withMessage('Float must be between 0 and 1'),
  body('price').isDecimal({ decimal_digits: '0,2' }).withMessage('Price must be a valid decimal'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('categoryId').isInt({ min: 1 }).withMessage('Valid categoryId is required'),
  handle,
];

const updateSkinValidator = [
  body('name').optional({ checkFalsy: true }).isLength({ max: 255 }).trim(),
  body('weapon').optional({ checkFalsy: true }).isLength({ max: 100 }).trim(),
  body('rarity')
    .optional({ checkFalsy: true })
    .customSanitizer(normalizeEnum)
    .isIn(RARITIES),
  body('exterior')
    .optional({ checkFalsy: true })
    .customSanitizer(normalizeEnum)
    .isIn(EXTERIORS),
  body('float').optional({ checkFalsy: true }).isFloat({ min: 0, max: 1 }),
  body('price').optional({ checkFalsy: true }).isDecimal({ decimal_digits: '0,2' }),
  body('stock').optional({ checkFalsy: true }).isInt({ min: 0 }),
  handle,
];

const queryValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('minPrice').optional().isDecimal(),
  query('maxPrice').optional().isDecimal(),
  query('rarity').optional().isIn(RARITIES),
  query('exterior').optional().isIn(EXTERIORS),
  handle,
];

module.exports = { createSkinValidator, updateSkinValidator, queryValidator };
