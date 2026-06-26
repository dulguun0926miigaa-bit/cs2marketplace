const crypto = require('node:crypto');
const prisma = require('../config/prisma');

/**
 * SHA-256 hash of a JWT refresh token → 64 hex chars.
 * MySQL VARCHAR(191) fits 191 chars, so 64 is always safe.
 * We never need to retrieve the raw token from DB, only look it up / revoke it.
 */
const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const tokenRepository = {
  create: ({ token, userId, expiresAt }) =>
    prisma.refreshToken.create({
      data: { tokenHash: hashToken(token), userId, expiresAt },
    }),

  findValid: (token) =>
    prisma.refreshToken.findFirst({
      where: {
        tokenHash: hashToken(token),
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: { include: { role: true } } },
    }),

  revoke: (token) =>
    prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(token) },
      data: { isRevoked: true },
    }),

  revokeAllForUser: (userId) =>
    prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    }),

  deleteExpired: () =>
    prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    }),
};

module.exports = tokenRepository;
