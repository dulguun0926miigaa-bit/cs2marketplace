import { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { tradeService, inventoryService } from '../services/marketplace.service';
import useAuthStore from '../store/authStore';

const STATUS_BADGE = {
  PENDING: 'border-yellow-700 text-yellow-400 bg-yellow-900/20',
  ACCEPTED: 'border-green-700 text-green-400 bg-green-900/20',
  DECLINED: 'border-red-700 text-red-400 bg-red-900/20',
  CANCELLED: 'border-loot-border text-loot-muted bg-loot-surface',
};

export default function TradesPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [tab, setTab] = useState('incoming');
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ receiverId: '', message: '', itemIds: [] });
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    setIsLoading(true);
    try {
      const [inRes, outRes, invRes] = await Promise.all([
        tradeService.getIncoming(),
        tradeService.getOutgoing(),
        inventoryService.getInventory({ status: 'ACTIVE', limit: 100 }),
      ]);
      setIncoming(inRes.data.data.offers || []);
      setOutgoing(outRes.data.data.offers || []);
      setMyItems(invRes.data.data.items || []);
    } catch { /* ignore */ }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (id, action) => {
    try {
      await tradeService[action](id);
      setMessage(`Trade ${action}ed successfully`);
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Action failed');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createForm.receiverId || !createForm.itemIds.length) {
      setMessage('Receiver ID and at least 1 item required');
      return;
    }
    setCreating(true);
    try {
      await tradeService.create({
        receiverId: parseInt(createForm.receiverId, 10),
        inventoryItemIds: createForm.itemIds,
        message: createForm.message,
      });
      setShowCreate(false);
      setCreateForm({ receiverId: '', message: '', itemIds: [] });
      setMessage('Trade offer sent!');
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send trade offer');
    } finally {
      setCreating(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const toggleItem = (id) => {
    setCreateForm((f) => ({
      ...f,
      itemIds: f.itemIds.includes(id) ? f.itemIds.filter((i) => i !== id) : [...f.itemIds, id],
    }));
  };

  const offers = tab === 'incoming' ? incoming : outgoing;

  return (
    <div className="min-h-screen pb-20">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Trade Offers</h1>
            <p className="text-loot-muted text-sm">Inventory item-үүдийг худалдаж авах</p>
          </div>
          <button onClick={() => setShowCreate(!showCreate)} className="btn-loot-primary text-sm">
            {showCreate ? 'Болих' : '+ Trade Offer Илгээх'}
          </button>
        </div>

        {message && (
          <div className={`rounded-xl p-3 text-sm mb-4 border ${
            message.includes('success') || message.includes('sent')
              ? 'bg-green-900/20 border-green-700 text-green-400'
              : 'bg-red-900/20 border-red-700 text-red-400'
          }`}>{message}</div>
        )}

        {/* Create Trade Form */}
        {showCreate && (
          <form onSubmit={handleCreate} className="loot-card p-5 mb-6">
            <h2 className="font-bold mb-4">Шинэ Trade Offer</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-loot-muted block mb-1">Хүлээн авагчийн User ID *</label>
                <input
                  className="loot-input"
                  type="number"
                  min="1"
                  placeholder="User ID оруулах"
                  value={createForm.receiverId}
                  onChange={(e) => setCreateForm((f) => ({ ...f, receiverId: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-loot-muted block mb-1">Мессеж (заавал биш)</label>
                <input
                  className="loot-input"
                  placeholder="Trade-ийн тайлбар..."
                  value={createForm.message}
                  onChange={(e) => setCreateForm((f) => ({ ...f, message: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-loot-muted block mb-2">
                Item-үүдийг сонгоорой ({createForm.itemIds.length} сонгосон) *
              </label>
              {myItems.length === 0 ? (
                <p className="text-loot-muted text-sm py-4 text-center border border-loot-border rounded-xl">
                  Inventory хоосон байна. Кейс нээн skin цуглуулаарай.
                </p>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 max-h-48 overflow-y-auto border border-loot-border rounded-xl p-2">
                  {myItems.map((item) => {
                    const selected = createForm.itemIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className={`rounded-lg p-2 text-left border transition-all ${
                          selected
                            ? 'border-white bg-loot-surface'
                            : 'border-loot-border hover:border-loot-muted'
                        }`}
                      >
                        <p className="text-xs font-medium truncate">{item.skin?.weapon}</p>
                        <p className="text-[10px] text-loot-muted truncate">{item.skin?.name?.split('|')[1]?.trim()}</p>
                        <p className="text-xs text-loot-gold mt-1">${parseFloat(item.skin?.price || 0).toFixed(2)}</p>
                        {selected && (
                          <div className="text-[10px] text-green-400 mt-0.5">✓ Сонгосон</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <button type="submit" disabled={creating} className="btn-loot-primary text-sm">
                {creating ? 'Илгээж байна...' : 'Trade Offer Илгээх'}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="btn-loot-secondary text-sm">
                Болих
              </button>
            </div>
          </form>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-loot-surface rounded-xl p-1">
          {[
            { key: 'incoming', label: `Ирсэн (${incoming.filter((o) => o.status === 'PENDING').length})` },
            { key: 'outgoing', label: `Явсан (${outgoing.filter((o) => o.status === 'PENDING').length})` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.key ? 'bg-loot-card text-white' : 'text-loot-muted hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Offers list */}
        {isLoading ? (
          <LoadingSpinner className="py-20" />
        ) : offers.length === 0 ? (
          <div className="text-center py-16 text-loot-muted">
            <p className="text-4xl mb-3">🔄</p>
            <p>{tab === 'incoming' ? 'Ирсэн trade offer байхгүй' : 'Явуулсан trade offer байхгүй'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => (
              <div key={offer.id} className="loot-card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">Trade #{offer.id}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_BADGE[offer.status] || STATUS_BADGE.CANCELLED}`}>
                        {offer.status}
                      </span>
                    </div>
                    <p className="text-xs text-loot-muted mt-0.5">
                      {tab === 'incoming' ? `From User ${offer.senderId}` : `To User ${offer.receiverId}`}
                      {' · '}{new Date(offer.createdAt).toLocaleDateString()}
                    </p>
                    {offer.message && (
                      <p className="text-sm text-loot-muted italic mt-1">"{offer.message}"</p>
                    )}
                  </div>
                  {offer.status === 'PENDING' && (
                    <div className="flex gap-2 flex-shrink-0">
                      {tab === 'incoming' && (
                        <>
                          <button
                            onClick={() => handleAction(offer.id, 'accept')}
                            className="btn-loot-primary text-xs py-1.5 px-4"
                          >
                            Хүлээн авах
                          </button>
                          <button
                            onClick={() => handleAction(offer.id, 'decline')}
                            className="btn-loot-secondary text-xs py-1.5 px-4"
                          >
                            Татгалзах
                          </button>
                        </>
                      )}
                      {tab === 'outgoing' && (
                        <button
                          onClick={() => handleAction(offer.id, 'cancel')}
                          className="btn-loot-secondary text-xs py-1.5 px-4"
                        >
                          Цуцлах
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="flex flex-wrap gap-2">
                  {offer.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 bg-loot-bg border border-loot-border rounded-lg px-3 py-1.5">
                      <p className="text-xs font-medium">{item.skin?.name || 'Unknown'}</p>
                      <p className="text-xs text-loot-gold">${parseFloat(item.skin?.price || 0).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Total value */}
                {offer.items?.length > 0 && (
                  <p className="text-xs text-loot-muted mt-2">
                    Нийт үнэ: <span className="text-white font-semibold">
                      ${offer.items.reduce((s, i) => s + parseFloat(i.skin?.price || 0), 0).toFixed(2)}
                    </span>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
