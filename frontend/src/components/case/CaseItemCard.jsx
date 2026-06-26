import { getRarityStyle, getSkinDisplayName, getWeaponGradient, getSkinImage } from '../../utils/skinVisuals';

export default function CaseItemCard({ skin, isSpecial = false, compact = false }) {
  if (isSpecial) {
    return (
      <div className={`loot-card flex flex-col items-center justify-center ${compact ? 'w-24 h-24' : 'aspect-square'} border-loot-gold/30 bg-gradient-to-b from-yellow-900/20 to-loot-card`}>
        <span className="text-loot-gold text-2xl">★</span>
        <span className="text-loot-gold text-[10px] font-bold mt-1 text-center leading-tight">GLOVES / KNIFE</span>
      </div>
    );
  }

  const rarity = getRarityStyle(skin?.rarity);
  const { weapon, skinName } = getSkinDisplayName(skin);
  const image = getSkinImage(skin);
  const gradient = getWeaponGradient(skin?.weapon);

  return (
    <div className={`loot-card overflow-hidden flex flex-col ${compact ? 'w-24' : ''} ${rarity.glow}`}>
      <div className={`relative ${compact ? 'h-20' : 'aspect-square'} bg-loot-surface flex items-center justify-center overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-b ${gradient}`} />
        {image ? (
          <img src={image} alt={skin?.name} className="relative z-10 object-contain w-full h-full p-3" />
        ) : (
          <div className="relative z-10 text-center px-2">
            <p className="text-[10px] text-loot-muted">{weapon}</p>
            <p className="text-xs font-semibold leading-tight">{skinName}</p>
          </div>
        )}
      </div>
      <div className={`h-0.5 ${rarity.bar}`} />
      {!compact && (
        <div className="p-2 text-center">
          <p className="text-[10px] text-loot-muted truncate">{weapon}</p>
          <p className="text-xs font-medium truncate">{skinName}</p>
        </div>
      )}
    </div>
  );
}
