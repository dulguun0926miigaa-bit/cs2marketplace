const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const skinController = require('../controllers/skin.controller');
const categoryController = require('../controllers/category.controller');
const caseController = require('../controllers/case.controller');
const { fromGateway, verifyToken, requireAdmin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const prisma = require('../config/prisma');
const { success, paginated } = require('../utils/response');

router.use(fromGateway, verifyToken, requireAdmin);

// ─── Dashboard ───────────────────────────────────────────────────────────────
router.get('/dashboard', orderController.getDashboard);

// ─── Orders ──────────────────────────────────────────────────────────────────
router.get('/orders', orderController.getAllOrders);
router.patch('/orders/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const VALID = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED'];
    if (!VALID.includes(status)) {
      return res.status(422).json({ success: false, message: 'Invalid status' });
    }
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id, 10) },
      data: { status },
      include: { orderItems: { include: { skin: true } }, payment: true },
    });
    return success(res, { order }, 'Order status updated');
  } catch (err) { next(err); }
});

// ─── Skins ────────────────────────────────────────────────────────────────────
router.get('/skins', skinController.getAll);
router.post('/skins', upload.array('images', 5), skinController.create);
router.put('/skins/:id', upload.array('images', 5), skinController.update);
router.delete('/skins/:id', skinController.delete);

// ─── Categories ───────────────────────────────────────────────────────────────
router.get('/categories', categoryController.getAll);
router.post('/categories', categoryController.create);
router.put('/categories/:id', categoryController.update);
router.delete('/categories/:id', categoryController.delete);

// ─── Cases ────────────────────────────────────────────────────────────────────
router.get('/cases', caseController.getCases);
router.post('/cases', async (req, res, next) => {
  try {
    const { name, slug, description, price, collectionId, isFeatured } = req.body;
    const newCase = await prisma.case.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description: description || null,
        price: parseFloat(price),
        collectionId: collectionId ? parseInt(collectionId, 10) : null,
        isFeatured: isFeatured === true || isFeatured === 'true',
      },
    });
    return success(res, { case: newCase }, 'Case created', 201);
  } catch (err) { next(err); }
});
router.put('/cases/:id', async (req, res, next) => {
  try {
    const { name, description, price, isFeatured, isActive } = req.body;
    const updated = await prisma.case.update({
      where: { id: parseInt(req.params.id, 10) },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(isFeatured !== undefined && { isFeatured: isFeatured === true || isFeatured === 'true' }),
        ...(isActive !== undefined && { isActive: isActive === true || isActive === 'true' }),
      },
    });
    return success(res, { case: updated }, 'Case updated');
  } catch (err) { next(err); }
});

// ─── Users (proxy from auth-service response) ─────────────────────────────────
// Admin user management is handled by auth-service /auth/admin/users
// Stats endpoint for quick counts
router.get('/stats/users', async (req, res, next) => {
  try {
    const [totalWallets, totalOrders, totalCaseOpens, topSpenders] = await Promise.all([
      prisma.wallet.count(),
      prisma.order.count(),
      prisma.caseOpeningHistory.count(),
      prisma.wallet.findMany({
        orderBy: { balance: 'desc' },
        take: 5,
        select: { userId: true, balance: true },
      }),
    ]);
    return success(res, { totalWallets, totalOrders, totalCaseOpens, topSpenders });
  } catch (err) { next(err); }
});

// ─── Transactions ─────────────────────────────────────────────────────────────
router.get('/transactions', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 30;
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      prisma.walletTransaction.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.walletTransaction.count(),
    ]);
    return paginated(res, transactions, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// ─── Battle management ────────────────────────────────────────────────────────
router.get('/battles', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const [battles, total] = await Promise.all([
      prisma.battle.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { case: true, participants: true },
      }),
      prisma.battle.count(),
    ]);
    return paginated(res, battles, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// ─── Case opening history ─────────────────────────────────────────────────────
router.get('/case-history', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 30;
    const skip = (page - 1) * limit;
    const [history, total] = await Promise.all([
      prisma.caseOpeningHistory.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { case: true, skin: true },
      }),
      prisma.caseOpeningHistory.count(),
    ]);
    return paginated(res, history, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

module.exports = router;
