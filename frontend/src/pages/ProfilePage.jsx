import { useState } from 'react';
import useAuthStore from '../store/authStore';

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    avatar: user?.avatar || '',
  });
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(form);
    setMsg(result.success ? 'Profile updated!' : result.message);
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="card mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-cs2-accent flex items-center justify-center text-2xl font-bold">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-lg">{user?.username}</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user?.role === 'Admin' ? 'bg-cs2-accent/20 text-cs2-accent' : 'bg-cs2-border text-gray-300'}`}>
              {user?.role}
            </span>
          </div>
        </div>

        {msg && (
          <div className="bg-green-900/30 border border-cs2-green text-cs2-green rounded-lg p-3 mb-4 text-sm">{msg}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">First Name</label>
              <input className="input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Last Name</label>
              <input className="input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Avatar URL</label>
            <input className="input" type="url" placeholder="https://..." value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} />
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary self-start">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
