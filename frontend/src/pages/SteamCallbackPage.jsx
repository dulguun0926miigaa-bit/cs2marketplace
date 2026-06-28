import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function SteamCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    const accessToken  = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      // Store tokens directly — same as normal login
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Decode user info from JWT payload (base64)
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        useAuthStore.setState({
          user:         { id: payload.id, email: payload.email, username: payload.username, role: payload.role },
          accessToken,
          refreshToken,
        });
      } catch { /* ignore decode error */ }

      navigate('/', { replace: true });
    } else {
      const err = params.get('error') || 'steam_failed';
      navigate(`/login?error=${err}`, { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e14]">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Steam нэвтрэлтийг боловсруулж байна...</p>
      </div>
    </div>
  );
}
