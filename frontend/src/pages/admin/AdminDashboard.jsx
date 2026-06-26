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

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminService.getDashboard(),
      adminService.getUserStats(),
    ])
      .then(([dashRes, userRes]) => {
        setStats(dashRes.data.data);
        setUserStats(userRes.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner size="lg" className="py-40" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS(stats).map((s) => (
          <div key={s.label} className="loot-card p-5 text-center">
            <p className="text-3xl mb-1">{s.icon}</p>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-loot-muted text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Extra stats row */}
      {userStats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="loot-card p-4 text-center">
            <p className="text-xl font-bold">{userStats.totalWallets || 0}</p>
            <p className="text-loot-muted text-xs mt-1">Нийт хэтэвч</p>
          </div>
          <div className="loot-card p-4 text-center">
            <p className="text-xl font-bold text-loot-cyan">{userStats.totalCaseOpens || 0}</p>
            <p className="text-loot-muted text-xs mt-1">Нийт кейс нээлт</p>
          </div>
          <div className="loot-card p-4 text-center">
            <p className="text-xl font-bold text-purple-400">{userStats.totalOrders || 0}</p>
            <p className="text-loot-muted text-xs mt-1">Нийт захиалга</p>
          </div>
        </div>
      )}

      {/* Quick Nav */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { to: '/admin/skins', icon: '🔫', label: 'Skin удирдах' },
          { to: '/admin/orders', icon: '📦', label: 'Захиалга удирдах' },
          { to: '/admin/users', icon: '👥', label: 'Хэрэглэгч удирдах' },
          { to: '/admin/cases', icon: '🎁', label: 'Кейс удирдах' },
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">Сүүлийн захиалгууд</h2>
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
