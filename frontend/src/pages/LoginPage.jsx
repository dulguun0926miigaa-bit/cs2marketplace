import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import SteamConnectButton from '../components/common/SteamConnectButton';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import useWalletStore from '../store/walletStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const steamError = params.get('error');
  const login = useAuthStore((state) => state.login);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const fetchBalance = useWalletStore((state) => state.fetchBalance);
  const isAuthenticated = useAuthStore((state) => Boolean(state.accessToken));
  const isAdmin = useAuthStore((state) => state.user?.role?.toLowerCase() === 'admin');
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const user = useAuthStore((state) => state.user);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState(null);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated || !user) return;
    navigate(isAdmin ? '/admin' : '/', { replace: true });
  }, [isAuthenticated, isAdmin, isHydrated, navigate, user]);

  const handleAdminLogin = async () => {
    setAdminLoading(true);
    setAdminError(null);

    const result = await login({ email: 'admin@cs2market.com', password: 'Admin@12345' });
    if (!result.success) {
      setAdminError(result.message || 'Админ нэвтрэх амжилтгүй боллоо');
      setAdminLoading(false);
      return;
    }

    await fetchCart().catch(() => {});
    await fetchBalance().catch(() => {});
    navigate('/admin', { replace: true });
  };

  const handleSuccess = (user) => {
    navigate(user?.role?.toLowerCase() === 'admin' ? '/admin' : '/', { replace: true });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-white mb-1">Нэвтрэх</h1>
          <p className="text-gray-500 text-sm">CS2 Дэлгүүрт тавтай морил</p>
        </div>

        {/* Steam login — primary CTA */}
        <div className="mb-4">
          <SteamConnectButton className="w-full py-3 text-base" label="Steam-ээр нэвтрэх" />
          {steamError && (
            <p className="text-red-400 text-xs text-center mt-2">
              Steam нэвтрэлт амжилтгүй болсон. Дахин оролдно уу.
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-[#1e2530]" />
          <span className="text-[11px] uppercase tracking-widest text-gray-600">эсвэл имэйлээр</span>
          <div className="h-px flex-1 bg-[#1e2530]" />
        </div>

        <div className="space-y-4 mb-4">
          <button
            onClick={handleAdminLogin}
            disabled={adminLoading}
            className="w-full py-3 rounded-2xl border border-yellow-500 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20 transition-colors"
          >
            {adminLoading ? 'Админ руу нэвтэрч байна...' : 'Админээр шууд нэвтрэх'}
          </button>
          {adminError && <p className="text-red-400 text-xs text-center">{adminError}</p>}
        </div>

        <div className="bg-[#141921] border border-[#1e2530] rounded-2xl p-6">
          <LoginForm onSuccess={handleSuccess} onSwitchRegister={() => navigate('/register')} />
        </div>
      </div>
    </div>
  );
}
