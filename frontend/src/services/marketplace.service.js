import api from './api';

export const skinService = {
  getAll: (params) => api.get('/marketplace/skins', { params }),
  getById: (id) => api.get(`/marketplace/skins/${id}`),
  getPopular: () => api.get('/marketplace/skins/popular'),
  getLatest: () => api.get('/marketplace/skins/latest'),
  create: (data) => api.post('/marketplace/skins', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/marketplace/skins/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/marketplace/skins/${id}`),
};

export const categoryService = {
  getAll: () => api.get('/marketplace/categories'),
  getById: (id) => api.get(`/marketplace/categories/${id}`),
  create: (data) => api.post('/marketplace/categories', data),
  update: (id, data) => api.put(`/marketplace/categories/${id}`, data),
  delete: (id) => api.delete(`/marketplace/categories/${id}`),
};

export const cartService = {
  getCart: () => api.get('/marketplace/cart'),
  addItem: (skinId, quantity = 1) => api.post('/marketplace/cart/items', { skinId, quantity }),
  updateItem: (skinId, quantity) => api.put(`/marketplace/cart/items/${skinId}`, { quantity }),
  removeItem: (skinId) => api.delete(`/marketplace/cart/items/${skinId}`),
  clearCart: () => api.delete('/marketplace/cart'),
};

export const wishlistService = {
  getWishlist: () => api.get('/marketplace/wishlist'),
  toggle: (skinId) => api.post(`/marketplace/wishlist/${skinId}`),
  remove: (skinId) => api.delete(`/marketplace/wishlist/${skinId}`),
};

export const orderService = {
  checkout: (data) => api.post('/marketplace/orders/checkout', data),
  getMyOrders: (params) => api.get('/marketplace/orders', { params }),
  getOrderById: (id) => api.get(`/marketplace/orders/${id}`),
  cancelOrder: (id) => api.patch(`/marketplace/orders/${id}/cancel`),
  processPayment: (id, data) => api.post(`/marketplace/orders/${id}/payment`, data),
};

export const adminService = {
  // Dashboard
  getDashboard: () => api.get('/marketplace/admin/dashboard'),
  getUserStats: () => api.get('/marketplace/admin/stats/users'),

  // Orders
  getAllOrders: (params) => api.get('/marketplace/admin/orders', { params }),
  updateOrderStatus: (id, status) => api.patch(`/marketplace/admin/orders/${id}/status`, { status }),

  // Skins
  getAdminSkins: (params) => api.get('/marketplace/admin/skins', { params }),
  createSkin: (data) => api.post('/marketplace/admin/skins', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateSkin: (id, data) => api.put(`/marketplace/admin/skins/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteSkin: (id) => api.delete(`/marketplace/admin/skins/${id}`),

  // Categories
  getAdminCategories: () => api.get('/marketplace/admin/categories'),
  createCategory: (data) => api.post('/marketplace/admin/categories', data),
  updateCategory: (id, data) => api.put(`/marketplace/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/marketplace/admin/categories/${id}`),

  // Cases
  getAdminCases: () => api.get('/marketplace/admin/cases'),
  createCase: (data) => api.post('/marketplace/admin/cases', data),
  updateCase: (id, data) => api.put(`/marketplace/admin/cases/${id}`, data),

  // Transactions & History
  getTransactions: (params) => api.get('/marketplace/admin/transactions', { params }),
  getCaseHistory: (params) => api.get('/marketplace/admin/case-history', { params }),
  getBattles: (params) => api.get('/marketplace/admin/battles', { params }),

  // Users (via auth-service)
  getUsers: (params) => api.get('/auth/admin/users', { params }),
  getUserById: (id) => api.get(`/auth/admin/users/${id}`),
};

export const notificationService = {
  getNotifications: (params) => api.get('/notification', { params }),
  markRead: (id) => api.patch(`/notification/${id}/read`),
  markAllRead: () => api.patch('/notification/read-all'),
};

export const caseService = {
  getCases: (params) => api.get('/marketplace/cases', { params }),
  getCaseBySlug: (slug) => api.get(`/marketplace/cases/${slug}`),
  getRecentDrops: (limit = 20) => api.get('/marketplace/cases/drops/recent', { params: { limit } }),
  openCase: (slug) => api.post(`/marketplace/cases/${slug}/open`),
};

export const walletService = {
  getBalance: () => api.get('/marketplace/wallet/balance'),
  getTransactions: (params) => api.get('/marketplace/wallet/transactions', { params }),
  createDeposit: (amount, method = 'CARD') => api.post('/marketplace/wallet/deposit', { amount, method }),
  confirmDeposit: (sessionId) => api.post('/marketplace/wallet/deposit/confirm', { sessionId }),
};

export const inventoryService = {
  getInventory: (params) => api.get('/marketplace/inventory', { params }),
  sellItem: (id) => api.post(`/marketplace/inventory/${id}/sell`),
  sellAll: () => api.post('/marketplace/inventory/sell-all'),
  withdraw: (itemIds) => api.post('/marketplace/inventory/withdraw', { itemIds }),
};

export const battleService = {
  list: (params) => api.get('/marketplace/battles', { params }),
  getById: (id) => api.get(`/marketplace/battles/${id}`),
  create: (data) => api.post('/marketplace/battles', data),
  join: (id, data) => api.post(`/marketplace/battles/${id}/join`, data),
  getHistory: (params) => api.get('/marketplace/battles/history', { params }),
  getRankings: (params) => api.get('/marketplace/battles/rankings', { params }),
  sendMessage: (id, message) => api.post(`/marketplace/battles/${id}/messages`, { message }),
};

export const tradeService = {
  create: (data) => api.post('/marketplace/trades', data),
  getIncoming: () => api.get('/marketplace/trades/incoming'),
  getOutgoing: () => api.get('/marketplace/trades/outgoing'),
  getHistory: (params) => api.get('/marketplace/trades/history', { params }),
  accept: (id) => api.post(`/marketplace/trades/${id}/accept`),
  decline: (id) => api.post(`/marketplace/trades/${id}/decline`),
  cancel: (id) => api.post(`/marketplace/trades/${id}/cancel`),
};

export const collectionService = {
  getAll: () => api.get('/marketplace/collections'),
  getBySlug: (slug) => api.get(`/marketplace/collections/${slug}`),
};
