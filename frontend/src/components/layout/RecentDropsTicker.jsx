import { useEffect, useState } from 'react';
import { caseService } from '../../services/marketplace.service';
import { getSkinDisplayName } from '../../utils/skinVisuals';

export default function RecentDropsTicker() {
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    caseService.getRecentDrops(12).then(({ data }) => {
      setDrops(data.data.drops || []);
    }).catch(() => {});
  }, []);

  if (!drops.length) return null;

  return (
    <div className="bg-loot-surface border-b border-loot-border overflow-hidden">
      <div className="flex animate-marquee gap-8 py-2 px-4">
        {[...drops, ...drops].map((drop, i) => {
          const { weapon, skinName } = getSkinDisplayName(drop.skin);
          return (
            <div key={`${drop.id}-${i}`} className="flex items-center gap-2 shrink-0 text-xs">
              <div className="w-6 h-6 rounded bg-loot-card border border-loot-border flex items-center justify-center">
                <span className="text-[8px] text-loot-muted">{weapon?.slice(0, 3)}</span>
              </div>
              <span className="text-loot-muted">{weapon}</span>
              <span className="text-white font-medium">{skinName}</span>
              <span className="text-loot-gold font-semibold">${parseFloat(drop.price).toFixed(2)}</span>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
