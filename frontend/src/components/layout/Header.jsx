import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useWalletStore from '../../store/walletStore';
import { useEffect } from 'react';

export default function Header({ showBack = false, backTo = '/' }) {
  const { isAuthenticated } = useAuthStore();
  const { balance, fetchBalance } = useWalletStore();

  useEffect(() => {
    if (isAuthenticated()) fetchBalance();
  }, [isAuthenticated()]);

  return (
    <header className="sticky top-0 z-40 bg-loot-bg/95 backdrop-blur-sm border-b border-loot-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <Link to={backTo} className="text-loot-muted hover:text-white transition-colors p-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-loot-card border border-loot-border flex items-center justify-center">
              <svg className="w-4 h-4 text-loot-gold" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.2l6 3.75V16.3l-6 3.75-6-3.75V7.95L12 4.2z" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">CS2 SKINS</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated() ? (
            <Link
              to="/deposit"
              className="flex items-center gap-2 bg-loot-card border border-loot-border rounded-full px-4 py-1.5 hover:border-yellow-400/60 transition-colors"
            >
              <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-1.92-2.48-.34-4.3-1.36-4.3-3.87 0-1.83 1.39-2.84 3.11-3.21V4h2.67v1.95c1.4.31 2.47 1.14 2.63 2.79h-1.96c-.09-1.05-.68-1.75-2.08-1.75-1.55 0-2.2.75-2.2 1.53 0 .84.65 1.36 2.67 1.64 2.48.33 4.3 1.36 4.3 3.89 0 1.96-1.47 2.96-3.12 3.29z" />
              </svg>
              <span className="font-semibold text-sm text-yellow-400">${parseFloat(balance || 0).toFixed(2)}</span>
            </Link>
          ) : (
            <Link to="/login" className="text-sm text-loot-muted hover:text-white transition-colors">
              Нэвтрэх
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
