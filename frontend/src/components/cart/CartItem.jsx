import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';

export default function CartItem({ item, onUpdate, onRemove }) {
  const skin = item.skin;
  const { weapon, skinName } = skin?.name?.includes('|')
    ? { weapon: skin.name.split('|')[0].trim(), skinName: skin.name.split('|')[1].trim() }
    : { weapon: skin?.weapon, skinName: skin?.name };

  return (
    <div className="flex gap-3 items-center p-3 bg-loot-surface rounded-xl border border-loot-border">
      <div className="w-16 h-16 rounded-lg bg-loot-card border border-loot-border flex items-center justify-center shrink-0">
        <span className="text-xs text-loot-muted font-medium">{weapon?.slice(0, 6)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-loot-muted">{weapon}</p>
        <p className="font-semibold text-sm truncate">{skinName}</p>
        <p className="text-loot-gold font-bold text-sm mt-0.5">${parseFloat(skin?.price || 0).toFixed(2)}</p>
      </div>
      <div className="flex items-center border border-loot-border rounded-lg overflow-hidden">
        <button
          onClick={() => onUpdate(item.skinId, item.quantity - 1)}
          className="px-2 py-1 hover:bg-loot-border transition-colors text-sm"
        >
          −
        </button>
        <span className="px-2 py-1 text-sm font-semibold">{item.quantity}</span>
        <button
          onClick={() => onUpdate(item.skinId, item.quantity + 1)}
          className="px-2 py-1 hover:bg-loot-border transition-colors text-sm"
        >
          +
        </button>
      </div>
      <button
        onClick={() => onRemove(item.skinId)}
        className="text-loot-muted hover:text-red-400 transition-colors p-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
