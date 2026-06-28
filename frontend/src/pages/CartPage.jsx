import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import useWalletStore from '../store/walletStore';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BANK_ACCOUNT = '5779374780';
const BANK_NAME = 'Хаан банк';

export default function CartPage() {
  const { items, total, count, isLoading, fetchCart, updateItem, removeItem, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { balance } = useWalletStore();
  const navigate = useNavigate();
  const [showTransfer, setShowTransfer] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) fetchCart();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(BANK_ACCOUNT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (isLoading) return <LoadingSpinner size="lg" className="py-40" />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Сагс</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-xl text-gray-400 mb-6">Таны сагс хоосон байна</p>
          <Link to="/marketplace" className="btn-primary">Skin үзэх</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.skinId} className="card flex gap-4 items-center">
                <div className="w-20 h-20 bg-cs2-darker rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.skin.images?.[0] ? (
                    <img src={item.skin.images[0]} alt={item.skin.name} className="object-contain w-full h-full p-2" />
                  ) : (
                    <span className="text-2xl">🔫</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">{item.skin.weapon}</p>
                  <p className="font-semibold truncate">{item.skin.name}</p>
                  <p className="text-xs text-gray-400">{item.skin.exterior?.replace(/_/g, ' ')}</p>
                  <p className="text-cs2-accent font-bold mt-1">${parseFloat(item.skin.price).toFixed(2)}</p>
                </div>
                <div className="flex items-center border border-cs2-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => item.quantity <= 1 ? removeItem(item.skinId) : updateItem(item.skinId, item.quantity - 1)}
                    className="px-2 py-1.5 hover:bg-cs2-border"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 font-semibold text-sm">{item.quantity}</span>
                  <button onClick={() => updateItem(item.skinId, item.quantity + 1)} className="px-2 py-1.5 hover:bg-cs2-border">
                    +
                  </button>
                </div>
                <button onClick={() => removeItem(item.skinId)} className="text-gray-500 hover:text-cs2-red transition-colors ml-2">
                  🗑
                </button>
              </div>
            ))}
            <button onClick={clearCart} className="text-sm text-gray-500 hover:text-cs2-red self-start">
              Сагс хоослох
            </button>
          </div>

          {/* Summary */}
          <div className="card h-fit sticky top-24">
            <h2 className="text-lg font-bold mb-4">Захиалгын дүн</h2>
            <div className="flex justify-between text-gray-400 mb-2">
              <span>Зүйлс ({count})</span>
              <span className="text-yellow-400">${parseFloat(total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-cs2-border pt-3 mt-3">
              <span>Нийт</span>
              <span className="text-yellow-400">${parseFloat(total).toFixed(2)}</span>
            </div>

            {/* Balance info */}
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>Дансны үлдэгдэл</span>
              <span className={parseFloat(balance || 0) >= parseFloat(total) ? 'text-green-400' : 'text-red-400'}>
                ${parseFloat(balance || 0).toFixed(2)}
              </span>
            </div>

            <button onClick={() => navigate('/checkout')} className="btn-primary w-full mt-5">
              Төлбөр төлөх
            </button>

            {/* Transfer divider */}
            <div className="flex items-center gap-2 my-3">
              <div className="flex-1 h-px bg-cs2-border" />
              <span className="text-xs text-gray-500">эсвэл</span>
              <div className="flex-1 h-px bg-cs2-border" />
            </div>

            {/* Bank transfer button */}
            <button
              onClick={() => setShowTransfer(!showTransfer)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-cs2-border text-sm text-gray-400 hover:border-yellow-400/50 hover:text-yellow-400 transition-all"
            >
              <span className="text-lg">💳</span>
              Дансруу шилжүүлэх
              <span className={`w-3 h-3 transition-transform ${showTransfer ? 'rotate-90' : ''}`}>
                →
              </span>
            </button>

            {showTransfer && (
              <div className="mt-3 bg-cs2-darker rounded-xl p-4 border border-cs2-border">
                <p className="text-xs text-gray-400 mb-3">
                  Доорх дансруу <span className="text-yellow-400 font-bold">${parseFloat(total).toFixed(2)}</span> шилжүүлснийхээ дараа захиалга баталгаажна.
                </p>
                {/* Bank card mini */}
                <div className="relative rounded-xl bg-gradient-to-br from-yellow-600 to-yellow-800 p-4 mb-3 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/5 -translate-y-6 translate-x-6" />
                  <p className="text-yellow-200/70 text-[10px] mb-1 uppercase tracking-widest">{BANK_NAME}</p>
                  <p className="text-white text-lg font-mono font-bold tracking-widest">
                    {BANK_ACCOUNT.replace(/(.{4})/g, '$1 ').trim()}
                  </p>
                  <button
                    onClick={handleCopy}
                    className="mt-2 bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1 rounded-lg transition-colors"
                  >
                    {copied ? '✓ Хуулагдлаа' : 'Хуулах'}
                  </button>
                </div>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Тайлбарт хэрэглэгчийн нэрийг бичнэ үү</li>
                  <li>• Яг ${parseFloat(total).toFixed(2)} шилжүүлнэ үү</li>
                  <li>• 5–15 минутад баталгаажна</li>
                </ul>
              </div>
            )}

            <Link to="/marketplace" className="btn-secondary w-full mt-3 text-center block">
              Дэлгүүр рүү буцах
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
