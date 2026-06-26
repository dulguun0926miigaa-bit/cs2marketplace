import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import useWalletStore from '../../store/walletStore';
import { CartButton } from '../cart/CartDrawer';
export default function TopNavbar() {
  const { isAuthenticated } = useAuthStore();
  const { balance, fetchBalance } = useWalletStore();

  useEffect(() => {
    if (isAuthenticated()) fetchBalance();
  }, []);

  return (
    <nav className="bg-loot-bg border-b border-loot-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-loot-card border border-loot-border flex items-center justify-center">
            <svg className="w-4 h-4 text-loot-gold" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.2l6 3.75V16.3l-6 3.75-6-3.75V7.95L12 4.2z" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">Дөк, Ами, Чочироо 3ийн дэлгүүр</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-white hover:text-loot-accent transition-colors">НҮҮР</Link>
          <Link to="/marketplace" className="text-sm font-medium text-loot-muted hover:text-white transition-colors">ДЭЛГҮҮР</Link>
          <Link to="/faq" className="text-sm font-medium text-loot-muted hover:text-white transition-colors">FAQ</Link>
        </div>

        <div className="flex items-center gap-3">
          <CartButton />
          {isAuthenticated() ? (
            <Link
              to="/deposit"
              className="flex items-center gap-2 bg-loot-card border border-loot-border rounded-full px-4 py-1.5 hover:border-yellow-400/60 transition-colors"
            >
              <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
              </svg>
              <span className="font-semibold text-sm text-yellow-400">${parseFloat(balance || 0).toFixed(2)}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm text-loot-muted hover:text-white transition-colors">Нэвтрэх</Link>
              <Link to="/register" className="btn-loot-primary text-sm py-2 px-4">Бүртгүүлэх</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
