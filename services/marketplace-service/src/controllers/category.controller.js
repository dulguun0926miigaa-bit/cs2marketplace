const categoryService = require('../services/category.service');
const { success, created } = require('../utils/response');

const categoryController = {
  getAll: async (req, res, next) => {
    try {
      const categories = await categoryService.getAll();
      return success(res, { categories });
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const category = await categoryService.getById(parseInt(req.params.id, 10));
      return success(res, { category });
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const category = await categoryService.create(req.body);
      return created(res, { category });
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const category = await categoryService.update(parseInt(req.params.id, 10), req.body);
      return success(res, { category }, 'Category updated');
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await categoryService.delete(parseInt(req.params.id, 10));
      return success(res, {}, 'Category deleted');
    } catch (err) { next(err); }
  },
};

module.exports = categoryController;
