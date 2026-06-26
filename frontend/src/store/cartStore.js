import { create } from 'zustand';
import { cartService } from '../services/marketplace.service';

const useCartStore = create((set, get) => ({
  items: [],
  total: '0.00',
  count: 0,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await cartService.getCart();
      set({ items: data.data.items, total: data.data.total, count: data.data.count, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (skinId, quantity = 1) => {
    try {
      await cartService.addItem(skinId, quantity);
      await get().fetchCart();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  },

  updateItem: async (skinId, quantity) => {
    try {
      await cartService.updateItem(skinId, quantity);
      await get().fetchCart();
    } catch { /* ignore */ }
  },

  removeItem: async (skinId) => {
    try {
      await cartService.removeItem(skinId);
      await get().fetchCart();
    } catch { /* ignore */ }
  },

  clearCart: async () => {
    try {
      await cartService.clearCart();
      set({ items: [], total: '0.00', count: 0 });
    } catch { /* ignore */ }
  },
}));

export default useCartStore;
