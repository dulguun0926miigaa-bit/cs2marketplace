import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import TopNavbar from '../components/layout/TopNavbar';
import BottomNav from '../components/layout/BottomNav';
import useAuthStore from '../store/authStore';

const STANDALONE_PATHS = ['/', '/inventory', '/battles', '/deposit', '/faq', '/cases'];

export default function MainLayout() {
  const location = useLocation();
  const isStandalone = STANDALONE_PATHS.includes(location.pathname)
    || location.pathname.startsWith('/cases/')
    || location.pathname.startsWith('/battles/');

  if (isStandalone) {
    return <Outlet />;
  }

  // Admin pages get minimal layout (no bottom nav)
  const isAdmin = location.pathname.startsWith('/admin');
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleAdminLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-loot-bg">
        <nav className="bg-loot-card border-b border-loot-border px-4 h-12 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <a href="/" className="text-loot-gold font-bold text-sm">← Нүүр</a>
            <span className="text-loot-muted text-xs">|</span>
            <span className="text-sm font-medium">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-loot-muted overflow-x-auto">
            <a href="/admin" className="hover:text-white">Dashboard</a>
            <a href="/admin/skins" className="hover:text-white">Skins</a>
            <a href="/admin/cases" className="hover:text-white">Cases</a>
            <a href="/admin/orders" className="hover:text-white">Orders</a>
            <a href="/admin/transactions" className="hover:text-white">Transactions</a>
            <a href="/admin/case-history" className="hover:text-white">Case History</a>
            <a href="/admin/battles" className="hover:text-white">Battles</a>
            <a href="/admin/users" className="hover:text-white">Users</a>
            <a href="/admin/notifications" className="hover:text-white">Notifications</a>
            <button onClick={handleAdminLogout} className="text-red-400 hover:text-red-200 text-xs">Logout</button>
          </div>
        </nav>
        <main><Outlet /></main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-loot-bg">
      <TopNavbar />
      <main>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
