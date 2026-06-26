const categoryRepository = require('../repositories/category.repository');

const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const categoryService = {
  getAll: () => categoryRepository.findAll(),

  getById: async (id) => {
    const cat = await categoryRepository.findById(id);
    if (!cat) {
      const err = new Error('Category not found');
      err.statusCode = 404;
      throw err;
    }
    return cat;
  },

  create: async (data) => {
    const slug = data.slug || slugify(data.name);
    return categoryRepository.create({ ...data, slug });
  },

  update: async (id, data) => {
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      const err = new Error('Category not found');
      err.statusCode = 404;
      throw err;
    }
    return categoryRepository.update(id, data);
  },

  delete: async (id) => {
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      const err = new Error('Category not found');
      err.statusCode = 404;
      throw err;
    }
    return categoryRepository.delete(id);
  },
};

module.exports = categoryService;
