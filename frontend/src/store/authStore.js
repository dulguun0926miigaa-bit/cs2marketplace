import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth.service';

const decodeTokenUser = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      email: payload.email,
      username: payload.username,
      role: payload.role,
    };
  } catch {
    return null;
  }
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      isHydrated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      setHydrated: () => set({ isHydrated: true }),

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authService.login(credentials);
          const authData = data?.data;
          const { user, accessToken, refreshToken } = authData || {};
          // If backend returned a response but it's missing required fields, surface the
          // actual server message instead of a generic "Invalid auth response"
          if (!user || !accessToken || !refreshToken) {
            const serverMsg = data?.message || 'Нэвтрэх мэдэгдэл буруу байна. Дахин оролдоно уу.';
            set({ error: serverMsg, isLoading: false });
            return { success: false, message: serverMsg };
          }
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          set({ user, accessToken, refreshToken, isLoading: false });
          return { success: true, user };
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
          // Same fix: surface server message instead of throwing a new error
          if (!user || !accessToken || !refreshToken) {
            const serverMsg = data?.message || 'Бүртгэлийн хариу буруу байна. Дахин оролдоно уу.';
            set({ error: serverMsg, isLoading: false });
            return { success: false, message: serverMsg };
          }
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          set({ user, accessToken, refreshToken, isLoading: false });
          return { success: true, user };
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
      isAdmin: () => typeof get().user?.role === 'string' && get().user.role.toLowerCase() === 'admin',
    }),
    {
      name: 'cs2-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (persistedState, error) => {
        const persisted = persistedState || {};
        const fallbackUser = persisted.accessToken && !persisted.user
          ? decodeTokenUser(persisted.accessToken)
          : null;

        useAuthStore.setState({
          isHydrated: true,
          user: persisted.user || fallbackUser || null,
          accessToken: persisted.accessToken || null,
          refreshToken: persisted.refreshToken || null,
          isAuthenticated: () => !!useAuthStore.getState().accessToken,
          isAdmin: () => typeof useAuthStore.getState().user?.role === 'string' && useAuthStore.getState().user.role.toLowerCase() === 'admin',
        });
      },
    }
  )
);

if (typeof window !== 'undefined') {
  const persistedKey = 'zustand/cs2-auth';
  const hasPersistedAuth = window.localStorage.getItem(persistedKey) !== null;
  if (!hasPersistedAuth) {
    useAuthStore.setState({ isHydrated: true });
  }
}

// Listen for token refresh / logout events dispatched by the API interceptor
// This avoids a circular import between api.js ↔ authStore.js
if (typeof window !== 'undefined') {
  window.addEventListener('auth:token-refreshed', (e) => {
    const { accessToken, refreshToken } = e.detail;
    const decodedUser = decodeTokenUser(accessToken);
    useAuthStore.setState({
      user: decodedUser || useAuthStore.getState().user,
      accessToken,
      refreshToken,
    });
  });
  window.addEventListener('auth:logout', () => {
    useAuthStore.setState({ user: null, accessToken: null, refreshToken: null });
  });
}

export default useAuthStore;
