const prisma = require('../config/prisma');

const userRepository = {
  /**
   * Find user by id (includes role)
   */
  findById: (id) =>
    prisma.user.findUnique({
      where: { id },
      include: { role: true },
    }),

  /**
   * Find user by email (includes role)
   */
  findByEmail: (email) =>
    prisma.user.findUnique({
      where: { email },
      include: { role: true },
    }),

  /**
   * Find user by username
   */
  findByUsername: (username) =>
    prisma.user.findUnique({
      where: { username },
      include: { role: true },
    }),

  /**
   * Create a new user
   */
  create: (data) =>
    prisma.user.create({
      data,
      include: { role: true },
    }),

  findOrCreateUserRole: async () => {
    const existing = await prisma.role.findUnique({ where: { name: 'User' } });
    if (existing) return existing;
    return prisma.role.create({
      data: { name: 'User', description: 'Regular user' },
    });
  },

  /**
   * Find user by steamId
   */
  findBySteamId: (steamId) =>
    prisma.user.findFirst({
      where: { steamId },
      include: { role: true },
    }),

  /**
   * Find role by name
   */
  findRoleByName: (name) =>
    prisma.role.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    }),

  /**
   * Update user by id (alias)
   */
  updateById: (id, data) =>
    prisma.user.update({
      where: { id },
      data,
      include: { role: true },
    }),

  /**
   * Update user by id
   */
  update: (id, data) =>
    prisma.user.update({
      where: { id },
      data,
      include: { role: true },
    }),

  /**
   * Soft-delete (deactivate) user
   */
  deactivate: (id) =>
    prisma.user.update({
      where: { id },
      data: { isActive: false },
      include: { role: true },
    }),

  /**
   * List all users (admin)
   */
  findAll: ({ skip = 0, take = 20, search = '' } = {}) =>
    prisma.user.findMany({
      where: {
        OR: search
          ? [
              { email: { contains: search } },
              { username: { contains: search } },
              { firstName: { contains: search } },
              { lastName: { contains: search } },
            ]
          : undefined,
      },
      include: { role: true },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),

  count: (search = '') =>
    prisma.user.count({
      where: {
        OR: search
          ? [
              { email: { contains: search } },
              { username: { contains: search } },
            ]
          : undefined,
      },
    }),
};

module.exports = userRepository;
