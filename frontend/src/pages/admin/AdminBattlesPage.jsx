import { useEffect, useState } from 'react';
import { adminService } from '../../services/marketplace.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

export default function AdminBattlesPage() {
  const [battles, setBattles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await adminService.getBattles({ page: p, limit: 20 });
      setBattles(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Battle Удирдах</h1>

      {loading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : (
        <div className="loot-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-loot-muted border-b border-loot-border text-xs uppercase">
                {['ID', 'Mode', 'Төлөв', 'Кейс', 'Орсон', 'Чөлөөтүй', 'Огноо'].map((h) => (
                  <th key={h} className="pb-3 pr-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {battles.map((battle) => (
                <tr key={battle.id} className="border-b border-loot-border/40 hover:bg-loot-surface transition-colors">
                  <td className="py-2.5 pr-4 text-loot-muted">#{battle.id}</td>
                  <td className="py-2.5 pr-4 font-medium">{battle.mode}</td>
                  <td className="py-2.5 pr-4 text-loot-muted">{battle.status}</td>
                  <td className="py-2.5 pr-4">{battle.case?.name || '—'}</td>
                  <td className="py-2.5 pr-4">{battle.participants?.length || 0}</td>
                  <td className="py-2.5 pr-4 text-loot-muted">{battle.isPrivate ? 'Тийм' : 'Үгүй'}</td>
                  <td className="py-2.5 text-loot-muted text-xs">{new Date(battle.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {battles.length === 0 && (
                <tr><td colSpan="7" className="text-center text-loot-muted py-10">Battle байхгүй байна</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination pagination={pagination} onPage={setPage} />
    </div>
  );
}
