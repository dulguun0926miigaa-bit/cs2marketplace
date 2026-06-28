import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import useWalletStore from '../../store/walletStore';
import { useEffect } from 'react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuthStore();
  const { count } = useCartStore();
  const { balance, fetchBalance } = useWalletStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) fetchBalance();
  }, [isAuthenticated()]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-cs2-card border-b border-cs2-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-cs2-accent font-bold text-xl">CS2</span>
            <span className="text-white font-semibold">Дэлгүүр</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/marketplace" className="text-gray-300 hover:text-white transition-colors">Дэлгүүр</Link>
            {isAuthenticated() && (
              <>
                <Link to="/wishlist" className="text-gray-300 hover:text-white transition-colors">Wishlist</Link>
                <Link to="/orders" className="text-gray-300 hover:text-white transition-colors">Orders</Link>
                <Link to="/trades" className="text-gray-300 hover:text-white transition-colors">Trades</Link>
              </>
            )}
            {isAdmin() && (
              <Link to="/admin" className="text-cs2-accent hover:text-cs2-accent-hover transition-colors font-medium">Admin</Link>
            )}
            {isAuthenticated() && (
              <button onClick={handleLogout} className="text-gray-300 hover:text-white transition-colors">Logout</button>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated() && (
              <Link
                to="/deposit"
                className="hidden sm:flex items-center gap-2 bg-cs2-darker border border-cs2-border rounded-full px-3 py-1 hover:border-yellow-400/60 transition-colors"
              >
                <span className="text-yellow-400 text-sm font-semibold">${parseFloat(balance || 0).toFixed(2)}</span>
              </Link>
            )}
            {isAuthenticated() ? (
              <>
                <Link to="/cart" className="relative p-2 text-gray-300 hover:text-white text-2xl">
                  🛒
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-cs2-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {count > 9 ? '9+' : count}
                    </span>
                  )}
                </Link>
                <Link to="/notifications" className="p-2 text-gray-300 hover:text-white text-2xl">
                  🔔
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded-full bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors text-sm"
                >
                  Logout
                </button>
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 text-gray-300 hover:text-white">
                    <span className="text-2xl">👤</span>
                    <span className="hidden md:block text-sm">{user?.username}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-cs2-card border border-cs2-border rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-cs2-border rounded-t-lg">Профайл</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-cs2-red hover:bg-cs2-border rounded-b-lg">Гарах</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm">Нэвтрэх</Link>
                <Link to="/register" className="btn-primary text-sm">Бүртгүүлэх</Link>
              </>
            )}
            {/* Mobile menu */}
            <button className="md:hidden p-2 text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-cs2-border bg-cs2-card px-4 py-3 flex flex-col gap-3">
          <Link to="/marketplace" className="text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Дэлгүүр</Link>
          {isAuthenticated() && (
            <>
              <Link to="/wishlist" className="text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Wishlist</Link>
              <Link to="/orders" className="text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Orders</Link>
              <Link to="/cart" className="text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Сагс ({count})</Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="text-left text-gray-300 hover:text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
