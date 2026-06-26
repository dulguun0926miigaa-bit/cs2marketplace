import { useEffect, useState } from 'react';
import { adminService } from '../../services/marketplace.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async (p = 1, q = '') => {
    setLoading(true);
    try {
      const { data } = await adminService.getUsers({ page: p, limit: 20, search: q });
      setUsers(data.data);
      setPagination(data.pagination);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(page, search); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load(1, search);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Хэрэглэгч Удирдах</h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-loot-muted" />
          <input
            className="loot-input pl-10"
            placeholder="Имэйл эсвэл нэвтрэх нэрээр хайх..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-loot-primary text-sm">Хайх</button>
      </form>

      {loading ? <LoadingSpinner size="lg" className="py-20" /> : (
        <>
          <div className="loot-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-loot-muted border-b border-loot-border text-xs uppercase">
                  {['ID', 'Нэвтрэх нэр', 'Имэйл', 'Нэр', 'Эрх', 'Идэвхтэй', 'Баталгаажсан', 'Огноо'].map((h) => (
                    <th key={h} className="pb-3 pr-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-loot-border/40 hover:bg-loot-surface transition-colors">
                    <td className="py-2.5 pr-4 text-loot-muted">#{u.id}</td>
                    <td className="py-2.5 pr-4 font-medium">{u.username}</td>
                    <td className="py-2.5 pr-4 text-loot-muted text-xs">{u.email}</td>
                    <td className="py-2.5 pr-4 text-loot-muted">
                      {[u.firstName, u.lastName].filter(Boolean).join(' ') || '—'}
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        u.role === 'Admin'
                          ? 'bg-loot-gold/20 text-loot-gold border border-loot-gold/30'
                          : 'bg-loot-surface text-loot-muted border border-loot-border'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${u.isActive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {u.isActive ? 'Тийм' : 'Үгүй'}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${u.isVerified ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                        {u.isVerified ? 'Тийм' : 'Үгүй'}
                      </span>
                    </td>
                    <td className="py-2.5 text-loot-muted text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan="8" className="text-center text-loot-muted py-10">Хэрэглэгч олдсонгүй</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} onPage={setPage} />
        </>
      )}
    </div>
  );
}
