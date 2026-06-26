import { useEffect, useRef, useState } from 'react';
import { getRarityStyle, getSkinDisplayName, getWeaponGradient } from '../../utils/skinVisuals';

const ITEM_WIDTH = 100;
const VISIBLE_ITEMS = 7;

export default function CaseCarousel({ items, isSpinning, wonIndex, onSpinComplete }) {
  const trackRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [displayItems, setDisplayItems] = useState([]);

  useEffect(() => {
    if (!items?.length) return;
    const repeated = [];
    for (let i = 0; i < 30; i++) {
      repeated.push(...items);
    }
    setDisplayItems(repeated);
  }, [items]);

  useEffect(() => {
    if (!isSpinning || !displayItems.length) return;

    const winPos = 20 * items.length + wonIndex;
    const targetOffset = -(winPos * ITEM_WIDTH - (VISIBLE_ITEMS * ITEM_WIDTH) / 2);

    const duration = 5000;
    const startTime = Date.now();
    const startOffset = offset;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const currentOffset = startOffset + (targetOffset - startOffset) * eased;
      setOffset(currentOffset);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onSpinComplete?.();
      }
    };

    requestAnimationFrame(animate);
  }, [isSpinning, wonIndex]);

  return (
    <div className="relative overflow-hidden rounded-xl bg-loot-surface border border-loot-border">
      {/* Center indicator */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-loot-gold z-20 -translate-x-1/2">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-loot-gold animate-pulse-glow" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-loot-gold animate-pulse-glow" />
      </div>

      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-loot-surface to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-loot-surface to-transparent z-10" />

      <div
        ref={trackRef}
        className="flex py-4 transition-none"
        style={{ transform: `translateX(${offset}px)`, width: displayItems.length * ITEM_WIDTH }}
      >
        {displayItems.map((item, i) => {
          const skin = item.skin || item;
          const rarity = getRarityStyle(skin?.rarity);
          const { weapon, skinName } = getSkinDisplayName(skin);
          const isGold = skin?.rarity === 'EXCEEDINGLY_RARE' || skin?.rarity === 'CONTRABAND';
          const gradient = getWeaponGradient(skin?.weapon);

          return (
            <div
              key={i}
              className="shrink-0 mx-1"
              style={{ width: ITEM_WIDTH - 8 }}
            >
              <div className={`loot-card overflow-hidden h-24 ${rarity.glow} ${isGold ? 'border-loot-gold/40' : ''}`}>
                <div className="h-full flex flex-col">
                  <div className={`flex-1 relative flex items-center justify-center bg-loot-card overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-b ${gradient}`} />
                    {isGold ? (
                      <div className="relative z-10 text-center">
                        <span className="text-loot-gold text-xl">?</span>
                        <p className="text-[8px] text-loot-gold font-bold mt-0.5">★ SPECIAL</p>
                      </div>
                    ) : (
                      <div className="relative z-10 text-center px-1">
                        <p className="text-[9px] text-loot-muted">{weapon}</p>
                        <p className="text-[10px] font-semibold leading-tight">{skinName}</p>
                      </div>
                    )}
                  </div>
                  <div className={`h-0.5 ${rarity.bar}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
