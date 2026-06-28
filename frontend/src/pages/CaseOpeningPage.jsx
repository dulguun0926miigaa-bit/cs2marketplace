import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import CaseCarousel from '../components/case/CaseCarousel';
import CaseItemCard from '../components/case/CaseItemCard';
import AuthModal from '../components/auth/AuthModal';
import { caseService } from '../services/marketplace.service';
import useAuthStore from '../store/authStore';
import useWalletStore from '../store/walletStore';
import { RARITY_DROP_RATES, getRarityStyle, getSkinImage } from '../utils/skinVisuals';

// Rarity display colors
const RARITY_COLOR = {
  CONSUMER:        '#b0b0b0',
  INDUSTRIAL:      '#5e98d9',
  MIL_SPEC:        '#4b69ff',
  RESTRICTED:      '#8847ff',
  CLASSIFIED:      '#d32ce6',
  COVERT:          '#eb4b4b',
  CONTRABAND:      '#e4ae39',
  EXTRAORDINARY:   '#f5d930',
  EXCEEDINGLY_RARE:'#f5d930',
};

const RARITY_LABEL = {
  CONSUMER: 'Consumer Grade', INDUSTRIAL: 'Industrial Grade',
  MIL_SPEC: 'Mil-Spec Grade', RESTRICTED: 'Restricted',
  CLASSIFIED: 'Classified', COVERT: 'Covert',
  CONTRABAND: 'Contraband ★', EXTRAORDINARY: 'Extraordinary ★',
  EXCEEDINGLY_RARE: 'Rare Special ★',
};

export default function CaseOpeningPage() {
  const { slug } = useParams();
  const navigate  = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { balance, fetchBalance, setBalance } = useWalletStore();

  const [caseData,    setCaseData]    = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [isSpinning,  setIsSpinning]  = useState(false);
  const [wonSkin,     setWonSkin]     = useState(null);
  const [wonIndex,    setWonIndex]    = useState(0);
  const [showAuth,    setShowAuth]    = useState(false);
  const [showWin,     setShowWin]     = useState(false);
  const [error,       setError]       = useState('');
  const [openCount,   setOpenCount]   = useState(1); // 1 or 3 or 5

  useEffect(() => {
    setLoading(true);
    caseService.getCaseBySlug(slug)
      .then(({ data }) => { setCaseData(data.data.case); setLoading(false); })
      .catch(() => { setLoading(false); navigate('/cases'); });
    if (isAuthenticated()) fetchBalance();
  }, [slug]);

  const caseItems = caseData?.caseItems || [];

  const getDropRates = () => {
    const rates = {};
    caseItems.forEach((ci) => { rates[ci.skin?.rarity] = (rates[ci.skin?.rarity] || 0) + ci.dropRate; });
    return RARITY_DROP_RATES
      .map((dr) => ({ ...dr, rate: parseFloat((rates[dr.rarity] || dr.rate).toFixed(1)) }))
      .filter((dr) => dr.rate > 0);
  };

  const handleOpen = async () => {
    if (!isAuthenticated()) { setShowAuth(true); return; }
    const cost = caseData.price * openCount;
    if (balance < cost) {
      setError(`Данс хүрэлцэхгүй байна. Хэрэгтэй: $${cost.toFixed(2)}, Үлдэгдэл: $${parseFloat(balance).toFixed(2)}`);
      return;
    }
    setError('');
    setShowWin(false);
    setWonSkin(null);

    try {
      const { data } = await caseService.openCase(slug);
      const won = data.data.won;
      const idx = caseItems.findIndex((ci) => ci.skin?.id === won.id);
      setWonIndex(idx >= 0 ? idx : 0);
      setWonSkin(won);
      setBalance(data.data.balance);
      setIsSpinning(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Кейс нээхэд алдаа гарлаа');
    }
  };

  const handleSpinComplete = () => {
    setIsSpinning(false);
    setShowWin(true);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const rarityColor = wonSkin ? (RARITY_COLOR[wonSkin.rarity] || '#b0b0b0') : '#b0b0b0';
  const wonImage    = wonSkin ? getSkinImage(wonSkin) : null;
  const dropRates   = getDropRates();

  // Estimated value = avg of all case items
  const estValue = caseItems.length > 0
    ? (caseItems.reduce((s, ci) => s + (ci.skin?.price || 0), 0) / caseItems.length).toFixed(2)
    : '0.00';

  return (
    <div className="min-h-screen pb-20 bg-[#0a0e14]">
      <Header showBack backTo="/cases" />

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* ── Case header ────────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          {/* Animated case icon */}
          <div className="relative inline-block mb-4">
            <div className="w-32 h-32 mx-auto relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-yellow-600/30 to-yellow-900/10 border border-yellow-400/20 flex items-center justify-center">
                <svg className="w-16 h-16 text-yellow-400/60" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </div>
              {/* glow rings */}
              <div className="absolute inset-0 rounded-2xl border border-yellow-400/10 scale-110 pointer-events-none" />
              <div className="absolute inset-0 rounded-2xl border border-yellow-400/5 scale-125 pointer-events-none" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wider uppercase text-white">
            {caseData?.name}
          </h1>
          {caseData?.description && (
            <p className="text-gray-400 text-sm mt-2 max-w-lg mx-auto">{caseData.description}</p>
          )}
          <div className="flex items-center justify-center gap-6 mt-3 text-xs text-gray-500">
            <span>{caseItems.length} items in pool</span>
            <span>·</span>
            <span>Est. value: ${estValue}</span>
            {caseData?.collection && <><span>·</span><span>{caseData.collection.name}</span></>}
          </div>
        </div>

        {/* ── Carousel ───────────────────────────────────────────────────── */}
        <div className="mb-6">
          <CaseCarousel
            items={caseItems}
            isSpinning={isSpinning}
            wonIndex={wonIndex}
            wonSkin={wonSkin}
            onSpinComplete={handleSpinComplete}
          />
        </div>

        {/* ── Open controls ──────────────────────────────────────────────── */}
        <div className="text-center mb-2">
          {/* Count selector */}
          <div className="inline-flex gap-1 bg-[#141921] border border-[#1e2530] rounded-xl p-1 mb-4">
            {[1, 3, 5].map((n) => (
              <button
                key={n}
                onClick={() => setOpenCount(n)}
                disabled={isSpinning}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  openCount === n
                    ? 'bg-yellow-400 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {n === 1 ? 'Open 1' : `Open ${n}`}
              </button>
            ))}
          </div>

          {error && (
            <div className="text-red-400 text-sm mb-3 bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-2 inline-block">
              {error}
              {error.includes('Данс') && (
                <Link to="/deposit" className="underline ml-2 text-red-300">Цэнэглэх</Link>
              )}
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleOpen}
              disabled={isSpinning}
              className="relative overflow-hidden bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-base px-14 py-3.5 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed min-w-[220px] shadow-lg shadow-yellow-400/20"
            >
              {isSpinning ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Нээж байна...
                </span>
              ) : (
                `НЭЭХ — $${(caseData?.price * openCount || 0).toFixed(2)}`
              )}
            </button>
          </div>

          {/* Balance */}
          <p className="text-gray-500 text-xs mt-3">
            Дансны үлдэгдэл:{' '}
            <span className={parseFloat(balance) >= (caseData?.price * openCount || 0) ? 'text-green-400' : 'text-red-400'}>
              ${parseFloat(balance || 0).toFixed(2)}
            </span>
            {' '}·{' '}
            <Link to="/deposit" className="text-yellow-400 hover:underline">Цэнэглэх</Link>
          </p>
        </div>

        {/* ── Drop rates ─────────────────────────────────────────────────── */}
        <div className="flex flex-wrap justify-center gap-3 my-8">
          {dropRates.map((dr) => (
            <div key={dr.rarity} className="flex items-center gap-1.5 bg-[#141921] border border-[#1e2530] rounded-lg px-3 py-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dr.color }} />
              <span className="text-xs text-gray-400">{dr.rarity?.replace(/_/g, ' ')}</span>
              <span className="text-xs font-bold text-white">{dr.rate}%</span>
            </div>
          ))}
        </div>

        {/* ── Case Contents ──────────────────────────────────────────────── */}
        <div className="border-t border-[#1e2530] pt-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-300">Кейсийн агуулга</h2>
            <span className="text-xs text-gray-500 bg-[#141921] border border-[#1e2530] px-3 py-1 rounded-full">
              {caseItems.length} арьс
            </span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-2">
            <CaseItemCard isSpecial />
            {caseItems.map((ci) => (
              <CaseItemCard key={ci.id} skin={ci.skin} linkable />
            ))}
          </div>
        </div>
      </div>

      {/* ── Win Modal ──────────────────────────────────────────────────────── */}
      {showWin && wonSkin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={() => setShowWin(false)}
          />

          {/* Glow beam */}
          <div
            className="absolute inset-x-0 top-0 h-full pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 600px 400px at 50% 40%, ${rarityColor}22 0%, transparent 70%)`,
            }}
          />

          <div
            className="relative rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #141921 0%, #0d1117 100%)',
              border: `2px solid ${rarityColor}66`,
              boxShadow: `0 0 60px ${rarityColor}33`,
            }}
          >
            {/* Top rarity stripe */}
            <div className="h-1 w-full" style={{ backgroundColor: rarityColor }} />

            <div className="p-8 text-center">
              {/* "YOU WON" badge */}
              <div
                className="inline-block text-xs font-extrabold px-4 py-1 rounded-full mb-4 uppercase tracking-widest"
                style={{ backgroundColor: `${rarityColor}22`, color: rarityColor, border: `1px solid ${rarityColor}55` }}
              >
                {RARITY_LABEL[wonSkin.rarity] || wonSkin.rarity}
              </div>

              {/* Skin image */}
              {wonImage ? (
                <img
                  src={wonImage}
                  alt={wonSkin.name}
                  className="w-44 h-44 object-contain mx-auto mb-4 drop-shadow-2xl"
                />
              ) : (
                <div
                  className="w-44 h-44 mx-auto rounded-xl mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${rarityColor}15`, border: `1px solid ${rarityColor}33` }}
                >
                  <span className="text-5xl">🔫</span>
                </div>
              )}

              <h3 className="text-xl font-extrabold text-white mb-1">{wonSkin.name}</h3>
              <p className="text-gray-400 text-sm mb-1">{wonSkin.weapon}</p>
              {wonSkin.exterior && (
                <p className="text-gray-500 text-xs mb-3">{wonSkin.exterior?.replace(/_/g, ' ')}</p>
              )}
              <p className="text-2xl font-extrabold mb-6" style={{ color: rarityColor }}>
                ${parseFloat(wonSkin.price).toFixed(2)}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowWin(false); setWonSkin(null); }}
                  className="flex-1 py-3 rounded-xl border border-[#1e2530] text-gray-300 hover:text-white hover:border-gray-500 transition-colors text-sm font-semibold"
                >
                  Дахин нээх
                </button>
                <Link
                  to="/inventory"
                  className="flex-1 py-3 rounded-xl text-sm font-extrabold text-black text-center transition-colors"
                  style={{ backgroundColor: rarityColor }}
                >
                  Агуулах →
                </Link>
              </div>

              {/* New balance */}
              <p className="text-gray-600 text-xs mt-4">
                Шинэ үлдэгдэл: <span className="text-gray-400">${parseFloat(balance || 0).toFixed(2)}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      <BottomNav />
    </div>
  );
}
