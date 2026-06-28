import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { caseService } from '../../services/marketplace.service';

const RARITY_COLORS = {
  CONSUMER:        '#b0b0b0',
  INDUSTRIAL:      '#5e98d9',
  MIL_SPEC:        '#4b69ff',
  RESTRICTED:      '#8847ff',
  CLASSIFIED:      '#d32ce6',
  COVERT:          '#eb4b4b',
  CONTRABAND:      '#e4ae39',
  EXTRAORDINARY:   '#f5d930',
};

export default function SkinsMonkeyCaseCard({ caseData, onOpenClick }) {
  const navigate = useNavigate();
  const [skins, setSkins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredSkinIdx, setHoveredSkinIdx] = useState(null);

  useEffect(() => {
    // In a real scenario, you'd fetch case items
    // For now, we'll simulate with random skins
    setSkins([
      { name: 'AK-47 | Redline', rarity: 'CLASSIFIED' },
      { name: 'AWP | Asiimov', rarity: 'COVERT' },
      { name: 'M4A4 | Neo-Noir', rarity: 'COVERT' },
      { name: 'Glock-18 | Fade', rarity: 'CLASSIFIED' },
      { name: 'Desert Eagle | Blaze', rarity: 'COVERT' },
      { name: 'MP9 | Wild Lily', rarity: 'RESTRICTED' },
    ]);
    setLoading(false);
  }, [caseData?.id]);

  const handleOpenClick = () => {
    if (onOpenClick) {
      onOpenClick(caseData);
    } else {
      navigate(`/cases/${caseData.slug}/open`);
    }
  };

  return (
    <div className="w-full max-w-sm bg-[#0d1117] rounded-2xl border border-[#1e2530] overflow-hidden hover:shadow-2xl transition-all duration-300 group">
      {/* Header with case name and price */}
      <div className="bg-gradient-to-r from-[#141921] to-[#0d1117] p-5 border-b border-[#1e2530]">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors truncate">
              {caseData?.name || 'Unknown Case'}
            </h3>
            {caseData?.isFeatured && (
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-1 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                ★ FEATURED
              </span>
            )}
          </div>
          <div className="text-right shrink-0 ml-2">
            <div className="text-2xl font-bold text-yellow-400">
              ${parseFloat(caseData?.price || 0).toFixed(2)}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 line-clamp-2">{caseData?.description}</p>
      </div>

      {/* Case Preview with Icon */}
      <div className="relative h-40 bg-gradient-to-b from-[#1a1f26] to-[#141921] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-yellow-400 via-purple-400 to-blue-400" />
        
        {/* Case illustration/icon */}
        <div className="relative z-10 text-center">
          <svg className="w-16 h-16 mx-auto mb-2 text-yellow-400 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375M12 9.75v.75m0 2.25v.75m0 2.25v.75" />
          </svg>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
            {skins.length || '30+'} SKINS
          </p>
        </div>
      </div>

      {/* Skins carousel */}
      <div className="p-4 border-t border-[#1e2530] overflow-hidden">
        <p className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">CASE CONTENTS</p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {skins.map((skin, idx) => {
            const color = RARITY_COLORS[skin.rarity] || '#b0b0b0';
            return (
              <div
                key={idx}
                className="shrink-0 w-14 h-14 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 relative group/skin"
                style={{ borderColor: `${color}55`, backgroundColor: `${color}11` }}
                onMouseEnter={() => setHoveredSkinIdx(idx)}
                onMouseLeave={() => setHoveredSkinIdx(null)}
              >
                <div
                  className="w-2 h-2 rounded-full mb-1"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[8px] font-bold text-center px-1 leading-tight line-clamp-2" style={{ color }}>
                  {skin.rarity?.replace(/_/g, ' ').slice(0, 3) || 'RNG'}
                </span>

                {/* Tooltip */}
                {hoveredSkinIdx === idx && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-[#141921] border border-[#1e2530] rounded-lg p-2 whitespace-nowrap text-[10px] text-white pointer-events-none">
                    {skin.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Open button */}
      <div className="p-4 border-t border-[#1e2530] bg-gradient-to-r from-[#141921] to-[#0d1117]">
        <button
          onClick={handleOpenClick}
          className="w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-200 bg-yellow-400 text-black hover:bg-yellow-300 active:scale-95 flex items-center justify-center gap-2 group/btn"
        >
          <span>OPEN FOR ${parseFloat(caseData?.price || 0).toFixed(2)}</span>
          <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
        <p className="text-center text-[10px] text-gray-500 mt-2">
          {skins.length} skins • {skins.filter(s => s.rarity === 'COVERT').length} ★ rares
        </p>
      </div>
    </div>
  );
}
