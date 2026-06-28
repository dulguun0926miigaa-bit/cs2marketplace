import { Link } from 'react-router-dom';
import { getRarityStyle, getSkinDisplayName, getWeaponGradient, getSkinImage } from '../../utils/skinVisuals';

const FALLBACK_SKIN_IMAGE = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80';

const RARITY_HEX = {
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

export default function CaseItemCard({ skin, isSpecial = false, compact = false, linkable = false }) {
  // Special "Knife/Gloves" card
  if (isSpecial) {
    return (
      <div className={`relative rounded-lg border-2 border-yellow-400/60 bg-[#141921] overflow-hidden ${compact ? 'h-24' : 'aspect-square'} flex flex-col items-center justify-center`}>
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/20 to-transparent" />
        <span className="relative z-10 text-yellow-400 text-3xl">★</span>
        <span className="relative z-10 text-yellow-400 text-[9px] font-bold mt-1 text-center leading-tight px-2">
          KNIFE<br />GLOVES
        </span>
        <div className="absolute top-0 inset-x-0 h-0.5 bg-yellow-400" />
      </div>
    );
  }

  if (!skin) return null;

  const rarity  = getRarityStyle(skin.rarity);
  const { weapon, skinName } = getSkinDisplayName(skin);
  const image   = getSkinImage(skin);
  const gradient = getWeaponGradient(skin.weapon);
  const rarityColor = RARITY_HEX[skin.rarity] || '#b0b0b0';
  const rarityLabel = skin.rarity?.replace(/_/g, ' ') || '';

  const inner = (
    <div className={`relative rounded-lg border-2 overflow-hidden bg-[#141921] group hover:-translate-y-0.5 transition-all duration-150 cursor-default ${compact ? 'h-24' : 'aspect-square'}`}
      style={{ borderColor: `${rarityColor}55` }}
    >
      {/* Gradient bg */}
      <div className={`absolute inset-0 bg-gradient-to-b ${gradient} opacity-50`} />

      {/* Top rarity stripe */}
      <div className="absolute top-0 inset-x-0 h-0.5" style={{ backgroundColor: rarityColor }} />

      {/* Image */}
      <div class
      Name={`relative z-10 flex items-center justify-center overflow-hidden ${compact ? 'h-16 p-1' : 'h-[65%] p-2 mt-1'}`}>
        <img
          src={image || FALLBACK_SKIN_IMAGE}
          alt={skin.name}
          className="w-full h-full object-cover rounded-md border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_SKIN_IMAGE;
          }}
        />
        <div className="absolute inset-x-2 bottom-2 rounded-full border border-white/10 bg-black/40 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
          {weapon}
        </div>
      </div>

      {/* Bottom name strip */}
      {!compact && (
        <div className="absolute bottom-0 inset-x-0 bg-black/70 px-2 py-1.5 text-center">
          <p className="text-[8px] uppercase tracking-wide truncate" style={{ color: rarityColor }}>{rarityLabel}</p>
          <p className="text-[9px] text-gray-300 truncate">{weapon}</p>
          <p className="text-[9px] font-semibold text-white truncate">{skinName}</p>
          {skin.price && (
            <p className="text-[9px] text-yellow-400 font-bold mt-0.5">${parseFloat(skin.price).toFixed(2)}</p>
          )}
        </div>
      )}
    </div>
  );

  if (linkable && skin.id) {
    return <Link to={`/skins/${skin.id}`}>{inner}</Link>;
  }
  return inner;
}
