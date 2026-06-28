const crypto = require('node:crypto');
const prisma = require('../config/prisma');
const redis = require('../config/redis');

const PENDING_DEPOSIT_PREFIX = 'deposit:pending:';
const PENDING_DEPOSIT_TTL = 3600; // seconds

const getPendingKey = (sessionId) => `${PENDING_DEPOSIT_PREFIX}${sessionId}`;

// ── Helpers ──────────────────────────────────────────────────────────────────
// We store pending sessions in Redis when available, falling back to the
// WalletTransaction table (status = PENDING_SESSION) so multiple service
// instances and Redis-down scenarios both work.

const savePendingDeposit = async (sessionId, data) => {
  const payload = JSON.stringify(data);
  // Try Redis with a short timeout
  if (redis && redis.status === 'ready') {
    try {
      await Promise.race([
        redis.setex(getPendingKey(sessionId), PENDING_DEPOSIT_TTL, payload),
        new Promise((_, rej) => setTimeout(() => rej(new Error('Redis timeout')), 500)),
      ]);
      return data;
    } catch { /* fall through to DB */ }
  }
  // DB fallback: store as a pending wallet transaction row
  const wallet = await prisma.wallet.findUnique({ where: { userId: data.userId } });
  if (wallet) {
    await prisma.walletTransaction.upsert({
      where: { stripeSessionId: sessionId },
      update: { status: 'PENDING_SESSION', amount: data.amount, description: `PENDING:${JSON.stringify(data)}` },
      create: {
        walletId: wallet.id,
        type: 'DEPOSIT',
        amount: data.amount,
        balanceAfter: wallet.balance,
        description: `PENDING:${JSON.stringify(data)}`,
        stripeSessionId: sessionId,
        status: 'PENDING_SESSION',
      },
    }).catch(() => {});
  }
  return data;
};

const getPendingDeposit = async (sessionId) => {
  // Try Redis with a short timeout
  if (redis && redis.status === 'ready') {
    try {
      const cached = await Promise.race([
        redis.get(getPendingKey(sessionId)),
        new Promise((_, rej) => setTimeout(() => rej(new Error('Redis timeout')), 500)),
      ]);
      if (cached) return JSON.parse(cached);
    } catch { /* fall through to DB */ }
  }
  // DB fallback
  const row = await prisma.walletTransaction.findUnique({
    where: { stripeSessionId: sessionId },
  }).catch(() => null);
  if (row && row.status === 'PENDING_SESSION' && row.description?.startsWith('PENDING:')) {
    try {
      return JSON.parse(row.description.slice('PENDING:'.length));
    } catch { return null; }
  }
  return null;
};

const deletePendingDeposit = async (sessionId) => {
  if (redis && redis.status === 'ready') {
    await redis.del(getPendingKey(sessionId)).catch(() => {});
  }
  // Clean up DB fallback row (ignore if already gone)
  await prisma.walletTransaction.deleteMany({
    where: { stripeSessionId: sessionId, status: 'PENDING_SESSION' },
  }).catch(() => {});
};

const walletService = {
  getOrCreateWallet: async (userId) => {
    let wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await prisma.wallet.create({ data: { userId, balance: 0 } });
    }
    return wallet;
  },

  getBalance: async (userId) => {
    const wallet = await walletService.getOrCreateWallet(userId);
    return { balance: wallet.balance, currency: wallet.currency };
  },

  getTransactions: async (userId, { page = 1, limit = 20 } = {}) => {
    const wallet = await walletService.getOrCreateWallet(userId);
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      prisma.walletTransaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.walletTransaction.count({ where: { walletId: wallet.id } }),
    ]);
    return { transactions, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  createDepositSession: async (userId, { amount, method = 'CARD' }) => {
    if (!amount || amount < 1) {
      const err = new Error('Minimum deposit is $1.00');
      err.statusCode = 400;
      throw err;
    }
    const wallet = await walletService.getOrCreateWallet(userId);
    const finalSessionId = `cs_mock_${crypto.randomBytes(8).toString('hex')}_${userId}`;

    await savePendingDeposit(finalSessionId, {
      userId,
      walletId: wallet.id,
      amount: parseFloat(amount),
      method,
      createdAt: Date.now(),
    });

    return {
      sessionId: finalSessionId,
      stripeSessionId: finalSessionId,
      amount: parseFloat(amount),
      method,
      checkoutUrl: `/deposit?session=${finalSessionId}`,
      expiresIn: PENDING_DEPOSIT_TTL,
    };
  },

  confirmDeposit: async (userId, { sessionId }) => {
    const pending = await getPendingDeposit(sessionId);
    if (!pending || pending.userId !== userId) {
      const err = new Error('Invalid or expired deposit session');
      err.statusCode = 400;
      throw err;
    }

    const result = await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      const newBalance = wallet.balance + pending.amount;
      const updated = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: newBalance },
      });
      // Upsert instead of create to avoid unique constraint collision
      // when the DB-fallback pending row already exists
      await tx.walletTransaction.upsert({
        where: { stripeSessionId: sessionId },
        update: {
          type: 'DEPOSIT',
          amount: pending.amount,
          balanceAfter: newBalance,
          description: `Deposit via ${pending.method}`,
          status: 'COMPLETED',
        },
        create: {
          walletId: wallet.id,
          type: 'DEPOSIT',
          amount: pending.amount,
          balanceAfter: newBalance,
          description: `Deposit via ${pending.method}`,
          stripeSessionId: sessionId,
          status: 'COMPLETED',
        },
      });
      return updated;
    });

    await deletePendingDeposit(sessionId);
    return { balance: result.balance, deposited: pending.amount };
  },

  deduct: async (userId, amount, { type, description, referenceId } = {}) => {
    const wallet = await walletService.getOrCreateWallet(userId);
    if (wallet.balance < amount) {
      const err = new Error('Insufficient wallet balance');
      err.statusCode = 400;
      throw err;
    }
    return prisma.$transaction(async (tx) => {
      const newBalance = wallet.balance - amount;
      const updated = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: newBalance },
      });
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: type || 'PURCHASE',
          amount: -amount,
          balanceAfter: newBalance,
          description,
          referenceId: referenceId ? String(referenceId) : null,
          status: 'COMPLETED',
        },
      });
      return updated;
    });
  },

  credit: async (userId, amount, { type, description, referenceId } = {}) => {
    const wallet = await walletService.getOrCreateWallet(userId);
    return prisma.$transaction(async (tx) => {
      const newBalance = wallet.balance + amount;
      const updated = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: newBalance },
      });
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: type || 'CREDIT',
          amount,
          balanceAfter: newBalance,
          description,
          referenceId: referenceId ? String(referenceId) : null,
          status: 'COMPLETED',
        },
      });
      return updated;
    });
  },
};

module.exports = walletService;
