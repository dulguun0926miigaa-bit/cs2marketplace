import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import useWalletStore from '../../store/walletStore';
import { CartButton } from '../cart/CartDrawer';

// Small Steam logo that links to Steam store
function SteamBadge() {
  return (
    <a
      href="https://store.steampowered.com"
      target="_blank"
      rel="noopener noreferrer"
      title="Steam дэлгүүр"
      className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
    >
      <svg width="18" height="18" viewBox="0 0 196 196" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="98" cy="98" r="98" fill="#1b2838"/>
        <path d="M98 30C60.3 30 30 60.3 30 98c0 30.7 19.8 56.9 47.5 66.3l17.1-70.7c-.4-1.1-.6-2.3-.6-3.6 0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10c-.1 0-.3 0-.4 0l-16.8 69.5c.7.1 1.5.1 2.2.1 37.7 0 68-30.3 68-68S135.7 30 98 30z" fill="white"/>
        <circle cx="98" cy="90" r="10" fill="#1b2838"/>
      </svg>
      <span className="text-[10px] text-gray-400 hidden sm:block">Steam</span>
    </a>
  );
}

export default function TopNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const authPages = ['/login', '/register', '/forgot-password', '/steam/callback'];
  const hideNavbar = authPages.includes(location.pathname);
  const isAuthenticated = useAuthStore((state) => Boolean(state.accessToken));
  const isAdmin = useAuthStore((state) => state.user?.role?.toLowerCase() === 'admin');
  const logout = useAuthStore((state) => state.logout);
  const balance = useWalletStore((state) => state.balance);
  const fetchBalance = useWalletStore((state) => state.fetchBalance);

  useEffect(() => {
    if (isAuthenticated) fetchBalance();
  }, [isAuthenticated, fetchBalance]);

  if (hideNavbar) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-loot-bg border-b border-loot-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-loot-card border border-loot-border flex items-center justify-center">
            <svg className="w-4 h-4 text-loot-gold" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.2l6 3.75V16.3l-6 3.75-6-3.75V7.95L12 4.2z" />
            </svg>
          </div>
          <span className="font-bold text-base tracking-tight hidden sm:block">CS2 Дэлгүүр</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          <Link to="/" className="text-sm font-medium text-white hover:text-yellow-400 transition-colors">НҮҮР</Link>
          <Link to="/cases" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">КЕЙС</Link>
          <Link to="/marketplace" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">ДЭЛГҮҮР</Link>
          <Link to="/faq" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">FAQ</Link>
          {isAuthenticated && isAdmin && (
            <Link to="/admin" className="text-sm font-medium text-cs2-accent hover:text-white transition-colors">Admin</Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          <SteamBadge />
          <CartButton />

          {isAuthenticated ? (
            <>
              <Link
                to="/deposit"
                className="flex items-center gap-1.5 bg-loot-card border border-loot-border rounded-full px-3 py-1.5 hover:border-yellow-400/60 transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                </svg>
                <span className="font-bold text-sm text-yellow-400">${parseFloat(balance || 0).toFixed(2)}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1.5 rounded-full bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            location.pathname !== '/login' && location.pathname !== '/register' && (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-2">Нэвтрэх</Link>
                <Link to="/register" className="btn-loot-primary text-xs py-1.5 px-3">Бүртгүүлэх</Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
