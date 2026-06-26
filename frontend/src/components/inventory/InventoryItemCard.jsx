import { getRarityStyle, getSkinDisplayName, getWeaponGradient, getSkinImage } from '../../utils/skinVisuals';

export default function InventoryItemCard({ item, onSell, selected, onSelect }) {
  const skin = item.skin;
  const rarity = getRarityStyle(skin?.rarity);
  const { weapon, skinName } = getSkinDisplayName(skin);
  const gradient = getWeaponGradient(skin?.weapon);
  const image = getSkinImage(skin);

  return (
    <div
      className={`loot-card overflow-hidden cursor-pointer transition-all hover:border-loot-muted ${selected ? 'border-loot-gold' : ''} ${rarity.glow}`}
      onClick={() => onSelect?.(item)}
    >
      <div className="relative aspect-square bg-loot-surface flex items-center justify-center overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-b ${gradient}`} />
        {image ? (
          <img src={image} alt={skin?.name} className="relative z-10 object-contain w-full h-full p-3" />
        ) : (
          <div className="relative z-10 text-center px-3">
            <p className="text-[10px] text-loot-muted">{weapon}</p>
            <p className="text-xs font-semibold leading-tight">{skinName}</p>
          </div>
        )}
        {onSell && (
          <button
            onClick={(e) => { e.stopPropagation(); onSell(item); }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-loot-card border border-loot-border flex items-center justify-center text-loot-muted hover:text-white transition-colors z-20"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}
        <div className="absolute bottom-2 left-2 right-2 text-center z-10 bg-black/30 text-white text-[10px] uppercase tracking-[0.1em] py-1 rounded">
          ${parseFloat(skin?.price || 0).toFixed(2)}
        </div>
      </div>
      <div className={`h-0.5 ${rarity.bar}`} />
    </div>
  );
}
