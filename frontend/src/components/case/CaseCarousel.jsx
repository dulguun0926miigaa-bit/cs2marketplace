import { useEffect, useRef, useState, useCallback } from 'react';
import { getRarityStyle, getSkinDisplayName, getWeaponGradient, getSkinImage } from '../../utils/skinVisuals';

const ITEM_W   = 112; // px per item (including gap)
const GAP      = 6;
const CARD_W   = ITEM_W - GAP;
const VISIBLE  = 7;   // visible slots
const REPEATS  = 40;  // repeat pool for smooth scroll

const RARITY_BORDER = {
  CONSUMER:        'border-gray-600',
  INDUSTRIAL:      'border-blue-500',
  MIL_SPEC:        'border-blue-600',
  RESTRICTED:      'border-purple-500',
  CLASSIFIED:      'border-pink-500',
  COVERT:          'border-red-500',
  CONTRABAND:      'border-yellow-400',
  EXCEEDINGLY_RARE:'border-yellow-400',
  EXTRAORDINARY:   'border-yellow-300',
};

export default function CaseCarousel({ items, isSpinning, wonIndex, onSpinComplete, wonSkin }) {
  const rafRef     = useRef(null);
  const [offset, setOffset]           = useState(0);
  const [displayItems, setDisplayItems] = useState([]);
  const [skipped, setSkipped]         = useState(false);
  const targetOffsetRef               = useRef(0);

  // Build repeated pool
  useEffect(() => {
    if (!items?.length) return;
    const pool = [];
    for (let i = 0; i < REPEATS; i++) pool.push(...items);
    setDisplayItems(pool);
  }, [items]);

  // Easing: ease-out quint
  const easeOut = (t) => 1 - Math.pow(1 - t, 5);

  const startSpin = useCallback(() => {
    if (!displayItems.length) return;
    cancelAnimationFrame(rafRef.current);

    // Land on center-of-visible at the winning item in the middle section
    const mid          = Math.floor(REPEATS / 2);
    const winPos       = mid * items.length + (wonIndex >= 0 ? wonIndex : 0);
    const centerOffset = (VISIBLE * ITEM_W) / 2 - ITEM_W / 2;
    const target       = -(winPos * ITEM_W - centerOffset);
    targetOffsetRef.current = target;

    const DURATION  = 6000;
    const startTime = performance.now();
    const startOff  = offset;

    const tick = (now) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased    = easeOut(progress);
      setOffset(startOff + (target - startOff) * eased);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setOffset(target);
        onSpinComplete?.();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [displayItems, wonIndex, items, offset, onSpinComplete]);

  useEffect(() => {
    if (isSpinning) startSpin();
    return () => cancelAnimationFrame(rafRef.current);
  }, [isSpinning]);

  const handleSkip = () => {
    if (!isSpinning || skipped) return;
    cancelAnimationFrame(rafRef.current);
    setSkipped(true);
    setOffset(targetOffsetRef.current);
    onSpinComplete?.();
  };

  return (
    <div className="relative select-none">
      {/* Track wrapper */}
      <div
        className="relative overflow-hidden rounded-xl bg-[#0d1117] border border-[#1e2530]"
        style={{ height: 130 }}
      >
        {/* Left/right fade */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0d1117] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0d1117] to-transparent z-10 pointer-events-none" />

        {/* Center marker */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-yellow-400 z-20 pointer-events-none">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-400 rotate-45" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-400 rotate-45" />
        </div>

        {/* Scrolling track */}
        <div
          className="absolute inset-y-0 flex items-center"
          style={{
            transform:  `translateX(${offset + (VISIBLE * ITEM_W) / 2 - ITEM_W / 2}px)`,
            width:       displayItems.length * ITEM_W,
            willChange: 'transform',
          }}
        >
          {displayItems.map((item, i) => {
            const skin    = item.skin || item;
            const rarity  = getRarityStyle(skin?.rarity);
            const { weapon, skinName } = getSkinDisplayName(skin);
            const image   = getSkinImage(skin);
            const gradient = getWeaponGradient(skin?.weapon);
            const border  = RARITY_BORDER[skin?.rarity] || 'border-gray-600';
            const isGold  = skin?.rarity === 'EXCEEDINGLY_RARE' || skin?.rarity === 'CONTRABAND' || skin?.rarity === 'EXTRAORDINARY';

            return (
              <div key={i} className="shrink-0 px-[3px]" style={{ width: ITEM_W }}>
                <div className={`relative h-[118px] rounded-lg border-2 ${border} overflow-hidden bg-[#141921]`}>
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${gradient} opacity-60`} />

                  {/* Rarity top stripe */}
                  <div className={`absolute top-0 inset-x-0 h-0.5 ${rarity.bar}`} />

                  {/* Content */}
                  {image ? (
                    <img
                      src={image}
                      alt={skin?.name}
                      className="relative z-10 w-full h-[80px] object-contain p-2 drop-shadow-lg"
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative z-10 h-[80px] flex flex-col items-center justify-center px-1">
                      {isGold ? (
                        <span className="text-yellow-400 text-2xl">★</span>
                      ) : (
                        <div className="text-center">
                          <p className="text-[9px] text-gray-400">{weapon}</p>
                          <p className="text-[9px] font-semibold leading-tight text-white">{skinName}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Name strip at bottom */}
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 px-1.5 py-1">
                    <p className="text-[8px] text-gray-400 truncate leading-none">{weapon}</p>
                    <p className="text-[9px] font-semibold text-white truncate leading-tight">{skinName}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skip button */}
      {isSpinning && !skipped && (
        <div className="flex justify-center mt-3">
          <button
            onClick={handleSkip}
            className="text-xs text-gray-500 hover:text-white border border-[#1e2530] hover:border-gray-500 px-4 py-1.5 rounded-lg transition-colors"
          >
            Skip animation
          </button>
        </div>
      )}
    </div>
  );
}
