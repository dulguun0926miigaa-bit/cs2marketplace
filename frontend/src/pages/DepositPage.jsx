import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import AuthModal from '../components/auth/AuthModal';
import useWalletStore from '../store/walletStore';
import useAuthStore from '../store/authStore';

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500];

export default function DepositPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { balance, createDeposit, confirmDeposit, fetchBalance } = useWalletStore();
  const [amount, setAmount] = useState(50);
  const [method, setMethod] = useState('CARD');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('select');
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState('');
  const [showAuth, setShowAuth] = useState(false);

  const handleCreateDeposit = async () => {
    if (!isAuthenticated()) { setShowAuth(true); return; }
    setLoading(true);
    setError('');
    const result = await createDeposit(amount, method);
    if (result.success) {
      setSessionId(result.session.sessionId);
      setStep('confirm');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleConfirm = async () => {
    setLoading(true);
    const result = await confirmDeposit(sessionId);
    if (result.success) {
      await fetchBalance();
      setStep('success');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen pb-20">
        <Header showBack backTo="/" />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <p className="text-loot-muted mb-4">Дансаа цэнэглэхийн тулд нэвтэрнэ үү</p>
          <button onClick={() => setShowAuth(true)} className="btn-loot-primary">Нэвтрэх</button>
        </div>
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Header showBack backTo="/" />

      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-1">Данс цэнэглэх</h1>
        <p className="text-loot-muted text-sm mb-2">Одоогийн үлдэгдэл: <span className="text-loot-gold font-bold">${parseFloat(balance).toFixed(2)}</span></p>
        <p className="text-loot-muted text-xs mb-6">Stripe demo горимоор аюулгүй төлбөр</p>

        {step === 'success' ? (
          <div className="loot-card p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-green-900/30 border border-green-700 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-bold text-lg mb-1">Төлбөр амжилттай!</p>
            <p className="text-loot-muted text-sm mb-6">Таны үлдэгдэл шинэчлэгдлээ.</p>
            <button onClick={() => navigate('/cases')} className="btn-loot-primary w-full">Кейс нээх</button>
          </div>
        ) : step === 'confirm' ? (
          <div className="loot-card p-6">
            <h2 className="font-bold mb-4">Төлбөр баталгаажуулах</h2>
            <div className="bg-loot-surface rounded-xl p-4 mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-loot-muted">Дүн</span>
                <span className="font-bold">${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-loot-muted">Арга</span>
                <span>{method === 'CARD' ? 'Карт' : 'Крипто'}</span>
              </div>
            </div>
            <p className="text-loot-muted text-xs mb-4">Demo горим: баталгаажуулахад төлбөр амжилттай гэж тооцно.</p>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <button onClick={handleConfirm} disabled={loading} className="btn-loot-primary w-full mb-3">
              {loading ? 'Боловсруулж байна...' : `$${amount.toFixed(2)} төлөх`}
            </button>
            <button onClick={() => setStep('select')} className="btn-loot-secondary w-full text-sm">Буцах</button>
          </div>
        ) : (
          <div className="loot-card p-6">
            <h2 className="font-bold mb-4">Дүн сонгох</h2>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {PRESET_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(a)}
                  className={`py-3 rounded-xl text-sm font-semibold border transition-colors ${
                    amount === a ? 'bg-loot-accent text-black border-loot-accent' : 'border-loot-border text-loot-muted hover:border-loot-muted'
                  }`}
                >
                  ${a}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="text-xs text-loot-muted mb-1.5 block">Өөр дүн</label>
              <input
                type="number"
                min="1"
                max="10000"
                className="loot-input"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="mb-6">
              <label className="text-xs text-loot-muted mb-1.5 block">Төлбөрийн арга</label>
              <div className="grid grid-cols-2 gap-2">
                {['CARD', 'CRYPTO'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                      method === m ? 'bg-loot-surface border-loot-muted text-white' : 'border-loot-border text-loot-muted'
                    }`}
                  >
                    {m === 'CARD' ? 'Карт' : 'Крипто'}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <button onClick={handleCreateDeposit} disabled={loading || amount < 1} className="btn-loot-primary w-full">
              {loading ? 'Үүсгэж байна...' : `$${amount.toFixed(2)} цэнэглэх`}
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
