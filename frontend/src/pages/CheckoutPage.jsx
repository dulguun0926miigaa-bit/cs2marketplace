import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useWalletStore from '../store/walletStore';
import { orderService } from '../services/marketplace.service';

const PAYMENT_METHODS = [
  {
    value: 'CARD',
    label: 'Картаар төлөх',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path strokeLinecap="round" d="M2 10h20" />
        <path strokeLinecap="round" strokeWidth={2} d="M6 15h4" />
      </svg>
    ),
    desc: 'Visa, Mastercard, UnionPay',
  },
  {
    value: 'BALANCE',
    label: 'Дансаар шилжүүлэх',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      </svg>
    ),
    desc: 'Дансны үлдэгдлээс хасах',
  },
];

export default function CheckoutPage() {
  const { items, total, fetchCart } = useCartStore();
  const { balance, fetchBalance } = useWalletStore();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCart();
    fetchBalance();
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await orderService.checkout({ notes });
      const orderId = data.data.order.id;
      await orderService.processPayment(orderId, { method: paymentMethod });
      navigate(`/orders/${orderId}?success=true`);
    } catch (err) {
      setError(err.response?.data?.message || 'Төлбөр төлөхөд алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const isBalanceMethod = paymentMethod === 'BALANCE';
  const hasEnoughBalance = parseFloat(balance || 0) >= parseFloat(total);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Төлбөр төлөх</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          {/* Payment method */}
          <div className="card">
            <h2 className="font-bold text-lg mb-4">Төлбөрийн арга</h2>
            <div className="flex flex-col gap-3">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.value}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === m.value
                      ? 'border-yellow-400 bg-yellow-400/10'
                      : 'border-cs2-border hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.value}
                    checked={paymentMethod === m.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  {/* Custom radio dot */}
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    paymentMethod === m.value ? 'border-yellow-400' : 'border-gray-500'
                  }`}>
                    {paymentMethod === m.value && (
                      <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    )}
                  </div>
                  <div className={`transition-colors ${paymentMethod === m.value ? 'text-yellow-400' : 'text-gray-400'}`}>
                    {m.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold text-sm transition-colors ${paymentMethod === m.value ? 'text-yellow-300' : 'text-white'}`}>
                      {m.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {m.value === 'BALANCE'
                        ? `Үлдэгдэл: $${parseFloat(balance || 0).toFixed(2)}`
                        : m.desc}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {/* Balance warning */}
            {isBalanceMethod && !hasEnoughBalance && (
              <div className="mt-3 flex items-start gap-2 bg-red-900/20 border border-red-800/50 rounded-lg p-3">
                <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <p className="text-red-400 text-xs">
                  Данс хүрэлцэхгүй байна. Зөрүү: <span className="font-bold">${(parseFloat(total) - parseFloat(balance || 0)).toFixed(2)}</span>.{' '}
                  <Link to="/deposit" className="underline hover:text-red-300">Данс цэнэглэх</Link>
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="card">
            <h2 className="font-bold text-lg mb-4">Захиалгын тэмдэглэл</h2>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Нэмэлт тэмдэглэл..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Order summary */}
        <div className="card h-fit">
          <h2 className="font-bold text-lg mb-4">Захиалгын дүн</h2>
          <div className="flex flex-col gap-3 max-h-64 overflow-y-auto mb-4">
            {items.map((item) => (
              <div key={item.skinId} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cs2-darker rounded flex items-center justify-center flex-shrink-0">
                  {item.skin.images?.[0] ? (
                    <img src={item.skin.images[0]} alt="" className="object-contain w-full h-full p-1" />
                  ) : (
                    <span className="text-xs text-gray-400">{item.skin.weapon}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.skin.name}</p>
                  <p className="text-xs text-gray-400">x{item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-yellow-400">
                  ${(parseFloat(item.skin.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-cs2-border pt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Нийт</span>
              <span className="text-yellow-400">${total}</span>
            </div>
          </div>

          {error && <p className="text-cs2-red text-sm mt-3">{error}</p>}

          <button
            onClick={handleCheckout}
            disabled={loading || (isBalanceMethod && !hasEnoughBalance)}
            className="btn-primary w-full mt-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Боловсруулж байна...' : `$${total} төлөх`}
          </button>
        </div>
      </div>
    </div>
  );
}
