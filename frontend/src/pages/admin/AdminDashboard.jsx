import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/marketplace.service';
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

  const safeStats = stats;
  const safeUserStats = userStats;

  useEffect(() => {
    Promise.all([
      adminService.getDashboard(),
      adminService.getUserStats(),
      adminService.getUsers({ page: 1, limit: 5 }),
      adminService.getTransactions({ page: 1, limit: 5 }),
    ])
      .then(([dashRes, userRes, usersRes, txRes]) => {
        setStats(dashRes.data.data);
        setUserStats(userRes.data.data);
        setRecentUsers(usersRes.data?.data || []);
        setRecentTransactions(txRes.data?.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
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
          { to: '/admin/orders', icon: '📦', label: 'Захиалга удирдах' },
          { to: '/admin/users', icon: '👥', label: 'Хэрэглэгч удирдах' },
          { to: '/admin/transactions', icon: '💳', label: 'Транзакц' },
          { to: '/admin/case-history', icon: '🕘', label: 'Кейс нээлт' },
          { to: '/admin/battles', icon: '⚔️', label: 'Battles' },
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

      {/* Recent Orders Table */}
      <div className="loot-card p-5 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
          <div>
            <h2 className="font-bold">Сүүлийн захиалгууд</h2>
            <p className="text-loot-muted text-xs">Хамгийн сүүлд орсон захиалгууд</p>
          </div>
          <Link to="/admin/orders" className="text-xs text-loot-muted hover:text-white">Бүгдийг харах →</Link>
        </div>
        {!stats?.recentOrders?.length ? (
          <p className="text-loot-muted text-sm py-4 text-center">Захиалга байхгүй</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-loot-muted border-b border-loot-border text-xs uppercase">
                  <th className="pb-2 pr-4">ID</th>
                  <th className="pb-2 pr-4">Нийт</th>
                  <th className="pb-2 pr-4">Төлөв</th>
                  <th className="pb-2">Огноо</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((o) => (
                  <tr key={o.id} className="border-b border-loot-border/50 hover:bg-loot-surface transition-colors">
                    <td className="py-2 pr-4 text-loot-muted">#{o.id}</td>
                    <td className="py-2 pr-4 text-loot-gold font-bold">${parseFloat(o.totalAmount).toFixed(2)}</td>
                    <td className={`py-2 pr-4 font-medium ${STATUS_COLORS[o.status]}`}>{o.status}</td>
                    <td className="py-2 text-loot-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="loot-card p-5 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
          <div>
            <h2 className="font-bold">Сүүлийн кейс нээлтүүд</h2>
            <p className="text-loot-muted text-xs">Өнгөрсөн хамгийн сүүлд нээгдсэн кейсүүд</p>
          </div>
          <Link to="/admin/case-history" className="text-xs text-loot-muted hover:text-white">Бүгдийг харах →</Link>
        </div>
        {!stats?.recentCaseOpens?.length ? (
          <p className="text-loot-muted text-sm py-4 text-center">Кейс нээлт байхгүй</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-loot-muted border-b border-loot-border text-xs uppercase">
                  <th className="pb-2 pr-4">ID</th>
                  <th className="pb-2 pr-4">Хэрэглэгч</th>
                  <th className="pb-2 pr-4">Кейс</th>
                  <th className="pb-2 pr-4">Skin</th>
                  <th className="pb-2">Огноо</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentCaseOpens?.map((item) => (
                  <tr key={item.id} className="border-b border-loot-border/50 hover:bg-loot-surface transition-colors">
                    <td className="py-2 pr-4 text-loot-muted">#{item.id}</td>
                    <td className="py-2 pr-4 text-loot-muted">#{item.userId}</td>
                    <td className="py-2 pr-4 font-medium">{item.case?.name || '—'}</td>
                    <td className="py-2 pr-4 text-loot-muted">{item.skin?.name || '—'}</td>
                    <td className="py-2 text-loot-muted">{new Date(item.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
