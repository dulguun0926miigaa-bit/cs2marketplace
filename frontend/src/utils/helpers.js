/**
 * Format price to 2 decimal places
 */
export const formatPrice = (price) => {
  return `$${parseFloat(price || 0).toFixed(2)}`;
};

/**
 * Format rarity string for display
 */
export const formatRarity = (rarity) => {
  if (!rarity) return '';
  return rarity.replace(/_/g, ' ');
};

/**
 * Format exterior string for display
 */
export const formatExterior = (exterior) => {
  if (!exterior) return '';
  return exterior.replace(/_/g, ' ');
};

/**
 * Rarity color classes
 */
export const RARITY_COLORS = {
  CONSUMER: 'text-gray-400 bg-gray-800',
  INDUSTRIAL: 'text-blue-400 bg-blue-900/30',
  MIL_SPEC: 'text-blue-500 bg-blue-800/30',
  RESTRICTED: 'text-purple-400 bg-purple-900/30',
  CLASSIFIED: 'text-pink-400 bg-pink-900/30',
  COVERT: 'text-red-400 bg-red-900/30',
  CONTRABAND: 'text-yellow-400 bg-yellow-900/30',
};

/**
 * Order status colors
 */
export const ORDER_STATUS_COLORS = {
  PENDING: 'text-yellow-400 bg-yellow-900/20 border-yellow-800',
  PROCESSING: 'text-blue-400 bg-blue-900/20 border-blue-800',
  COMPLETED: 'text-green-400 bg-green-900/20 border-green-800',
  CANCELLED: 'text-red-400 bg-red-900/20 border-red-800',
  REFUNDED: 'text-gray-400 bg-gray-800 border-gray-700',
};

/**
 * Truncate long text
 */
export const truncate = (str, n = 50) => {
  if (!str) return '';
  return str.length > n ? `${str.slice(0, n)}...` : str;
};

/**
 * Format date
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};
