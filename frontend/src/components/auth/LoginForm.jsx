import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import useWalletStore from '../../store/walletStore';

export default function LoginForm({ onSuccess, onSwitchRegister }) {
  const { login, isLoading, error } = useAuthStore();
  const { fetchCart } = useCartStore();
  const { fetchBalance } = useWalletStore();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form);
    if (result.success) {
      await fetchCart();
      await fetchBalance();
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold mb-1">Тавтай морил</h2>
        <p className="text-loot-muted text-sm">Дэлгүүрээс skin авахын тулд нэвтэрнэ үү</p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-400 rounded-xl p-3 text-sm">{error}</div>
      )}

      <div>
        <label className="text-xs text-loot-muted mb-1.5 block uppercase tracking-wider">Имэйл</label>
        <input
          className="loot-input"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="text-xs text-loot-muted mb-1.5 block uppercase tracking-wider">Нууц үг</label>
        <input
          className="loot-input"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
      </div>
      <div className="flex justify-end">
        <Link to="/forgot-password" className="text-xs text-loot-muted hover:text-white transition-colors">
          Нууц үгээ мартсан уу?
        </Link>
      </div>
      <button type="submit" disabled={isLoading} className="btn-loot-primary w-full">
        {isLoading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
      </button>
      <p className="text-center text-loot-muted text-sm">
        Бүртгэлгүй юу?{' '}
        <button type="button" onClick={onSwitchRegister} className="text-white hover:underline">
          Бүртгүүлэх
        </button>
      </p>
    </form>
  );
}
