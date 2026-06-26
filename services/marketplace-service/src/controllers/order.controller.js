const orderService = require('../services/order.service');
const { success, paginated } = require('../utils/response');

const orderController = {
  checkout: async (req, res, next) => {
    try {
      const order = await orderService.checkout(req.user.id, req.body);
      return success(res, { order }, 'Order created successfully', 201);
    } catch (err) { next(err); }
  },

  getMyOrders: async (req, res, next) => {
    try {
      const result = await orderService.getMyOrders(req.user.id, { page: parseInt(req.query.page, 10) || 1, limit: parseInt(req.query.limit, 10) || 20 });
      return paginated(res, result.orders, result.pagination);
    } catch (err) { next(err); }
  },

  getOrderById: async (req, res, next) => {
    try {
      const order = await orderService.getOrderById(parseInt(req.params.id, 10), req.user.id);
      return success(res, { order });
    } catch (err) { next(err); }
  },

  cancelOrder: async (req, res, next) => {
    try {
      const order = await orderService.cancelOrder(parseInt(req.params.id, 10), req.user.id);
      return success(res, { order }, 'Order cancelled');
    } catch (err) { next(err); }
  },

  processPayment: async (req, res, next) => {
    try {
      const payment = await orderService.processPayment(parseInt(req.params.id, 10), req.user.id, req.body);
      return success(res, { payment }, 'Payment processed');
    } catch (err) { next(err); }
  },

  // Admin
  getAllOrders: async (req, res, next) => {
    try {
      const result = await orderService.getAllOrders({ page: parseInt(req.query.page, 10) || 1, limit: parseInt(req.query.limit, 10) || 20, status: req.query.status });
      return paginated(res, result.orders, result.pagination);
    } catch (err) { next(err); }
  },

  getDashboard: async (req, res, next) => {
    try {
      const stats = await orderService.getDashboardStats();
      return success(res, stats);
    } catch (err) { next(err); }
  },
};

module.exports = orderController;
