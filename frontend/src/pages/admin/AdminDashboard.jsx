import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService, caseService, skinService } from '../../services/marketplace.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const STATUS_COLORS = {
  PENDING: 'text-yellow-400', PROCESSING: 'text-blue-400',
  COMPLETED: 'text-green-400', CANCELLED: 'text-red-400', REFUNDED: 'text-loot-muted',
};

const STAT_CARDS = (stats) => [
  { label: 'Нийт орлого', value: `$${parseFloat(stats?.totalRevenue || 0).toFixed(2)}`, icon: '💰', color: 'text-loot-gold' },
  { label: 'Биелсэн захиалга', value: stats?.completedOrders || 0, icon: '✅', color: 'text-green-400' },
  { label: 'Нийт захиалга', value: stats?.totalOrders || 0, icon: '📦', color: 'text-blue-400' },
  { label: 'Нийт skin', value: stats?.totalSkins || 0, icon: '🔫', color: 'text-purple-400' },
];
const EXTRA_STATS = (stats) => [
  { label: 'Нийт кейс', value: stats?.totalCases || 0, icon: '🎁', color: 'text-yellow-400' },
  { label: 'Нийт Wallet', value: stats?.totalWallets || 0, icon: '👛', color: 'text-cyan-400' },
  { label: 'Нийт транзакц', value: stats?.totalTransactions || 0, icon: '💳', color: 'text-blue-300' },
  { label: 'Нийт inventory', value: stats?.totalInventoryItems || 0, icon: '🎒', color: 'text-pink-400' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    completedOrders: 0,
    totalOrders: 0,
    totalSkins: 0,
    totalCases: 0,
    totalWallets: 0,
    totalTransactions: 0,
    totalInventoryItems: 0,
    totalCaseOpenings: 0,
    recentOrders: [],
    recentCaseOpens: [],
  });
  const [userStats, setUserStats] = useState({
    totalWallets: 0,
    totalCaseOpens: 0,
    totalOrders: 0,
    topSpenders: [],
  });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentSkins, setRecentSkins] = useState([]);
  const [recentCases, setRecentCases] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);

  const safeStats = stats;
  const safeUserStats = userStats;

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [dashRes, userRes, usersRes, txRes, skinsRes, casesRes, notificationsRes] = await Promise.all([
          adminService.getDashboard(),
          adminService.getUserStats(),
          adminService.getUsers({ page: 1, limit: 5 }),
          adminService.getTransactions({ page: 1, limit: 5 }),
          adminService.getAdminSkins({ page: 1, limit: 5, search: '' }),
          adminService.getAdminCases(),
          adminService.getNotifications({ page: 1, limit: 5 }),
        ]);

        const dashboardData = dashRes?.data?.data || {};
        const userStatsData = userRes?.data?.data || {};
        const usersData = usersRes?.data?.data || [];
        const transactionsData = txRes?.data?.data || [];
        const notificationData = notificationsRes?.data?.data || [];
        const adminSkinsData = Array.isArray(skinsRes?.data?.data)
          ? skinsRes.data.data
          : Array.isArray(skinsRes?.data?.data?.skins)
          ? skinsRes.data.data.skins
          : [];
        const adminCasesData = casesRes?.data?.data?.cases || casesRes?.data?.data || [];

        let finalSkins = adminSkinsData;
        if (!finalSkins.length) {
          try {
            const fallbackSkins = await skinService.getAll({ page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' });
            finalSkins = fallbackSkins.data?.data?.skins || [];
          } catch (err) {
            finalSkins = [];
          }
        }

        let finalCases = adminCasesData;
        if (!finalCases.length) {
          try {
            const fallbackCases = await caseService.getCases({ page: 1, limit: 5 });
            finalCases = fallbackCases.data?.data?.cases || [];
          } catch (err) {
            finalCases = [];
          }
        }

        setStats(dashboardData);
        setUserStats(userStatsData);
        setRecentUsers(usersData);
        setRecentTransactions(transactionsData);
        setRecentSkins(finalSkins);
        setRecentCases(finalCases);
        setRecentNotifications(notificationData);
      } catch (err) {
        console.error('Admin dashboard load failed', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) return <LoadingSpinner size="lg" className="py-40" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="loot-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-loot-muted">Revenue</div>
            <div className="text-sm font-semibold text-loot-gold">${parseFloat(safeStats.totalRevenue).toFixed(2)}</div>
          </div>
          <svg viewBox="0 0 100 30" className="w-full h-12">
            <rect x="0" y="0" width="100" height="30" fill="rgba(255,255,255,0.03)" />
            <rect x="0" y="5" width={`${Math.min(100, (safeStats.totalRevenue) / Math.max(1, safeStats.totalRevenue) * 100)}`} height="20" fill="#FBBF24" />
          </svg>
        </div>

        <div className="loot-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-loot-muted">Orders</div>
            <div className="text-sm font-semibold text-blue-400">{safeStats.totalOrders || 0}</div>
          </div>
          <svg viewBox="0 0 100 30" className="w-full h-12">
            <rect x="0" y="0" width="100" height="30" fill="rgba(255,255,255,0.03)" />
            <rect x="0" y="5" width={`${Math.min(100, (safeStats.totalOrders) / Math.max(1, safeStats.totalOrders) * 100)}`} height="20" fill="#60A5FA" />
          </svg>
        </div>

        <div className="loot-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-loot-muted">Case Opens</div>
            <div className="text-sm font-semibold text-cs2-accent">{safeStats.totalCaseOpenings || 0}</div>
          </div>
          <svg viewBox="0 0 100 30" className="w-full h-12">
            <rect x="0" y="0" width="100" height="30" fill="rgba(255,255,255,0.03)" />
            <rect x="0" y="5" width={`${Math.min(100, (safeStats.totalCaseOpenings) / Math.max(1, safeStats.totalCaseOpenings) * 100)}`} height="20" fill="#34D399" />
          </svg>
        </div>

        <div className="loot-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-loot-muted">User Growth</div>
            <div className="text-sm font-semibold">{safeStats.totalWallets || 0}</div>
          </div>
          <svg viewBox="0 0 100 30" className="w-full h-12">
            <rect x="0" y="0" width="100" height="30" fill="rgba(255,255,255,0.03)" />
            <polyline points="0,20 20,15 40,10 60,8 80,6 100,4" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS(safeStats).map((s) => (
          <div key={s.label} className="loot-card p-5 text-center">
            <p className="text-3xl mb-1">{s.icon}</p>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-loot-muted text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {EXTRA_STATS(safeStats).map((s) => (
          <div key={s.label} className="loot-card p-5 text-center">
            <p className="text-3xl mb-1">{s.icon}</p>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-loot-muted text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Extra stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="loot-card p-4 text-center">
          <p className="text-xl font-bold">{safeUserStats.totalWallets || 0}</p>
          <p className="text-loot-muted text-xs mt-1">Нийт хэтэвч</p>
        </div>
        <div className="loot-card p-4 text-center">
          <p className="text-xl font-bold text-loot-cyan">{safeUserStats.totalCaseOpens || 0}</p>
          <p className="text-loot-muted text-xs mt-1">Нийт кейс нээлт</p>
        </div>
        <div className="loot-card p-4 text-center">
          <p className="text-xl font-bold text-purple-400">{safeUserStats.totalOrders || 0}</p>
          <p className="text-loot-muted text-xs mt-1">Нийт захиалга</p>
        </div>
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { to: '/admin/skins', icon: '🔫', label: 'Skin удирдах' },
          { to: '/admin/cases', icon: '🎁', label: 'Кейс удирдах' },
          { to: '/admin/users', icon: '👥', label: 'Хэрэглэгч удирдах' },
          { to: '/admin/notifications', icon: '🔔', label: 'Notifications' },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="loot-card p-4 text-center hover:border-white transition-colors"
          >
            <p className="text-3xl mb-2">{item.icon}</p>
            <p className="font-semibold text-sm">{item.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="loot-card p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-bold">Сүүлийн Skin-үүд</h2>
              <p className="text-loot-muted text-xs">Сүүлийн нэмэгдсэн эсвэл шинэчлэгдсэн skins</p>
            </div>
            <Link to="/admin/skins" className="text-xs text-loot-muted hover:text-white">Бүгдийг харах →</Link>
          </div>
          {!recentSkins.length ? (
            <p className="text-loot-muted text-sm py-4 text-center">Skin байхгүй</p>
          ) : (
            <div className="space-y-3">
              {recentSkins.map((skin) => (
                <div key={skin.id} className="flex items-center gap-3">
                  <div className="w-14 h-10 rounded overflow-hidden bg-loot-surface">
                    {skin.images?.[0] ? <img src={skin.images[0]} alt={skin.name} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold truncate">{skin.name}</p>
                    <p className="text-xs text-loot-muted">{skin.weapon} · ${parseFloat(skin.price).toFixed(2)}</p>
                  </div>
                  <span className="text-xs text-loot-muted">#{skin.id}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="loot-card p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-bold">Сүүлийн Кейсүүд</h2>
              <p className="text-loot-muted text-xs">Сүүлийн нэмэгдсэн кейсүүд</p>
            </div>
            <Link to="/admin/cases" className="text-xs text-loot-muted hover:text-white">Бүгдийг харах →</Link>
          </div>
          {!recentCases.length ? (
            <p className="text-loot-muted text-sm py-4 text-center">Кейс байхгүй</p>
          ) : (
            <div className="space-y-3">
              {recentCases.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="w-14 h-10 rounded overflow-hidden bg-loot-surface">
                    {c.imageUrl ? <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold truncate">{c.name}</p>
                    <p className="text-xs text-loot-muted">${parseFloat(c.price).toFixed(2)} · {c.isFeatured ? 'Featured' : 'Standard'}</p>
                  </div>
                  <span className="text-xs text-loot-muted">#{c.id}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="loot-card p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-bold">Сүүлийн хэрэглэгчид</h2>
              <p className="text-loot-muted text-xs">Хэдхэн минутын өмнөх бүртгэлүүд</p>
            </div>
            <Link to="/admin/users" className="text-xs text-loot-muted hover:text-white">Бүгдийг харах →</Link>
          </div>
          {!recentUsers.length ? (
            <p className="text-loot-muted text-sm py-4 text-center">Хэрэглэгч байхгүй</p>
          ) : (
            <div className="space-y-2 text-sm">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex justify-between items-center">
                  <div className="truncate">{u.username} <span className="text-loot-muted text-xs">{u.email}</span></div>
                  <div className="text-loot-muted text-xs">{new Date(u.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="loot-card p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-bold">Сүүлийн Notifications</h2>
              <p className="text-loot-muted text-xs">Сүүлд илгээгдсэн мэдэгдлүүд</p>
            </div>
            <Link to="/admin/notifications" className="text-xs text-loot-muted hover:text-white">Бүгдийг харах →</Link>
          </div>
          {!recentNotifications.length ? (
            <p className="text-loot-muted text-sm py-4 text-center">Notification байхгүй</p>
          ) : (
            <div className="space-y-2 text-sm">
              {recentNotifications.map((n) => (
                <div key={n.id} className="flex justify-between items-center">
                  <div className="truncate"><span className="font-semibold">{n.title}</span> - {n.message}</div>
                  <div className="text-loot-muted text-xs">{new Date(n.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Users & Transactions */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="loot-card p-4">
          <h3 className="font-bold mb-3">Recent Users</h3>
          {recentUsers.length === 0 ? (
            <p className="text-loot-muted">No users</p>
          ) : (
            <div className="space-y-2 text-sm">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex justify-between items-center">
                  <div className="truncate">{u.username} <span className="text-loot-muted text-xs">{u.email}</span></div>
                  <div className="text-loot-muted text-xs">{new Date(u.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="loot-card p-4">
          <h3 className="font-bold mb-3">Recent Transactions</h3>
          {recentTransactions.length === 0 ? (
            <p className="text-loot-muted">No transactions</p>
          ) : (
            <div className="space-y-2 text-sm">
              {recentTransactions.map((t) => (
                <div key={t.id} className="flex justify-between items-center">
                  <div className="truncate">{t.type} — ${parseFloat(t.amount || 0).toFixed(2)}</div>
                  <div className="text-loot-muted text-xs">{new Date(t.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Spenders */}
      {userStats?.topSpenders?.length > 0 && (
        <div className="loot-card p-5">
          <h2 className="font-bold mb-4">Хамгийн их зарцуулагчид</h2>
          <div className="space-y-2">
            {userStats.topSpenders.map((s, i) => (
              <div key={s.userId} className="flex justify-between items-center text-sm">
                <span className="text-loot-muted">#{i + 1} User {s.userId}</span>
                <span className="text-loot-gold font-bold">${parseFloat(s.balance).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
