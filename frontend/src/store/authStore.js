import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth.service';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authService.login(credentials);
          const authData = data?.data;
          const { user, accessToken, refreshToken } = authData || {};
          if (!user || !accessToken || !refreshToken) {
            throw new Error('Invalid auth response');
          }
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          set({ user, accessToken, refreshToken, isLoading: false });
          return { success: true };
        } catch (err) {
          const errors = err.response?.data?.errors;
          const validationMessage = Array.isArray(errors) ? errors.map((e) => e.message).join(', ') : null;
          const message = validationMessage || err.response?.data?.message || err.message || 'Нэвтрэхэд алдаа гарлаа';
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authService.register(userData);
          const authData = data?.data;
          const { user, accessToken, refreshToken } = authData || {};
          if (!user || !accessToken || !refreshToken) {
            throw new Error('Invalid auth response');
          }
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          set({ user, accessToken, refreshToken, isLoading: false });
          return { success: true };
        } catch (err) {
          const errors = err.response?.data?.errors;
          const validationMessage = Array.isArray(errors) ? errors.map((e) => e.message).join(', ') : null;
          const message = validationMessage || err.response?.data?.message || err.message || 'Бүртгэл үүсгэхэд алдаа гарлаа';
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      logout: async () => {
        const { refreshToken } = get();
        try {
          await authService.logout(refreshToken);
        } catch { /* ignore */ }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, accessToken: null, refreshToken: null });
      },

      updateProfile: async (data) => {
        set({ isLoading: true });
        try {
          const res = await authService.updateProfile(data);
          set({ user: res.data.data.user, isLoading: false });
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.response?.data?.message };
        }
      },

      isAuthenticated: () => !!get().accessToken,
      isAdmin: () => get().user?.role === 'Admin',
    }),
    {
      name: 'cs2-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

export default useAuthStore;
