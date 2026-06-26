const crypto = require('node:crypto');
const prisma = require('../config/prisma');
const walletService = require('./wallet.service');
const caseService = require('./case.service');

const MODE_PLAYERS = {
  ONE_V_ONE: 2,
  TWO_V_TWO: 4,
  GROUP: 4,
};

const generateInviteCode = () => crypto.randomBytes(4).toString('hex').toUpperCase();

const battleService = {
  listBattles: async ({ status, mode, isPrivate, page = 1, limit = 20 } = {}) => {
    const where = {};
    if (status) where.status = status;
    if (mode) where.mode = mode;
    if (isPrivate !== undefined) where.isPrivate = isPrivate === 'true' || isPrivate === true;

    const skip = (page - 1) * limit;
    const [battles, total] = await Promise.all([
      prisma.battle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          case: true,
          participants: true,
          _count: { select: { rounds: true, messages: true } },
        },
      }),
      prisma.battle.count({ where }),
    ]);

    return { battles, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getBattle: async (id) => {
    const battle = await prisma.battle.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        case: { include: { caseItems: { include: { skin: true } } } },
        participants: { orderBy: { joinedAt: 'asc' } },
        rounds: { include: { skin: true }, orderBy: [{ roundNumber: 'asc' }, { createdAt: 'asc' }] },
        messages: { orderBy: { createdAt: 'asc' }, take: 100 },
      },
    });
    if (!battle) {
      const err = new Error('Battle not found');
      err.statusCode = 404;
      throw err;
    }
    return battle;
  },

  createBattle: async (userId, username, { mode = 'ONE_V_ONE', caseId, caseCount = 1, isPrivate = false }) => {
    const caseData = await prisma.case.findUnique({ where: { id: parseInt(caseId, 10) } });
    if (!caseData || !caseData.isActive) {
      const err = new Error('Case not found');
      err.statusCode = 404;
      throw err;
    }

    const maxPlayers = MODE_PLAYERS[mode] || 2;
    const totalCost = caseData.price * caseCount;
    const wallet = await walletService.getOrCreateWallet(userId);
    if (wallet.balance < totalCost) {
      const err = new Error('Insufficient wallet balance to create battle');
      err.statusCode = 400;
      throw err;
    }

    const inviteCode = isPrivate ? generateInviteCode() : null;

    await walletService.deduct(userId, totalCost, {
      type: 'BATTLE_ENTRY',
      description: `Battle entry: ${caseData.name}`,
      referenceId: caseData.id,
    });

    const battle = await prisma.battle.create({
      data: {
        mode,
        maxPlayers,
        caseId: caseData.id,
        caseCount: parseInt(caseCount, 10),
        isPrivate,
        inviteCode,
        participants: {
          create: { userId, username: username || `User${userId}`, team: 1 },
        },
      },
      include: { case: true, participants: true },
    });

    return battle;
  },

  joinBattle: async (userId, username, battleId, { inviteCode } = {}) => {
    const battle = await battleService.getBattle(battleId);
    if (battle.status !== 'WAITING') {
      const err = new Error('Battle is not accepting players');
      err.statusCode = 400;
      throw err;
    }
    if (battle.isPrivate && battle.inviteCode !== inviteCode) {
      const err = new Error('Invalid invite code');
      err.statusCode = 403;
      throw err;
    }
    if (battle.participants.some((p) => p.userId === userId)) {
      const err = new Error('Already joined this battle');
      err.statusCode = 409;
      throw err;
    }
    if (battle.participants.length >= battle.maxPlayers) {
      const err = new Error('Battle is full');
      err.statusCode = 400;
      throw err;
    }

    const totalCost = battle.case.price * battle.caseCount;
    const wallet = await walletService.getOrCreateWallet(userId);
    if (wallet.balance < totalCost) {
      const err = new Error('Insufficient wallet balance to join battle');
      err.statusCode = 400;
      throw err;
    }

    const team = battle.mode === 'TWO_V_TWO'
      ? (battle.participants.filter((p) => p.team === 1).length < 2 ? 1 : 2)
      : 1;

    await walletService.deduct(userId, totalCost, {
      type: 'BATTLE_ENTRY',
      description: `Joined battle #${battleId}`,
      referenceId: battleId,
    });

    const updated = await prisma.$transaction(async (tx) => {
      await tx.battleParticipant.create({
        data: { battleId: battle.id, userId, username: username || `User${userId}`, team },
      });

      const refreshed = await tx.battle.findUnique({
        where: { id: battle.id },
        include: { case: true, participants: true },
      });

      if (refreshed.participants.length >= refreshed.maxPlayers) {
        return tx.battle.update({
          where: { id: battle.id },
          data: { status: 'COUNTDOWN', countdownAt: new Date(Date.now() + 5000) },
          include: { case: true, participants: true },
        });
      }
      return refreshed;
    });

    return updated;
  },

  runBattle: async (battleId) => {
    const battle = await battleService.getBattle(battleId);
    if (!['COUNTDOWN', 'WAITING'].includes(battle.status)) {
      return battle;
    }
    if (battle.participants.length < battle.maxPlayers) {
      const err = new Error('Not enough players to start');
      err.statusCode = 400;
      throw err;
    }

    const caseData = await caseService.getCaseBySlug(
      (await prisma.case.findUnique({ where: { id: battle.caseId } })).slug
    );

    const rounds = [];
    let roundNumber = 1;

    for (let c = 0; c < battle.caseCount; c += 1) {
      for (const participant of battle.participants) {
        const wonItem = caseService.pickWeightedItem(caseData.caseItems);
        rounds.push({
          battleId: battle.id,
          roundNumber,
          userId: participant.userId,
          skinId: wonItem.skinId,
          skinValue: wonItem.skin.price,
        });
        roundNumber += 1;
      }
    }

    const participantTotals = {};
    battle.participants.forEach((p) => { participantTotals[p.userId] = 0; });
    rounds.forEach((r) => { participantTotals[r.userId] += r.skinValue; });

    let winnerId;
    let maxValue = -1;
    Object.entries(participantTotals).forEach(([uid, val]) => {
      if (val > maxValue) {
        maxValue = val;
        winnerId = parseInt(uid, 10);
      }
    });

    const result = await prisma.$transaction(async (tx) => {
      await tx.battleRound.createMany({ data: rounds });

      for (const round of rounds) {
        if (round.userId === winnerId) {
          await tx.userInventoryItem.create({
            data: {
              userId: winnerId,
              skinId: round.skinId,
              source: 'BATTLE_WIN',
              status: 'ACTIVE',
              wonPrice: round.skinValue,
            },
          });
        }
      }

      await tx.battleParticipant.updateMany({
        where: { battleId: battle.id },
        data: { isWinner: false },
      });
      await tx.battleParticipant.updateMany({
        where: { battleId: battle.id, userId: winnerId },
        data: { isWinner: true, totalValue: maxValue },
      });

      for (const p of battle.participants) {
        if (p.userId !== winnerId) {
          await tx.battleParticipant.update({
            where: { id: p.id },
            data: { totalValue: participantTotals[p.userId] || 0 },
          });
        }
      }

      return tx.battle.update({
        where: { id: battle.id },
        data: {
          status: 'COMPLETED',
          winnerId,
          totalValue: maxValue,
          startedAt: new Date(),
          completedAt: new Date(),
        },
        include: {
          case: true,
          participants: true,
          rounds: { include: { skin: true } },
        },
      });
    });

    return result;
  },

  _pickWeightedItem: (items) => {
    const totalWeight = items.reduce((sum, item) => sum + item.dropRate, 0);
    let random = Math.random() * totalWeight;
    for (const item of items) {
      random -= item.dropRate;
      if (random <= 0) return item;
    }
    return items[items.length - 1];
  },

  getHistory: async (userId, { page = 1, limit = 20 } = {}) => {
    const skip = (page - 1) * limit;
    const where = { participants: { some: { userId } }, status: 'COMPLETED' };
    const [battles, total] = await Promise.all([
      prisma.battle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { completedAt: 'desc' },
        include: { case: true, participants: true },
      }),
      prisma.battle.count({ where }),
    ]);
    return { battles, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getRankings: async (limit = 20) => {
    const participants = await prisma.battleParticipant.groupBy({
      by: ['userId'],
      where: { isWinner: true },
      _count: { id: true },
      _sum: { totalValue: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });
    return participants.map((p, i) => ({
      rank: i + 1,
      userId: p.userId,
      wins: p._count.id,
      totalValue: p._sum.totalValue || 0,
    }));
  },

  sendMessage: async (battleId, userId, username, message) => {
    if (!message?.trim()) {
      const err = new Error('Message cannot be empty');
      err.statusCode = 400;
      throw err;
    }
    return prisma.battleMessage.create({
      data: {
        battleId: parseInt(battleId, 10),
        userId,
        username: username || `User${userId}`,
        message: message.trim().slice(0, 500),
      },
    });
  },

  autoStartReadyBattles: async () => {
    const ready = await prisma.battle.findMany({
      where: {
        status: 'COUNTDOWN',
        countdownAt: { lte: new Date() },
      },
    });
    for (const battle of ready) {
      await battleService.runBattle(battle.id);
    }
    return ready.length;
  },
};

module.exports = battleService;
