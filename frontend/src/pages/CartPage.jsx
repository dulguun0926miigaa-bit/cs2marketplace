import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function CartPage() {
  const { items, total, count, isLoading, fetchCart, updateItem, removeItem, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) fetchCart();
  }, []);

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
                  <button onClick={() => updateItem(item.skinId, item.quantity - 1)} className="px-2 py-1.5 hover:bg-cs2-border">
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1.5 font-semibold text-sm">{item.quantity}</span>
                  <button onClick={() => updateItem(item.skinId, item.quantity + 1)} className="px-2 py-1.5 hover:bg-cs2-border">
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
                <button onClick={() => removeItem(item.skinId)} className="text-gray-500 hover:text-cs2-red transition-colors ml-2">
                  <TrashIcon className="w-5 h-5" />
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
              <span className="text-yellow-400">${total}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-cs2-border pt-3 mt-3">
              <span>Нийт</span>
              <span className="text-yellow-400">${total}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn-primary w-full mt-6">
              Төлбөр төлөх
            </button>
            <Link to="/marketplace" className="btn-secondary w-full mt-2 text-center block">
              Дэлгүүр рүү буцах
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
