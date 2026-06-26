import { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import InventoryItemCard from '../components/inventory/InventoryItemCard';
import AuthModal from '../components/auth/AuthModal';
import { inventoryService } from '../services/marketplace.service';
import useAuthStore from '../store/authStore';
import useWalletStore from '../store/walletStore';

const FILTERS = [
  { key: 'all', label: 'ALL ITEMS' },
  { key: 'knives', label: 'KNIVES', weapon: 'Knife' },
  { key: 'rifles', label: 'RIFLES', weapon: 'AK-47' },
  { key: 'gloves', label: 'GLOVES', weapon: 'Gloves' },
];

export default function InventoryPage() {
  const { isAuthenticated, user } = useAuthStore();
  const { fetchBalance } = useWalletStore();
  const [items, setItems] = useState([]);
  const [totalValue, setTotalValue] = useState('0.00');
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAuth, setShowAuth] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchInventory = async () => {
    if (!isAuthenticated()) return;
    setLoading(true);
    try {
      const params = { status: 'ACTIVE' };
      const { data } = await inventoryService.getInventory(params);
      setItems(data.data.items || []);
      setTotalValue(data.data.totalValue || '0.00');
    } catch {
      /* ignore */
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated()) {
      fetchInventory();
    } else {
      setLoading(false);
    }
  }, []);

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'all') return true;
    const weapon = item.skin?.weapon || '';
    if (activeFilter === 'knives') return weapon.includes('Knife') || weapon.includes('Karambit') || weapon.includes('Bayonet');
    if (activeFilter === 'rifles') return ['AK-47', 'AWP', 'M4A4', 'M4A1-S', 'FAMAS', 'Galil', 'AUG', 'SG 553', 'SSG 08'].some((w) => weapon.includes(w));
    if (activeFilter === 'gloves') return weapon.includes('Gloves');
    return true;
  });

  const handleSellAll = async () => {
    if (!isAuthenticated()) { setShowAuth(true); return; }
    setActionLoading(true);
    try {
      const { data } = await inventoryService.sellAll();
      setMessage(`Sold ${data.data.count} items for $${parseFloat(data.data.amount).toFixed(2)}`);
      await fetchBalance();
      await fetchInventory();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to sell');
    }
    setActionLoading(false);
  };

  const handleWithdraw = async () => {
    if (!isAuthenticated()) { setShowAuth(true); return; }
    if (!items.length) return;
    setActionLoading(true);
    try {
      const { data } = await inventoryService.withdraw(items.map((i) => i.id));
      setMessage(data.data.message || 'Withdrawal submitted');
      await fetchInventory();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Withdrawal failed');
    }
    setActionLoading(false);
  };

  const handleSellItem = async (item) => {
    setActionLoading(true);
    try {
      const { data } = await inventoryService.sellItem(item.id);
      setMessage(`Sold for $${parseFloat(data.data.amount).toFixed(2)}`);
      await fetchBalance();
      await fetchInventory();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to sell');
    }
    setActionLoading(false);
  };

  const level = user?.level || 42;
  const rank = 'Elite Collector';

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Inventory</h1>
            <p className="text-loot-muted text-sm mt-1">LEVEL {level} {rank}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-loot-muted uppercase tracking-widest">Total Value</p>
            <p className="text-2xl font-extrabold">${parseFloat(totalValue).toFixed(2)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={handleWithdraw}
            disabled={actionLoading || !items.length}
            className="btn-loot-primary text-sm py-3 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            WITHDRAW TO STEAM
          </button>
          <button
            onClick={handleSellAll}
            disabled={actionLoading || !items.length}
            className="btn-loot-secondary text-sm py-3 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            SELL ALL
          </button>
        </div>

        {message && (
          <div className="bg-loot-surface border border-loot-border rounded-xl p-3 text-sm text-loot-muted mb-4">
            {message}
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center border-b border-loot-border mb-6 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-3 text-xs font-semibold tracking-wider shrink-0 transition-colors ${
                activeFilter === f.key
                  ? 'text-white border-b-2 border-white'
                  : 'text-loot-muted hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
          <div className="flex-1" />
          <button className="p-3 text-loot-muted hover:text-white">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {!isAuthenticated() ? (
          <div className="text-center py-16">
            <p className="text-loot-muted mb-4">Sign in to view your inventory</p>
            <button onClick={() => setShowAuth(true)} className="btn-loot-primary">Sign In</button>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-loot-border border-t-white rounded-full animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-loot-muted mb-4">No items yet. Open some cases!</p>
            <a href="/cases" className="btn-loot-primary text-sm">Browse Cases</a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredItems.map((item) => (
              <InventoryItemCard key={item.id} item={item} onSell={handleSellItem} />
            ))}
          </div>
        )}
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      <BottomNav />
    </div>
  );
}
