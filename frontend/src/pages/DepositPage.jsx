import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import useWalletStore from '../store/walletStore';

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500];

// Bank account for transfer
const BANK_ACCOUNT = '5779374780';
const BANK_NAME = 'Хаан банк (Khan Bank)';

export default function DepositPage() {
  const navigate = useNavigate();
  const { balance, createDeposit, confirmDeposit, fetchBalance } = useWalletStore();

  const [amount, setAmount] = useState(50);
  const [method, setMethod] = useState('CARD');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('select'); // 'select' | 'card-form' | 'transfer-info' | 'confirm' | 'success'
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardError, setCardError] = useState('');

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(BANK_ACCOUNT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const validateCard = () => {
    if (cardNumber.replace(/\s/g, '').length < 16) return 'Картын дугаар буруу (16 оронтой байх ёстой)';
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) return 'Хүчинтэй хугацаа буруу (MM/YY)';
    const [mm] = cardExpiry.split('/').map(Number);
    if (mm < 1 || mm > 12) return 'Сар 01–12 байх ёстой';
    if (cardCvc.length < 3) return 'CVC/CVV 3 оронтой байх ёстой';
    if (!cardName.trim()) return 'Картын эзэмшигчийн нэрийг оруулна уу';
    return null;
  };

  const handleNext = () => {
    setError('');
    if (amount < 1) { setError('Дүн 1-ээс дээш байх ёстой'); return; }
    if (method === 'CARD') {
      setStep('card-form');
    } else {
      setStep('transfer-info');
    }
  };

  const handleCardNext = () => {
    const err = validateCard();
    if (err) { setCardError(err); return; }
    setCardError('');
    handleCreateDeposit();
  };

  const handleCreateDeposit = async () => {
    setLoading(true);
    setError('');
    const result = await createDeposit(amount, method);
    if (result.success) {
      setSessionId(result.session.sessionId);
      setStep('confirm');
    } else {
      setError(result.message || 'Deposit үүсгэхэд алдаа гарлаа');
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
      setError(result.message || 'Баталгаажуулахад алдаа гарлаа');
    }
    setLoading(false);
  };

  const reset = () => {
    setStep('select');
    setError('');
    setCardError('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
    setCardName('');
    setSessionId('');
  };

  return (
    <div className="min-h-screen pb-20">
      <Header showBack backTo="/" />

      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-1">Данс цэнэглэх</h1>
        <p className="text-loot-muted text-sm mb-6">
          Одоогийн үлдэгдэл:{' '}
          <span className="text-loot-gold font-bold">${parseFloat(balance || 0).toFixed(2)}</span>
        </p>

        {/* ── SUCCESS ──────────────────────────────────────────────────── */}
        {step === 'success' && (
          <div className="loot-card p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-900/30 border border-green-700 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-bold text-xl mb-1">Төлбөр амжилттай!</p>
            <p className="text-loot-muted text-sm mb-2">
              <span className="text-green-400 font-bold">${parseFloat(amount).toFixed(2)}</span> дансанд нэмэгдлээ.
            </p>
            <p className="text-loot-muted text-sm mb-6">
              Шинэ үлдэгдэл:{' '}
              <span className="text-loot-gold font-bold">${parseFloat(balance || 0).toFixed(2)}</span>
            </p>
            <div className="flex gap-3">
              <button onClick={reset} className="btn-loot-secondary flex-1 text-sm">Дахин цэнэглэх</button>
              <button onClick={() => navigate('/cases')} className="btn-loot-primary flex-1 text-sm">Кейс нээх →</button>
            </div>
          </div>
        )}

        {/* ── CONFIRM ──────────────────────────────────────────────────── */}
        {step === 'confirm' && (
          <div className="loot-card p-6">
            <h2 className="font-bold text-lg mb-4">Төлбөр баталгаажуулах</h2>
            <div className="bg-loot-surface rounded-xl p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-loot-muted">Дүн</span>
                <span className="font-bold text-loot-gold">${parseFloat(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-loot-muted">Арга</span>
                <span>{method === 'CARD' ? '💳 Карт' : '🏦 Шилжүүлэг'}</span>
              </div>
              {method === 'CARD' && cardNumber && (
                <div className="flex justify-between text-sm">
                  <span className="text-loot-muted">Карт</span>
                  <span>**** **** **** {cardNumber.replace(/\s/g, '').slice(-4)}</span>
                </div>
              )}
            </div>
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <button onClick={handleConfirm} disabled={loading} className="btn-loot-primary w-full mb-3">
              {loading ? 'Боловсруулж байна...' : `$${parseFloat(amount).toFixed(2)} баталгаажуулах`}
            </button>
            <button onClick={reset} className="btn-loot-secondary w-full text-sm">Цуцлах</button>
          </div>
        )}

        {/* ── BANK TRANSFER INFO ────────────────────────────────────────── */}
        {step === 'transfer-info' && (
          <div className="loot-card p-6">
            <h2 className="font-bold text-lg mb-2">Банкны шилжүүлэг</h2>
            <p className="text-loot-muted text-xs mb-4">
              Доорх дансруу{' '}
              <span className="text-loot-gold font-bold">${parseFloat(amount).toFixed(2)}</span> шилжүүлснийхээ дараа
              "Баталгаажуулах" товч дарна уу.
            </p>

            {/* Bank card visual */}
            <div className="relative rounded-2xl bg-gradient-to-br from-yellow-600 to-yellow-800 p-5 mb-5 shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-8 -translate-x-8" />
              <p className="text-yellow-200/70 text-xs font-medium mb-3 uppercase tracking-widest">{BANK_NAME}</p>
              <p className="text-white text-2xl font-mono font-bold tracking-widest mb-3">
                {BANK_ACCOUNT.replace(/(.{4})/g, '$1 ').trim()}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-200/60 text-[10px] uppercase">Дансны дугаар</p>
                  <p className="text-white text-sm font-semibold">{BANK_ACCOUNT}</p>
                </div>
                <button
                  onClick={handleCopyAccount}
                  className="bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Хуулагдлаа
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Хуулах
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-3 mb-5">
              <p className="text-yellow-300 text-xs font-medium mb-1">⚠️ Анхааруулга</p>
              <ul className="text-yellow-200/70 text-xs space-y-1">
                <li>• Шилжүүлэгт тайлбар хэсэгт хэрэглэгчийн нэрээ бичнэ үү</li>
                <li>• Яг <strong className="text-yellow-300">${parseFloat(amount).toFixed(2)}</strong> шилжүүлнэ үү</li>
                <li>• Шилжүүлэг 5–15 минутын дотор баталгаажна</li>
              </ul>
            </div>

            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <button onClick={handleCreateDeposit} disabled={loading} className="btn-loot-primary w-full mb-3">
              {loading ? 'Шалгаж байна...' : 'Шилжүүллээ — Баталгаажуулах'}
            </button>
            <button onClick={reset} className="btn-loot-secondary w-full text-sm">Буцах</button>
          </div>
        )}

        {/* ── CARD FORM ─────────────────────────────────────────────────── */}
        {step === 'card-form' && (
          <div className="loot-card p-6">
            <h2 className="font-bold text-lg mb-4">Картын мэдээлэл</h2>

            {/* Amount reminder */}
            <div className="bg-loot-surface rounded-xl p-3 mb-5 flex items-center justify-between">
              <span className="text-loot-muted text-sm">Цэнэглэх дүн</span>
              <span className="text-loot-gold font-bold text-lg">${parseFloat(amount).toFixed(2)}</span>
            </div>

            <div className="space-y-4">
              {/* Card number */}
              <div>
                <label className="text-xs text-loot-muted mb-1.5 block">Картын дугаар</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={19}
                    className="loot-input pr-12"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                      setCardNumber(raw.replace(/(.{4})/g, '$1 ').trim());
                    }}
                  />
                  {/* Card brand icon */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    {cardNumber.startsWith('4') && (
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-900/30 px-1.5 py-0.5 rounded">VISA</span>
                    )}
                    {(cardNumber.startsWith('5') || cardNumber.startsWith('2')) && (
                      <span className="text-[10px] font-bold text-orange-400 bg-orange-900/30 px-1.5 py-0.5 rounded">MC</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Expiry + CVC */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-loot-muted mb-1.5 block">Хүчинтэй хугацаа</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    className="loot-input"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                      if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
                      setCardExpiry(v);
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs text-loot-muted mb-1.5 block">CVC / CVV</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    className="loot-input"
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  />
                </div>
              </div>

              {/* Cardholder name */}
              <div>
                <label className="text-xs text-loot-muted mb-1.5 block">Картын эзэмшигчийн нэр</label>
                <input
                  type="text"
                  className="loot-input uppercase tracking-widest"
                  placeholder="BOLD SURNAME"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                />
              </div>
            </div>

            {/* Accepted cards */}
            <div className="flex items-center gap-2 mt-4 mb-4">
              {['VISA', 'MC', 'UnionPay'].map((brand) => (
                <span key={brand} className="text-[10px] font-bold text-loot-muted border border-loot-border px-2 py-0.5 rounded">
                  {brand}
                </span>
              ))}
              <span className="ml-auto flex items-center gap-1 text-xs text-green-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Аюулгүй холболт
              </span>
            </div>

            {cardError && <p className="text-red-400 text-sm mb-3">{cardError}</p>}
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

            <button onClick={handleCardNext} disabled={loading} className="btn-loot-primary w-full mb-3">
              {loading ? 'Боловсруулж байна...' : `$${parseFloat(amount).toFixed(2)} төлөх`}
            </button>
            <button onClick={reset} className="btn-loot-secondary w-full text-sm">Буцах</button>
          </div>
        )}

        {/* ── SELECT AMOUNT & METHOD ────────────────────────────────────── */}
        {step === 'select' && (
          <div className="loot-card p-6">
            <h2 className="font-bold mb-4">Дүн сонгох</h2>

            {/* Preset amounts */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {PRESET_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(a)}
                  className={`py-3 rounded-xl text-sm font-semibold border transition-all ${
                    amount === a
                      ? 'bg-loot-gold/20 text-loot-gold border-loot-gold'
                      : 'border-loot-border text-loot-muted hover:border-loot-muted hover:text-white'
                  }`}
                >
                  ${a}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="mb-5">
              <label className="text-xs text-loot-muted mb-1.5 block">Өөр дүн ($)</label>
              <input
                type="number"
                min="1"
                max="10000"
                className="loot-input"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* Method selector */}
            <div className="mb-5">
              <label className="text-xs text-loot-muted mb-2 block">Төлбөрийн арга</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMethod('CARD')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all ${
                    method === 'CARD'
                      ? 'border-loot-gold bg-loot-gold/10 text-loot-gold'
                      : 'border-loot-border text-loot-muted hover:border-loot-muted'
                  }`}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path strokeLinecap="round" d="M2 10h20" />
                    <path strokeLinecap="round" strokeWidth={2} d="M6 15h4" />
                  </svg>
                  Карт
                  <span className="text-[10px] text-loot-muted">Visa / MC / UP</span>
                </button>
                <button
                  onClick={() => setMethod('TRANSFER')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all ${
                    method === 'TRANSFER'
                      ? 'border-loot-gold bg-loot-gold/10 text-loot-gold'
                      : 'border-loot-border text-loot-muted hover:border-loot-muted'
                  }`}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Шилжүүлэг
                  <span className="text-[10px] text-loot-muted">Khan / Golomt</span>
                </button>
              </div>
            </div>

            {/* Account display for transfer */}
            {method === 'TRANSFER' && (
              <div className="bg-loot-surface border border-loot-border rounded-xl p-3 mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-loot-muted">{BANK_NAME}</p>
                  <p className="font-mono font-bold text-white tracking-widest">{BANK_ACCOUNT}</p>
                </div>
                <button onClick={handleCopyAccount} className="text-xs text-loot-muted hover:text-white border border-loot-border px-2 py-1 rounded-lg transition-colors">
                  {copied ? '✓' : 'Хуулах'}
                </button>
              </div>
            )}

            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <button onClick={handleNext} disabled={loading || amount < 1} className="btn-loot-primary w-full">
              {method === 'CARD' ? 'Картын мэдээлэл →' : `$${parseFloat(amount).toFixed(2)} шилжүүлэх →`}
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
