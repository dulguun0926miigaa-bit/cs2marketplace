import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { orderService } from '../services/marketplace.service';
import LoadingSpinner from '../components/common/LoadingSpinner';

const STATUS_COLORS = {
  PENDING: 'text-yellow-400', PROCESSING: 'text-blue-400',
  COMPLETED: 'text-cs2-green', CANCELLED: 'text-cs2-red', REFUNDED: 'text-gray-400',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [cancelError, setCancelError] = useState('');

  const load = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const { data } = await orderService.getOrderById(id);
      setOrder(data.data.order);
    } catch (err) {
      const msg = err.response?.data?.message || 'Захиалга ачааллахад алдаа гарлаа';
      setLoadError(msg);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    setCancelError('');
    try {
      await orderService.cancelOrder(id);
      await load();
    } catch (err) {
      setCancelError(err.response?.data?.message || 'Захиалга цуцлахад алдаа гарлаа');
    }
    setCancelling(false);
  };

  if (loading) return <LoadingSpinner size="lg" className="py-40" />;

  if (loadError) {
    return (
      <div className="text-center py-40">
        <p className="text-red-400 mb-4">{loadError}</p>
        <button onClick={load} className="btn-secondary text-sm">Дахин оролдох</button>
      </div>
    );
  }

  if (!order) return <div className="text-center py-40 text-gray-400">Захиалга олдсонгүй</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {isSuccess && (
        <div className="bg-green-900/30 border border-cs2-green text-cs2-green rounded-xl p-4 mb-6 text-center">
          <p className="text-xl font-bold mb-1">🎉 Төлбөр амжилттай!</p>
          <p>Таны захиалга амжилттай баталгаажлаа.</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Захиалга #{order.id}</h1>
        <span className={`font-bold text-lg ${STATUS_COLORS[order.status]}`}>{order.status}</span>
      </div>

      <div className="card mb-6">
        <h2 className="font-bold mb-4">Items</h2>
        <div className="flex flex-col divide-y divide-cs2-border">
          {order.orderItems?.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-3">
              <div className="w-14 h-14 bg-cs2-darker rounded flex items-center justify-center">
                {item.skin.images?.[0] ? (
                  <img src={item.skin.images[0]} alt="" className="object-contain w-full h-full p-1" />
                ) : <span>🔫</span>}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.skin.name}</p>
                <p className="text-xs text-gray-400">{item.skin.exterior?.replace(/_/g, ' ')} × {item.quantity}</p>
              </div>
              <p className="font-bold text-cs2-accent">${parseFloat(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-cs2-border">
          <span>Total</span>
          <span className="text-cs2-accent">${parseFloat(order.totalAmount).toFixed(2)}</span>
        </div>
      </div>

      {order.payment && (
        <div className="card mb-6">
          <h2 className="font-bold mb-3">Payment</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-cs2-darker rounded p-3">
              <p className="text-gray-500 text-xs">Method</p>
              <p className="font-medium">{order.payment.method}</p>
            </div>
            <div className="bg-cs2-darker rounded p-3">
              <p className="text-gray-500 text-xs">Status</p>
              <p className={`font-medium ${STATUS_COLORS[order.payment.status]}`}>{order.payment.status}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Link to="/orders" className="btn-secondary">← Захиалгууд руу буцах</Link>
        {['PENDING', 'PROCESSING'].includes(order.status) && (
          <button onClick={handleCancel} disabled={cancelling} className="btn-danger">
            {cancelling ? 'Цуцалж байна...' : 'Захиалга цуцлах'}
          </button>
        )}
      </div>
      {cancelError && (
        <p className="text-red-400 text-sm mt-3">{cancelError}</p>
      )}
    </div>
  );
}
