import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cs2-api-gateway.onrender.com/api',
  timeout: 15000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Let the browser set multipart boundaries for FormData requests.
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

// Handle 401 – attempt silent token refresh
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const authPath = original?.url || '';
    const shouldSkipRefresh =
      authPath.includes('/auth/login') ||
      authPath.includes('/auth/register') ||
      authPath.includes('/auth/refresh') ||
      authPath.includes('/auth/forgot-password') ||
      authPath.includes('/auth/reset-password');

    if (error.response?.status === 401 && !original?._retry && !shouldSkipRefresh) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post('/api/auth/refresh', { refreshToken });
        const newAccess  = data.data.accessToken;
        const newRefresh = data.data.refreshToken;

        // Persist new tokens
        localStorage.setItem('accessToken',  newAccess);
        localStorage.setItem('refreshToken', newRefresh);

        // Notify the Zustand auth store without a circular import —
        // the store subscribes to this custom event in authStore.js
        window.dispatchEvent(new CustomEvent('auth:token-refreshed', {
          detail: { accessToken: newAccess, refreshToken: newRefresh },
        }));

        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.dispatchEvent(new CustomEvent('auth:logout'));
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
