import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import CartItem from './CartItem';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, total, count, isLoading, fetchCart, updateItem, removeItem, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && isAuthenticated()) fetchCart();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-loot-bg border-l border-loot-border h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-loot-border">
          <div>
            <h2 className="font-bold text-lg">Сагс</h2>
            <p className="text-loot-muted text-sm">{count} зүйл</p>
          </div>
          <button onClick={onClose} className="text-loot-muted hover:text-white p-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!isAuthenticated() ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-loot-muted mb-4">Сагсаа харахын тулд нэвтэрнэ үү</p>
            <Link to="/login" className="btn-loot-primary" onClick={onClose}>Нэвтрэх</Link>
          </div>
        ) : isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-loot-border border-t-white rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <svg className="w-12 h-12 text-loot-border mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-loot-muted mb-4">Таны сагс хоосон байна</p>
            <Link to="/marketplace" className="btn-loot-secondary text-sm" onClick={onClose}>Дэлгүүр үзэх</Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {items.map((item) => (
                <CartItem
                  key={item.skinId}
                  item={item}
                  onUpdate={updateItem}
                  onRemove={removeItem}
                />
              ))}
              <button onClick={clearCart} className="text-xs text-loot-muted hover:text-red-400 self-start">
              Сагс хоослох
              </button>
            </div>
            <div className="p-4 border-t border-loot-border bg-loot-surface">
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Нийт дүн</span>
                <span className="text-yellow-400">${total}</span>
              </div>
              <button
                onClick={() => { onClose(); navigate('/checkout'); }}
                className="btn-loot-primary w-full"
              >
                Төлбөр төлөх
              </button>
              <Link to="/cart" className="btn-loot-secondary w-full mt-2 text-center block text-sm" onClick={onClose}>
                Сагсыг бүтнээр харах
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function CartButton({ className = '' }) {
  const { count, fetchCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) fetchCart();
  }, []);

  return (
    <>
      <button
        onClick={() => setDrawerOpen(true)}
        className={`relative p-2 text-loot-muted hover:text-white transition-colors ${className}`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-loot-gold text-black text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>
      <CartDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
