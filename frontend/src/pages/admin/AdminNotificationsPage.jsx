import { useEffect, useState } from 'react';
import { adminService } from '../../services/marketplace.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', message: '', userId: '' });
  const [sending, setSending] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminService.getNotifications({ page: 1, limit: 50 });
      setNotifications(data.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) return alert('Title and message required');
    setSending(true);
    try {
      await adminService.sendNotification(form);
      setForm({ title: '', message: '', userId: '' });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send');
    }
    setSending(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete notification?')) return;
    try {
      await adminService.deleteNotification(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <div className="loot-card p-4">
            <h2 className="font-bold mb-3">Recent Notifications</h2>
            {loading ? <LoadingSpinner /> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-loot-muted border-b border-loot-border text-xs uppercase">
                      <th className="pb-2 pr-4">ID</th>
                      <th className="pb-2 pr-4">Title</th>
                      <th className="pb-2 pr-4">User</th>
                      <th className="pb-2 pr-4">Type</th>
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.map((n) => (
                      <tr key={n.id} className="border-b border-loot-border/40 hover:bg-loot-surface transition-colors">
                        <td className="py-2 pr-4 text-loot-muted">#{n.id}</td>
                        <td className="py-2 pr-4 font-medium">{n.title}</td>
                        <td className="py-2 pr-4 text-loot-muted">{n.userId ? `#${n.userId}` : 'All'}</td>
                        <td className="py-2 pr-4 text-loot-muted text-xs">{n.type || '—'}</td>
                        <td className="py-2 pr-4 text-loot-muted text-xs">{new Date(n.createdAt).toLocaleString()}</td>
                        <td className="py-2 pr-4">
                          <button onClick={() => handleDelete(n.id)} className="px-2 py-1 text-xs border border-red-700 text-red-300 rounded-lg">Delete</button>
                        </td>
                      </tr>
                    ))}
                    {notifications.length === 0 && (
                      <tr><td colSpan="6" className="text-center text-loot-muted py-6">No notifications</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="loot-card p-4">
            <h3 className="font-bold mb-3">Send Notification</h3>
            <form onSubmit={handleSend} className="flex flex-col gap-3">
              <input className="loot-input" placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
              <textarea className="loot-input resize-none" rows={4} placeholder="Message" value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} />
              <input className="loot-input" placeholder="User ID (optional)" value={form.userId} onChange={(e) => setForm((p) => ({ ...p, userId: e.target.value }))} />
              <button disabled={sending} className="btn-loot-primary">{sending ? 'Sending...' : 'Send'}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
