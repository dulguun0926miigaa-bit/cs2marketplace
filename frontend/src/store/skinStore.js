import { create } from 'zustand';
import { skinService, categoryService } from '../services/marketplace.service';

const useSkinStore = create((set) => ({
  skins: [],
  pagination: null,
  categories: [],
  popularSkins: [],
  latestSkins: [],
  selectedSkin: null,
  isLoading: false,
  error: null,

  fetchSkins: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await skinService.getAll(params);
      // paginated() returns { data: [...], pagination: {...} } at top level
      const skins = Array.isArray(data.data) ? data.data : (data.data?.skins || []);
      set({ skins, pagination: data.pagination, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchSkinById: async (id) => {
    set({ isLoading: true });
    try {
      const { data } = await skinService.getById(id);
      set({ selectedSkin: data.data.skin, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchPopular: async () => {
    try {
      const { data } = await skinService.getPopular();
      set({ popularSkins: data.data.skins });
    } catch { /* ignore */ }
  },

  fetchLatest: async () => {
    try {
      const { data } = await skinService.getLatest();
      set({ latestSkins: data.data.skins });
    } catch { /* ignore */ }
  },

  fetchCategories: async () => {
    try {
      const { data } = await categoryService.getAll();
      set({ categories: data.data.categories });
    } catch { /* ignore */ }
  },
}));

export default useSkinStore;
