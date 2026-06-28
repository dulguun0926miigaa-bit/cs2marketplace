import { useEffect, useState } from 'react';
import { adminService } from '../../services/marketplace.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

export default function AdminCaseHistoryPage() {
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await adminService.getCaseHistory({ page: p, limit: 20 });
      setHistory(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Кейс Нээлтийн Түүх</h1>

      {loading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : (
        <div className="loot-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-loot-muted border-b border-loot-border text-xs uppercase">
                {['ID', 'Хэрэглэгч', 'Кейс', 'Skin', 'Үнэ', 'Огноо'].map((h) => (
                  <th key={h} className="pb-3 pr-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-b border-loot-border/40 hover:bg-loot-surface transition-colors">
                  <td className="py-2.5 pr-4 text-loot-muted">#{item.id}</td>
                  <td className="py-2.5 pr-4 text-loot-muted">#{item.userId}</td>
                  <td className="py-2.5 pr-4 font-medium">{item.case?.name || '—'}</td>
                  <td className="py-2.5 pr-4 text-loot-muted">{item.skin?.name || '—'}</td>
                  <td className="py-2.5 pr-4 text-loot-gold">${parseFloat(item.price || 0).toFixed(2)}</td>
                  <td className="py-2.5 text-loot-muted text-xs">{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr><td colSpan="6" className="text-center text-loot-muted py-10">Түүх байхгүй байна</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination pagination={pagination} onPage={setPage} />
    </div>
  );
}
