import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { orderService } from '../services/marketplace.service';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
  PROCESSING: 'bg-blue-900/30 text-blue-400 border-blue-800',
  COMPLETED: 'bg-green-900/30 text-cs2-green border-green-800',
  CANCELLED: 'bg-red-900/30 text-cs2-red border-red-800',
  REFUNDED: 'bg-gray-700 text-gray-300 border-gray-600',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await orderService.getMyOrders({ page: p, limit: 10 });
      setOrders(data.data);
      setPagination(data.pagination);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page]);

  if (loading) return <LoadingSpinner size="lg" className="py-40" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-xl text-gray-400 mb-6">No orders yet</p>
          <Link to="/marketplace" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <Link key={order.id} to={`/orders/${order.id}`} className="card hover:border-cs2-accent transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold">Order #{order.id}</p>
                    <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">{order.orderItems?.length} item(s)</p>
                  <p className="text-cs2-accent font-bold text-lg">${parseFloat(order.totalAmount).toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
          <Pagination pagination={pagination} onPage={setPage} />
        </>
      )}
    </div>
  );
}
