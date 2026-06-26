import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 – attempt token refresh for protected requests only
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
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
