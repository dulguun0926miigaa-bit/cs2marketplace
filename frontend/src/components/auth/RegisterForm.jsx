import { useState } from 'react';
import useAuthStore from '../../store/authStore';

export default function RegisterForm({ onSuccess, onSwitchLogin }) {
  const { register, isLoading, error } = useAuthStore();
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(form);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => onSuccess?.(), 1500);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-full bg-green-900/30 border border-green-700 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-semibold">Бүртгэл амжилттай!</p>
        <p className="text-loot-muted text-sm mt-1">Таныг автоматаар нэвтэрлээ...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <h2 className="text-xl font-bold mb-1">Бүртгэл үүсгэх</h2>
        <p className="text-loot-muted text-sm">Дөк, Ами, Чочироо 3ийн дэлгүүрт нэгдээрэй</p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-400 rounded-xl p-3 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-loot-muted mb-1.5 block">Нэр</label>
          <input className="loot-input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-loot-muted mb-1.5 block">Овог</label>
          <input className="loot-input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="text-xs text-loot-muted mb-1.5 block">Нэвтрэх нэр</label>
        <input className="loot-input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
      </div>
      <div>
        <label className="text-xs text-loot-muted mb-1.5 block">Имэйл</label>
        <input className="loot-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      </div>
      <div>
        <label className="text-xs text-loot-muted mb-1.5 block">Нууц үг</label>
        <input className="loot-input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
      </div>
      <button type="submit" disabled={isLoading} className="btn-loot-primary w-full mt-2">
        {isLoading ? 'Үүсгэж байна...' : 'Бүртгүүлэх'}
      </button>
      <p className="text-center text-loot-muted text-sm">
        Бүртгэлтэй юу?{' '}
        <button type="button" onClick={onSwitchLogin} className="text-white hover:underline">
          Нэвтрэх
        </button>
      </p>
    </form>
  );
}
