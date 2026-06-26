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
import { RARITY_DROP_RATES } from '../utils/skinVisuals';

export default function CaseOpeningPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { balance, fetchBalance, setBalance } = useWalletStore();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonSkin, setWonSkin] = useState(null);
  const [wonIndex, setWonIndex] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    caseService.getCaseBySlug(slug).then(({ data }) => {
      setCaseData(data.data.case);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      navigate('/cases');
    });
    if (isAuthenticated()) fetchBalance();
  }, [slug]);

  const caseItems = caseData?.caseItems || [];
  const carouselItems = caseItems.map((ci) => ci);

  const getDropRates = () => {
    const rates = {};
    caseItems.forEach((ci) => {
      const r = ci.skin?.rarity;
      rates[r] = (rates[r] || 0) + ci.dropRate;
    });
    return RARITY_DROP_RATES.map((dr) => ({
      ...dr,
      rate: rates[dr.rarity] || dr.rate,
    })).filter((dr) => dr.rate > 0);
  };

  const handleOpen = async () => {
    if (!isAuthenticated()) {
      setShowAuth(true);
      return;
    }
    if (balance < caseData.price) {
      setError('Insufficient balance. Please deposit funds.');
      return;
    }
    setError('');
    setShowWin(false);
    setWonSkin(null);

    try {
      const { data } = await caseService.openCase(slug);
      const won = data.data.won;
      const idx = caseItems.findIndex((ci) => ci.skin.id === won.id);
      setWonIndex(idx >= 0 ? idx : 0);
      setWonSkin(won);
      setBalance(data.data.balance);
      setIsSpinning(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to open case');
    }
  };

  const handleSpinComplete = () => {
    setIsSpinning(false);
    setShowWin(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20">
        <div className="w-8 h-8 border-2 border-loot-border border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const titleParts = caseData?.name?.replace(' Case', '').split(' & ') || ['DREAMS', 'NIGHTMARES'];

  return (
    <div className="min-h-screen pb-20">
      <Header showBack backTo="/cases" />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide uppercase">
            {titleParts.join(' & ')}
          </h1>
          <p className="text-loot-muted text-sm mt-1 uppercase tracking-widest">Premium Collection Case</p>
        </div>

        {/* Carousel */}
        <div className="mb-6">
          <CaseCarousel
            items={carouselItems}
            isSpinning={isSpinning}
            wonIndex={wonIndex}
            onSpinComplete={handleSpinComplete}
          />
        </div>

        {/* Open Button */}
        <div className="text-center mb-4">
          {error && (
            <p className="text-red-400 text-sm mb-3">
              {error}
              {error.includes('balance') && (
                <Link to="/deposit" className="underline ml-1">Deposit</Link>
              )}
            </p>
          )}
          <button
            onClick={handleOpen}
            disabled={isSpinning}
            className="btn-loot-primary text-base px-12 py-3.5 min-w-[200px]"
          >
            {isSpinning ? 'Opening...' : `OPEN FOR $${parseFloat(caseData?.price || 0).toFixed(2)}`}
          </button>
        </div>

        {/* Drop rates */}
        <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
          {getDropRates().map((dr) => (
            <div key={dr.rarity} className="flex items-center gap-1.5 text-xs text-loot-muted">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dr.color }} />
              <span>{dr.rate}%</span>
            </div>
          ))}
        </div>

        {/* Case Contents */}
        <div className="border-t border-loot-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold uppercase tracking-wider text-sm">Case Contents</h2>
            <span className="text-loot-muted text-xs">{caseItems.length} ITEMS</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            <CaseItemCard isSpecial />
            {caseItems.map((ci) => (
              <CaseItemCard key={ci.id} skin={ci.skin} />
            ))}
          </div>
        </div>
      </div>

      {/* Win Modal */}
      {showWin && wonSkin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowWin(false)} />
          <div className="relative bg-loot-card border border-loot-gold/30 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <p className="text-loot-gold text-sm font-bold uppercase tracking-wider mb-2">You Won!</p>
            <h3 className="text-xl font-bold mb-1">{wonSkin.name}</h3>
            <p className="text-loot-gold font-bold text-2xl mb-6">${parseFloat(wonSkin.price).toFixed(2)}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowWin(false)} className="btn-loot-secondary flex-1 text-sm">
                Open Again
              </button>
              <Link to="/inventory" className="btn-loot-primary flex-1 text-sm text-center">
                Inventory
              </Link>
            </div>
          </div>
        </div>
      )}

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      <BottomNav />
    </div>
  );
}
