const prisma = require('../config/prisma');

const categoryRepository = {
  findAll: () =>
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),

  findById: (id) => prisma.category.findUnique({ where: { id } }),

  findBySlug: (slug) => prisma.category.findUnique({ where: { slug } }),

  create: (data) => prisma.category.create({ data }),

  update: (id, data) => prisma.category.update({ where: { id }, data }),

  delete: (id) => prisma.category.delete({ where: { id } }),
};

module.exports = categoryRepository;
