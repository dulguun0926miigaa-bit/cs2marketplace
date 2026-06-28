import { useEffect, useState } from 'react';
import { adminService } from '../../services/marketplace.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

const STATUS_COLORS = {
  PENDING: 'text-yellow-400', PROCESSING: 'text-blue-400',
  COMPLETED: 'text-green-400', CANCELLED: 'text-red-400', REFUNDED: 'text-loot-muted',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await adminService.getAllOrders({ page: p, limit: 20, status: status || undefined });
      setOrders(data.data);
      setPagination(data.pagination);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page, status]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Захиалга Удирдах</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['', 'PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'].map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium border shrink-0 transition-all ${
              status === s
                ? 'bg-white text-black border-white'
                : 'border-loot-border text-loot-muted hover:border-loot-muted'
            }`}
          >
            {s || 'Бүгд'}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner size="lg" className="py-20" /> : (
        <>
          <div className="loot-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-loot-muted border-b border-loot-border text-xs uppercase">
                  {['Order ID', 'User ID', 'Items', 'Нийт', 'Төлөв', 'Төлбөр', 'Огноо', 'Actions'].map((h) => (
                    <th key={h} className="pb-3 pr-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-loot-border/40 hover:bg-loot-surface transition-colors">
                    <td className="py-2.5 pr-4 font-medium">#{o.id}</td>
                    <td className="py-2.5 pr-4 text-loot-muted">{o.userId}</td>
                    <td className="py-2.5 pr-4">{o.orderItems?.length || 0}</td>
                    <td className="py-2.5 pr-4 text-loot-gold font-bold">${parseFloat(o.totalAmount).toFixed(2)}</td>
                    <td className={`py-2.5 pr-4 font-semibold ${STATUS_COLORS[o.status]}`}>{o.status}</td>
                    <td className="py-2.5 pr-4 text-loot-muted text-xs">{o.payment?.status || '—'}</td>
                    <td className="py-2.5 text-loot-muted text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="py-2.5">
                      <div className="flex gap-2">
                        <a href={`/orders/${o.id}`} target="_blank" rel="noopener noreferrer" className="px-2 py-1 text-xs border rounded">View</a>
                        <select className="loot-input text-xs" defaultValue={o.status} onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            await adminService.updateOrderStatus(o.id, newStatus);
                            load(page);
                          } catch (err) { alert(err.response?.data?.message || 'Update failed'); }
                        }}>
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan="7" className="text-center text-loot-muted py-10">Захиалга байхгүй</td></tr>
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
