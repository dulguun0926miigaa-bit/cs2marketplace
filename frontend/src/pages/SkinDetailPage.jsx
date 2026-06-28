import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useSkinStore from '../store/skinStore';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import useWalletStore from '../store/walletStore';
import { wishlistService, orderService } from '../services/marketplace.service';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SkinCard from '../components/skin/SkinCard';
import { getSkinDisplayName } from '../utils/skinVisuals';

const RARITY_COLORS = {
  CONSUMER: 'text-gray-400', INDUSTRIAL: 'text-blue-400', MIL_SPEC: 'text-blue-500',
  RESTRICTED: 'text-purple-400', CLASSIFIED: 'text-pink-400', COVERT: 'text-red-400', CONTRABAND: 'text-yellow-400',
};

export default function SkinDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedSkin: skin, fetchSkinById, isLoading } = useSkinStore();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { balance, fetchBalance } = useWalletStore();
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState('');
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    fetchSkinById(parseInt(id, 10));
    if (isAuthenticated()) fetchBalance();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    const result = await addItem(skin.id, qty);
    setMsg(result.success ? 'Added to cart!' : result.message);
    setTimeout(() => setMsg(''), 2500);
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    setBuying(true);
    try {
      // Fully await addItem (which internally awaits fetchCart) before checkout
      const addResult = await addItem(skin.id, qty);
      if (!addResult.success) {
        setMsg(addResult.message || 'Cart-д нэмэхэд алдаа гарлаа');
        return;
      }
      // Check balance when using BALANCE method
      const skinPrice = parseFloat(skin.price) * qty;
      const currentBalance = parseFloat(balance || 0);
      if (currentBalance < skinPrice) {
        setMsg(`Данс хүрэлцэхгүй байна. Хэрэгтэй: $${skinPrice.toFixed(2)}, Үлдэгдэл: $${currentBalance.toFixed(2)}`);
        return;
      }
      const { data } = await orderService.checkout({});
      const orderId = data.data.order.id;
      await orderService.processPayment(orderId, { method: 'BALANCE' });
      setMsg(`Захиалга #${orderId} амжилттай!`);
      await fetchBalance();
      navigate(`/orders/${orderId}`);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Purchase failed');
    } finally {
      setBuying(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    try {
      const { data } = await wishlistService.toggle(skin.id);
      setMsg(data.message);
      setTimeout(() => setMsg(''), 2500);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Wishlist алдаа гарлаа');
      setTimeout(() => setMsg(''), 2500);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" className="py-40" />;
  if (!skin) return <div className="text-center py-40 text-gray-400">Skin not found</div>;

  const images = skin.images?.length > 0 ? skin.images : [null];
  const galleryImages = images.length > 1 ? images : [...images, ...images.slice(0, 2)];
  const { skinName } = getSkinDisplayName(skin);
  const canBuy = skin.stock > 0 && skin.isAvailable;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="bg-cs2-darker rounded-xl aspect-square flex items-center justify-center overflow-hidden mb-4">
            {galleryImages[selectedImg] ? (
              <img src={galleryImages[selectedImg]} alt={skin.name} className="object-contain w-full h-full p-8" />
            ) : (
              <span className="text-5xl font-bold text-cs2-accent">{skin.weapon}</span>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {galleryImages.map((img, i) => (
              <button key={i} onClick={() => setSelectedImg(i)} className={`rounded-lg border-2 overflow-hidden w-16 h-16 ${i === selectedImg ? 'border-cs2-accent' : 'border-cs2-border'}`}>
                {img ? <img src={img} alt="" className="object-contain w-full h-full p-1" /> : <span className="text-xs p-2">{skin.weapon}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-gray-400 text-sm">{skin.weapon}</p>
            <h1 className="text-3xl font-bold">{skinName}</h1>
            <div className="flex gap-2 mt-2 flex-wrap">
              <p className={`font-semibold ${RARITY_COLORS[skin.rarity]}`}>{skin.rarity?.replace(/_/g, ' ')}</p>
              {skin.isStatTrak && <span className="text-xs bg-orange-900/40 text-orange-400 px-2 py-0.5 rounded">StatTrak™</span>}
              {skin.isSouvenir && <span className="text-xs bg-yellow-900/40 text-yellow-400 px-2 py-0.5 rounded">Souvenir</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              ['Exterior', skin.exterior?.replace(/_/g, ' ')],
              ['Float', skin.float?.toFixed(6)],
              ['Float Range', `${skin.floatMin?.toFixed(2)} – ${skin.floatMax?.toFixed(2)}`],
              ['Pattern', skin.pattern || 'Standard'],
              ['Category', skin.category?.name],
              ['Collection', skin.collection?.name || '—'],
              ['Seller', skin.sellerName],
              ['Availability', skin.isAvailable && skin.stock > 0 ? 'In Stock' : 'Out of Stock'],
              ['Release Date', skin.releaseDate ? new Date(skin.releaseDate).toLocaleDateString() : '—'],
              ['Stock', skin.stock],
            ].map(([label, val]) => (
              <div key={label} className="bg-cs2-darker rounded-lg p-3">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="font-medium text-sm">{val}</p>
              </div>
            ))}
          </div>

          {skin.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-1">Description</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{skin.description}</p>
            </div>
          )}

          {skin.lore && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-1">Lore</h3>
              <p className="text-gray-400 text-sm leading-relaxed italic">{skin.lore}</p>
            </div>
          )}

          <div className="text-3xl font-bold text-cs2-accent">${parseFloat(skin.price).toFixed(2)}</div>

          {skin.inspectLink && (
            <button className="text-sm text-gray-500 hover:text-cs2-accent text-left" disabled>
              Inspect in Game (Steam link placeholder)
            </button>
          )}

          {msg && <p className="text-cs2-green text-sm font-medium">{msg}</p>}

          <div className="flex gap-3 items-center flex-wrap">
            <div className="flex items-center border border-cs2-border rounded-lg overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-cs2-border">-</button>
              <span className="px-4 py-2 font-semibold">{qty}</span>
              <button onClick={() => setQty(Math.min(skin.stock, qty + 1))} className="px-3 py-2 hover:bg-cs2-border">+</button>
            </div>
            <button onClick={handleAddToCart} disabled={!canBuy} className="btn-primary flex items-center gap-2 flex-1 justify-center min-w-[140px]">
              🛒
              {canBuy ? 'Add to Cart' : 'Sold Out'}
            </button>
            <button onClick={handleBuyNow} disabled={!canBuy || buying} className="btn-primary flex items-center gap-2 bg-cs2-green hover:bg-green-600 min-w-[140px] justify-center">
              ⚡
              {buying ? 'Processing...' : 'Buy Now'}
            </button>
            <button onClick={handleWishlist} className="btn-secondary p-3" title="Add to wishlist">
              ❤️
            </button>
          </div>

          {isAuthenticated() && (
            <p className="text-xs text-gray-500">Your balance: ${parseFloat(balance || 0).toFixed(2)}</p>
          )}
        </div>
      </div>

      {skin.marketStats && (
        <div className="mt-12 loot-card p-6">
          <h2 className="text-xl font-bold mb-4">Market Statistics</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><p className="text-2xl font-bold">{skin.marketStats.totalSales}</p><p className="text-xs text-gray-500">Total Sales</p></div>
            <div><p className="text-2xl font-bold">{skin.marketStats.caseDrops}</p><p className="text-xs text-gray-500">Case Drops</p></div>
            <div><p className="text-2xl font-bold">{skin.marketStats.wishlistCount}</p><p className="text-xs text-gray-500">Wishlisted</p></div>
          </div>
        </div>
      )}

      {skin.relatedSkins?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Related Skins</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {skin.relatedSkins.map((s) => <SkinCard key={s.id} skin={s} />)}
          </div>
        </div>
      )}

      {skin.recommendedSkins?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Recommended Skins</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {skin.recommendedSkins.map((s) => <SkinCard key={s.id} skin={s} />)}
          </div>
        </div>
      )}
    </div>
  );
}
