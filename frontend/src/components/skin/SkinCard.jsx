import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import { getRarityStyle, getSkinDisplayName, getWeaponGradient, getSkinImage } from '../../utils/skinVisuals';

export default function SkinCard({ skin }) {
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const rarity = getRarityStyle(skin.rarity);
  const { weapon, skinName } = getSkinDisplayName(skin);
  const gradient = getWeaponGradient(skin.weapon);
  const image = getSkinImage(skin);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) { window.location.href = '/login'; return; }
    await addItem(skin.id, 1);
  };

  return (
    <Link to={`/skins/${skin.id}`} className={`loot-card overflow-hidden hover:border-loot-muted transition-all group ${rarity.glow}`}>
      <div className="relative aspect-square bg-loot-surface flex items-center justify-center overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-b ${gradient}`} />
        {image && (
          <img src={image} alt={skin.name} className="relative z-10 w-full h-full object-contain p-5 drop-shadow-2xl" />
        )}
        <div className={`relative z-10 text-center px-3 ${image ? 'absolute bottom-3 left-0 right-0 bg-black/35 py-2 backdrop-blur-sm' : ''}`}>
          <p className="text-xs text-loot-muted">{weapon}</p>
          <p className="text-sm font-semibold">{skinName}</p>
          {skin.description && (
            <p className="mt-1 text-[11px] text-loot-muted line-clamp-2">{skin.description}</p>
          )}
        </div>
        <span className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded ${rarity.bar} text-white`}>
          {skin.rarity?.replace(/_/g, ' ')}
        </span>
      </div>
      <div className={`h-0.5 ${rarity.bar}`} />
      <div className="p-3 flex items-center justify-between">
        <span className="text-loot-gold font-bold">${parseFloat(skin.price).toFixed(2)}</span>
        <button
          onClick={handleAddToCart}
          disabled={!skin.isAvailable || skin.stock === 0}
          className="bg-loot-accent hover:bg-white text-black text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 disabled:opacity-40 transition-colors"
        >
          🛒
          {skin.stock === 0 ? 'Дууссан' : 'Нэмэх'}
        </button>
      </div>
    </Link>
  );
}
