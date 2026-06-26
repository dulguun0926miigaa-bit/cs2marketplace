import { useEffect, useState } from 'react';
import { notificationService } from '../services/marketplace.service';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TYPE_ICONS = {
  ORDER_CREATED: '📦', PAYMENT_COMPLETED: '💳', ORDER_CANCELLED: '❌',
  USER_REGISTERED: '🎉', SKIN_ADDED: '🔫', SKIN_UPDATED: '✏️', SYSTEM: '🔔',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await notificationService.getNotifications({ limit: 50 });
      setNotifications(data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleMarkRead = async (id) => {
    await notificationService.markRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingSpinner size="lg" className="py-40" />;

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unread > 0 && <p className="text-gray-400 text-sm mt-1">{unread} unread</p>}
        </div>
        {unread > 0 && (
          <button onClick={handleMarkAllRead} className="btn-secondary text-sm">
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-4">🔔</p>
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && handleMarkRead(n.id)}
              className={`card cursor-pointer hover:border-gray-600 transition-colors ${!n.isRead ? 'border-cs2-accent/50 bg-cs2-accent/5' : ''}`}
            >
              <div className="flex gap-3">
                <span className="text-2xl">{TYPE_ICONS[n.type] || '🔔'}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{n.title}</p>
                    {!n.isRead && <span className="w-2 h-2 bg-cs2-accent rounded-full" />}
                  </div>
                  <p className="text-gray-400 text-sm mt-0.5">{n.message}</p>
                  <p className="text-gray-600 text-xs mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
