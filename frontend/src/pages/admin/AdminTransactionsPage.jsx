import { useEffect, useState } from 'react';
import { adminService } from '../../services/marketplace.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await adminService.getTransactions({ page: p, limit: 20 });
      setTransactions(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Транзакц Удирдах</h1>

      {loading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : (
        <div className="loot-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-loot-muted border-b border-loot-border text-xs uppercase">
                {['ID', 'Wallet', 'Төрөл', 'Дүн', 'Төлөв', 'Нэмэлт', 'Огноо'].map((h) => (
                  <th key={h} className="pb-3 pr-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-loot-border/40 hover:bg-loot-surface transition-colors">
                  <td className="py-2.5 pr-4 text-loot-muted">#{tx.id}</td>
                  <td className="py-2.5 pr-4 text-loot-muted">#{tx.walletId}</td>
                  <td className="py-2.5 pr-4 font-medium">{tx.type}</td>
                  <td className="py-2.5 pr-4 text-loot-gold font-bold">${parseFloat(tx.amount || 0).toFixed(2)}</td>
                  <td className="py-2.5 pr-4 text-sm text-loot-muted">{tx.status}</td>
                  <td className="py-2.5 pr-4 text-loot-muted text-xs truncate max-w-[200px]">{tx.referenceId || tx.description || '—'}</td>
                  <td className="py-2.5 text-loot-muted text-xs">{new Date(tx.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr><td colSpan="7" className="text-center text-loot-muted py-10">Транзакц байхгүй байна</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination pagination={pagination} onPage={setPage} />
    </div>
  );
}
