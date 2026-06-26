/**
 * CS2 skin visual helpers - rarity colors and weapon placeholders
 */

export const RARITY_COLORS = {
  CONSUMER: { bar: 'bg-rarity-consumer', glow: '', text: 'text-rarity-consumer', label: 'Consumer' },
  INDUSTRIAL: { bar: 'bg-rarity-industrial', glow: '', text: 'text-rarity-industrial', label: 'Industrial' },
  MIL_SPEC: { bar: 'rarity-bar-mil', glow: 'rarity-glow-mil', text: 'text-rarity-mil', label: 'Mil-Spec' },
  RESTRICTED: { bar: 'rarity-bar-restricted', glow: 'rarity-glow-restricted', text: 'text-rarity-restricted', label: 'Restricted' },
  CLASSIFIED: { bar: 'rarity-bar-classified', glow: 'rarity-glow-classified', text: 'text-rarity-classified', label: 'Classified' },
  COVERT: { bar: 'rarity-bar-covert', glow: 'rarity-glow-covert', text: 'text-rarity-covert', label: 'Covert' },
  CONTRABAND: { bar: 'rarity-bar-gold', glow: 'rarity-glow-gold', text: 'text-rarity-gold', label: 'Contraband' },
  EXCEEDINGLY_RARE: { bar: 'rarity-bar-gold', glow: 'rarity-glow-gold', text: 'text-rarity-gold', label: 'Rare Special' },
};

export const RARITY_DROP_RATES = [
  { rarity: 'MIL_SPEC', color: '#4b69ff', rate: 79.9 },
  { rarity: 'RESTRICTED', color: '#8847ff', rate: 15.9 },
  { rarity: 'CLASSIFIED', color: '#d32ce6', rate: 3.2 },
  { rarity: 'COVERT', color: '#eb4b4b', rate: 0.6 },
  { rarity: 'EXCEEDINGLY_RARE', color: '#f5c518', rate: 0.2 },
];

export const getRarityStyle = (rarity) => RARITY_COLORS[rarity] || RARITY_COLORS.MIL_SPEC;

export const getSkinDisplayName = (skin) => {
  if (!skin) return '';
  if (skin.name?.includes('|')) {
    const parts = skin.name.split('|');
    return { weapon: parts[0].trim(), skinName: parts[1].trim() };
  }
  return { weapon: skin.weapon || '', skinName: skin.name || '' };
};

const WEAPON_GRADIENTS = {
  'AK-47': 'from-red-900/40 via-orange-900/20 to-transparent',
  'AWP': 'from-green-900/40 via-emerald-900/20 to-transparent',
  'M4A4': 'from-blue-900/40 via-indigo-900/20 to-transparent',
  'M4A1-S': 'from-cyan-900/40 via-blue-900/20 to-transparent',
  'Glock-18': 'from-yellow-900/40 via-amber-900/20 to-transparent',
  'USP-S': 'from-purple-900/40 via-violet-900/20 to-transparent',
  'Karambit': 'from-pink-900/40 via-rose-900/20 to-transparent',
  'Butterfly Knife': 'from-fuchsia-900/40 via-pink-900/20 to-transparent',
  'Bowie Knife': 'from-orange-900/40 via-yellow-900/20 to-transparent',
  default: 'from-gray-800/40 via-gray-900/20 to-transparent',
};

export const getWeaponGradient = (weapon) => WEAPON_GRADIENTS[weapon] || WEAPON_GRADIENTS.default;

export const getSkinImage = (skin) => {
  if (!skin) return null;
  const images = typeof skin.images === 'string' ? JSON.parse(skin.images || '[]') : skin.images;
  if (images?.length > 0) return images[0];
  return null;
};
