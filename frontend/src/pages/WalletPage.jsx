import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import useWalletStore from '../store/walletStore';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function WalletPage() {
  const navigate = useNavigate();
  const { balance, fetchBalance, fetchTransactions } = useWalletStore();
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async (p = 1) => {
    setLoading(true);
    await fetchBalance();
    const res = await fetchTransactions(p);
    if (res) {
      setTransactions(res.transactions || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page]);

  return (
    <div className="min-h-screen pb-20">
      <Header showBack backTo="/" />
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-2">Wallet</h1>
        <p className="text-sm text-loot-muted mb-4">Current balance: <span className="text-loot-gold font-bold">${parseFloat(balance || 0).toFixed(2)}</span></p>

        <div className="flex gap-3 mb-6">
          <button onClick={() => navigate('/deposit')} className="btn-loot-primary flex-1">Deposit</button>
          <button onClick={() => navigate('/inventory')} className="btn-loot-secondary flex-1">Inventory</button>
        </div>

        <div className="loot-card p-4">
          <h2 className="font-bold mb-3">Transactions</h2>
          {loading ? <LoadingSpinner /> : (
            transactions.length === 0 ? (
              <p className="text-loot-muted text-sm">No transactions yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-loot-muted border-b border-loot-border text-xs uppercase">
                      <th className="pb-2 pr-4">ID</th>
                      <th className="pb-2 pr-4">Type</th>
                      <th className="pb-2 pr-4">Amount</th>
                      <th className="pb-2 pr-4">Status</th>
                      <th className="pb-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr key={t.id} className="border-b border-loot-border/40 hover:bg-loot-surface transition-colors">
                        <td className="py-2 pr-4 text-loot-muted">#{t.id}</td>
                        <td className="py-2 pr-4 font-medium">{t.type}</td>
                        <td className="py-2 pr-4 text-loot-gold font-bold">${parseFloat(t.amount || 0).toFixed(2)}</td>
                        <td className="py-2 pr-4 text-loot-muted text-xs">{t.status}</td>
                        <td className="py-2 text-loot-muted text-xs">{new Date(t.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
