/**
 * Comprehensive CS2 skin database for seeding
 * Covers all major weapons and popular skins across all rarity tiers
 */

const EXTERIORS = ['FACTORY_NEW', 'MINIMAL_WEAR', 'FIELD_TESTED', 'WELL_WORN', 'BATTLE_SCARRED'];
const RARITIES = {
  CONSUMER: 'CONSUMER',
  INDUSTRIAL: 'INDUSTRIAL',
  MIL_SPEC: 'MIL_SPEC',
  RESTRICTED: 'RESTRICTED',
  CLASSIFIED: 'CLASSIFIED',
  COVERT: 'COVERT',
  CONTRABAND: 'CONTRABAND',
  EXCEEDINGLY_RARE: 'EXCEEDINGLY_RARE',
};

const priceByRarity = {
  CONSUMER: [0.05, 0.15],
  INDUSTRIAL: [0.20, 0.80],
  MIL_SPEC: [1.0, 5.0],
  RESTRICTED: [5.0, 25.0],
  CLASSIFIED: [25.0, 120.0],
  COVERT: [80.0, 800.0],
  CONTRABAND: [500.0, 5000.0],
  EXCEEDINGLY_RARE: [200.0, 3000.0],
};

const randomInRange = (min, max) => min + Math.random() * (max - min);
const randomExterior = () => EXTERIORS[Math.floor(Math.random() * EXTERIORS.length)];
const randomFloat = () => Math.round(Math.random() * 10000) / 10000;

const rarityLabelsMn = {
  CONSUMER: 'энгийн',
  INDUSTRIAL: 'үйлдвэрийн',
  MIL_SPEC: 'цэргийн',
  RESTRICTED: 'хязгаарлагдмал',
  CLASSIFIED: 'нууц',
  COVERT: 'далд',
  CONTRABAND: 'хууль бус ховор',
  EXCEEDINGLY_RARE: 'онцгой ховор',
};

const rarityPalettes = {
  CONSUMER: ['#6b7280', '#111827'],
  INDUSTRIAL: ['#5e98d9', '#0f172a'],
  MIL_SPEC: ['#4b69ff', '#111827'],
  RESTRICTED: ['#8847ff', '#1f1235'],
  CLASSIFIED: ['#d32ce6', '#250d2c'],
  COVERT: ['#eb4b4b', '#2b0b0b'],
  CONTRABAND: ['#f5c518', '#2f2300'],
  EXCEEDINGLY_RARE: ['#f5c518', '#161616'],
};

const svgText = (value) => String(value).replace(/[&<>"]/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
}[char]));

const buildSkinImage = (weapon, skinName, rarity) => {
  const [accent, bg] = rarityPalettes[rarity] || rarityPalettes.MIL_SPEC;
  const shortWeapon = weapon.length > 16 ? `${weapon.slice(0, 14)}...` : weapon;
  const shortSkin = skinName.length > 24 ? `${skinName.slice(0, 22)}...` : skinName;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${bg}"/><stop offset="1" stop-color="#030712"/></linearGradient>
<linearGradient id="blade" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${accent}"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="24" stdDeviation="18" flood-color="#000" flood-opacity=".55"/></filter>
</defs>
<rect width="640" height="480" rx="32" fill="url(#bg)"/>
<circle cx="508" cy="88" r="124" fill="${accent}" opacity=".14"/>
<circle cx="126" cy="398" r="150" fill="${accent}" opacity=".1"/>
<g filter="url(#shadow)" transform="rotate(-12 320 240)">
<rect x="132" y="218" width="330" height="46" rx="14" fill="url(#blade)"/>
<rect x="428" y="202" width="94" height="78" rx="18" fill="#111827" stroke="${accent}" stroke-width="8"/>
<rect x="96" y="231" width="70" height="22" rx="11" fill="#d1d5db"/>
<rect x="238" y="187" width="128" height="28" rx="12" fill="${accent}" opacity=".9"/>
<rect x="276" y="264" width="104" height="38" rx="14" fill="#020617"/>
</g>
<text x="40" y="64" fill="#f9fafb" font-family="Arial, sans-serif" font-size="30" font-weight="700">${svgText(shortWeapon)}</text>
<text x="40" y="104" fill="${accent}" font-family="Arial, sans-serif" font-size="42" font-weight="800">${svgText(shortSkin)}</text>
<text x="40" y="436" fill="#d1d5db" font-family="Arial, sans-serif" font-size="22">${svgText(rarityLabelsMn[rarity] || rarity)}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const buildDescription = (weapon, skinName, rarity, price) =>
  `${weapon} | ${skinName} нь CS2-ийн ${rarityLabelsMn[rarity] || rarity} зэрэглэлийн skin. Дөк, Ами, Чочироо 3ийн дэлгүүр дээр зурагтай, тайлбартай, $${Number(price).toFixed(2)} үнэтэй байна.`;

const skinCollections = {
  rifles: {
    'AK-47': [
      { name: 'Redline', rarity: 'CLASSIFIED', price: 45.99 },
      { name: 'Vulcan', rarity: 'COVERT', price: 199.99 },
      { name: 'Fire Serpent', rarity: 'COVERT', price: 850.00 },
      { name: 'Asiimov', rarity: 'COVERT', price: 120.00 },
      { name: 'Nightwish', rarity: 'COVERT', price: 95.00 },
      { name: 'Head Shot', rarity: 'CLASSIFIED', price: 35.00 },
      { name: 'Neon Rider', rarity: 'CLASSIFIED', price: 42.00 },
      { name: 'Slate', rarity: 'MIL_SPEC', price: 3.50 },
      { name: 'Ice Coaled', rarity: 'RESTRICTED', price: 12.00 },
      { name: 'Legion of Anubis', rarity: 'CLASSIFIED', price: 28.00 },
      { name: 'Aquamarine Revenge', rarity: 'COVERT', price: 65.00 },
      { name: 'Bloodsport', rarity: 'COVERT', price: 110.00 },
      { name: 'Gold Arabesque', rarity: 'COVERT', price: 2200.00 },
      { name: 'Panthera onca', rarity: 'RESTRICTED', price: 8.50 },
      { name: 'Point Disarray', rarity: 'CLASSIFIED', price: 22.00 },
    ],
    'AWP': [
      { name: 'Dragon Lore', rarity: 'COVERT', price: 4999.99 },
      { name: 'Asiimov', rarity: 'COVERT', price: 89.99 },
      { name: 'Hyper Beast', rarity: 'COVERT', price: 55.00 },
      { name: 'Gungnir', rarity: 'COVERT', price: 8500.00 },
      { name: 'Fade', rarity: 'COVERT', price: 1200.00 },
      { name: 'Chromatic Aberration', rarity: 'CLASSIFIED', price: 18.00 },
      { name: 'Duality', rarity: 'CLASSIFIED', price: 12.00 },
      { name: 'Exoskeleton', rarity: 'RESTRICTED', price: 6.50 },
      { name: 'Mortis', rarity: 'RESTRICTED', price: 5.00 },
      { name: 'Phobos', rarity: 'MIL_SPEC', price: 2.50 },
      { name: 'Wildfire', rarity: 'COVERT', price: 75.00 },
      { name: 'Containment Breach', rarity: 'COVERT', price: 95.00 },
      { name: 'Printstream', rarity: 'COVERT', price: 180.00 },
    ],
    'M4A4': [
      { name: 'Howl', rarity: 'CONTRABAND', price: 3500.00 },
      { name: 'Asiimov', rarity: 'COVERT', price: 65.00 },
      { name: 'The Emperor', rarity: 'COVERT', price: 85.00 },
      { name: 'Temukau', rarity: 'COVERT', price: 55.00 },
      { name: 'In Living Color', rarity: 'CLASSIFIED', price: 22.00 },
      { name: 'Spider Lily', rarity: 'RESTRICTED', price: 8.00 },
      { name: 'Desert-Strike', rarity: 'MIL_SPEC', price: 3.00 },
      { name: 'Hellfire', rarity: 'CLASSIFIED', price: 35.00 },
      { name: 'Neo-Noir', rarity: 'COVERT', price: 48.00 },
      { name: 'Poseidon', rarity: 'COVERT', price: 420.00 },
    ],
    'M4A1-S': [
      { name: 'Hyper Beast', rarity: 'COVERT', price: 89.99 },
      { name: 'Printstream', rarity: 'COVERT', price: 145.00 },
      { name: 'Golden Coil', rarity: 'COVERT', price: 95.00 },
      { name: 'Player Two', rarity: 'COVERT', price: 42.00 },
      { name: 'Nightmare', rarity: 'CLASSIFIED', price: 18.00 },
      { name: 'Decimator', rarity: 'CLASSIFIED', price: 28.00 },
      { name: 'Mecha Industries', rarity: 'CLASSIFIED', price: 32.00 },
      { name: 'Chantico\'s Fire', rarity: 'COVERT', price: 55.00 },
      { name: 'Blue Phosphor', rarity: 'COVERT', price: 380.00 },
      { name: 'Welcome to the Jungle', rarity: 'COVERT', price: 1200.00 },
    ],
    'FAMAS': [
      { name: 'Rapid Eye Movement', rarity: 'CLASSIFIED', price: 15.00 },
      { name: 'Commemoration', rarity: 'COVERT', price: 35.00 },
      { name: 'Mecha Industries', rarity: 'CLASSIFIED', price: 12.00 },
      { name: 'Roll Cage', rarity: 'COVERT', price: 28.00 },
      { name: 'Meltdown', rarity: 'RESTRICTED', price: 6.00 },
      { name: 'Waters of Nephthys', rarity: 'RESTRICTED', price: 4.50 },
      { name: 'Styx', rarity: 'MIL_SPEC', price: 1.80 },
    ],
    'Galil AR': [
      { name: 'Chatterbox', rarity: 'COVERT', price: 22.00 },
      { name: 'Sugar Rush', rarity: 'CLASSIFIED', price: 8.50 },
      { name: 'Eco', rarity: 'RESTRICTED', price: 3.50 },
      { name: 'Cerberus', rarity: 'RESTRICTED', price: 5.00 },
      { name: 'Phoenix Blacklight', rarity: 'MIL_SPEC', price: 1.20 },
    ],
    'AUG': [
      { name: 'Akihabara Accept', rarity: 'COVERT', price: 450.00 },
      { name: 'Flame Jörmungandr', rarity: 'RESTRICTED', price: 12.00 },
      { name: 'Momentum', rarity: 'CLASSIFIED', price: 8.00 },
      { name: 'Stymphalian', rarity: 'CLASSIFIED', price: 6.50 },
      { name: 'Arctic Wolf', rarity: 'RESTRICTED', price: 3.00 },
    ],
    'SG 553': [
      { name: 'Integrale', rarity: 'CLASSIFIED', price: 18.00 },
      { name: 'Cyrex', rarity: 'CLASSIFIED', price: 12.00 },
      { name: 'Pulse', rarity: 'RESTRICTED', price: 4.00 },
      { name: 'Tiger Moth', rarity: 'RESTRICTED', price: 3.50 },
      { name: 'Dragon Tech', rarity: 'MIL_SPEC', price: 1.50 },
    ],
    'SSG 08': [
      { name: 'Dragonfire', rarity: 'COVERT', price: 35.00 },
      { name: 'Blood in the Water', rarity: 'COVERT', price: 85.00 },
      { name: 'Detour', rarity: 'RESTRICTED', price: 5.00 },
      { name: 'Turbo Peek', rarity: 'CLASSIFIED', price: 12.00 },
      { name: 'Fever Dream', rarity: 'MIL_SPEC', price: 2.00 },
    ],
    'G3SG1': [
      { name: 'Flux', rarity: 'CLASSIFIED', price: 6.00 },
      { name: 'The Executioner', rarity: 'RESTRICTED', price: 3.50 },
      { name: 'Scavenger', rarity: 'MIL_SPEC', price: 1.20 },
    ],
    'SCAR-20': [
      { name: 'Cyrex', rarity: 'CLASSIFIED', price: 8.00 },
      { name: 'Bloodsport', rarity: 'CLASSIFIED', price: 12.00 },
      { name: 'Emerald', rarity: 'RESTRICTED', price: 4.50 },
      { name: 'Poultrygeist', rarity: 'MIL_SPEC', price: 1.00 },
    ],
  },
  pistols: {
    'Glock-18': [
      { name: 'Fade', rarity: 'RESTRICTED', price: 180.00 },
      { name: 'Vogue', rarity: 'CLASSIFIED', price: 8.00 },
      { name: 'Bullet Queen', rarity: 'COVERT', price: 22.00 },
      { name: 'Neo-Noir', rarity: 'CLASSIFIED', price: 12.00 },
      { name: 'Water Elemental', rarity: 'RESTRICTED', price: 5.00 },
      { name: 'Snack Attack', rarity: 'CLASSIFIED', price: 6.50 },
      { name: 'Wasteland Rebel', rarity: 'RESTRICTED', price: 4.00 },
      { name: 'Gamma Doppler', rarity: 'COVERT', price: 95.00 },
    ],
    'USP-S': [
      { name: 'Kill Confirmed', rarity: 'COVERT', price: 55.00 },
      { name: 'Ticket to Hell', rarity: 'CLASSIFIED', price: 8.00 },
      { name: 'Printstream', rarity: 'COVERT', price: 42.00 },
      { name: 'Neo-Noir', rarity: 'CLASSIFIED', price: 15.00 },
      { name: 'Cortex', rarity: 'CLASSIFIED', price: 6.00 },
      { name: 'Monster Mashup', rarity: 'RESTRICTED', price: 4.50 },
      { name: 'Whiteout', rarity: 'RESTRICTED', price: 12.00 },
      { name: 'Orion', rarity: 'CLASSIFIED', price: 18.00 },
    ],
    'Desert Eagle': [
      { name: 'Blaze', rarity: 'CLASSIFIED', price: 350.00 },
      { name: 'Printstream', rarity: 'COVERT', price: 65.00 },
      { name: 'Code Red', rarity: 'COVERT', price: 28.00 },
      { name: 'Ocean Drive', rarity: 'COVERT', price: 22.00 },
      { name: 'Kumicho Dragon', rarity: 'CLASSIFIED', price: 15.00 },
      { name: 'Mecha Industries', rarity: 'CLASSIFIED', price: 8.00 },
      { name: 'Conspiracy', rarity: 'RESTRICTED', price: 5.00 },
      { name: 'Golden Koi', rarity: 'RESTRICTED', price: 35.00 },
    ],
    'P250': [
      { name: 'See Ya Later', rarity: 'COVERT', price: 12.00 },
      { name: 'Asiimov', rarity: 'CLASSIFIED', price: 6.00 },
      { name: 'Visions', rarity: 'CLASSIFIED', price: 4.50 },
      { name: 'Muertos', rarity: 'CLASSIFIED', price: 8.00 },
      { name: 'Splash', rarity: 'RESTRICTED', price: 2.50 },
    ],
    'Five-SeveN': [
      { name: 'Angry Mob', rarity: 'COVERT', price: 18.00 },
      { name: 'Fairy Tale', rarity: 'CLASSIFIED', price: 12.00 },
      { name: 'Hyper Beast', rarity: 'COVERT', price: 35.00 },
      { name: 'Monkey Business', rarity: 'CLASSIFIED', price: 6.00 },
      { name: 'Boost Protocol', rarity: 'RESTRICTED', price: 3.00 },
    ],
    'Tec-9': [
      { name: 'Fuel Injector', rarity: 'CLASSIFIED', price: 8.00 },
      { name: 'Decimator', rarity: 'CLASSIFIED', price: 5.50 },
      { name: 'Brother', rarity: 'RESTRICTED', price: 2.50 },
      { name: 'Re-Entry', rarity: 'RESTRICTED', price: 3.00 },
      { name: 'Avalanche', rarity: 'MIL_SPEC', price: 1.20 },
    ],
    'CZ75-Auto': [
      { name: 'Victoria', rarity: 'COVERT', price: 15.00 },
      { name: 'Yellow Jacket', rarity: 'CLASSIFIED', price: 6.00 },
      { name: 'Tacticat', rarity: 'RESTRICTED', price: 3.50 },
      { name: 'Xiangliu', rarity: 'RESTRICTED', price: 2.80 },
    ],
    'P2000': [
      { name: 'Fire Elemental', rarity: 'COVERT', price: 22.00 },
      { name: 'Imperial Dragon', rarity: 'CLASSIFIED', price: 8.00 },
      { name: 'Ocean Foam', rarity: 'RESTRICTED', price: 12.00 },
      { name: 'Corticera', rarity: 'RESTRICTED', price: 4.00 },
    ],
    'Dual Berettas': [
      { name: 'Melondrama', rarity: 'CLASSIFIED', price: 5.00 },
      { name: 'Cobra Strike', rarity: 'CLASSIFIED', price: 6.50 },
      { name: 'Hemoglobin', rarity: 'RESTRICTED', price: 3.00 },
      { name: 'Royal Consorts', rarity: 'RESTRICTED', price: 2.50 },
    ],
    'R8 Revolver': [
      { name: 'Fade', rarity: 'COVERT', price: 45.00 },
      { name: 'Llama Cannon', rarity: 'CLASSIFIED', price: 8.00 },
      { name: 'Crazy 8', rarity: 'RESTRICTED', price: 3.50 },
      { name: 'Bone Forged', rarity: 'MIL_SPEC', price: 1.50 },
    ],
  },
  smgs: {
    'MP9': [
      { name: 'Starlight Protector', rarity: 'COVERT', price: 28.00 },
      { name: 'Food Chain', rarity: 'CLASSIFIED', price: 6.00 },
      { name: 'Mount Fuji', rarity: 'RESTRICTED', price: 3.50 },
      { name: 'Hydra', rarity: 'CLASSIFIED', price: 5.50 },
      { name: 'Airlock', rarity: 'RESTRICTED', price: 2.80 },
      { name: 'Goo', rarity: 'RESTRICTED', price: 2.00 },
    ],
    'MAC-10': [
      { name: 'Ensnared', rarity: 'RESTRICTED', price: 3.50 },
      { name: 'Neon Rider', rarity: 'CLASSIFIED', price: 8.00 },
      { name: 'Stalker', rarity: 'CLASSIFIED', price: 5.00 },
      { name: 'Disco Tech', rarity: 'CLASSIFIED', price: 6.50 },
      { name: 'Heat', rarity: 'RESTRICTED', price: 3.00 },
      { name: 'Aloha', rarity: 'MIL_SPEC', price: 1.00 },
    ],
    'MP7': [
      { name: 'Bloodsport', rarity: 'COVERT', price: 18.00 },
      { name: 'Neon Ply', rarity: 'CLASSIFIED', price: 5.50 },
      { name: 'Abyssal Apparition', rarity: 'CLASSIFIED', price: 4.50 },
      { name: 'Fade', rarity: 'RESTRICTED', price: 8.00 },
      { name: 'Guerrilla', rarity: 'RESTRICTED', price: 2.50 },
    ],
    'MP5-SD': [
      { name: 'Phoenix Stencil', rarity: 'RESTRICTED', price: 2.50 },
      { name: 'Kitbash', rarity: 'CLASSIFIED', price: 4.00 },
      { name: 'Gauss', rarity: 'RESTRICTED', price: 2.00 },
      { name: 'Liquidation', rarity: 'MIL_SPEC', price: 0.80 },
    ],
    'P90': [
      { name: 'Asiimov', rarity: 'COVERT', price: 22.00 },
      { name: 'Death by Kitty', rarity: 'COVERT', price: 35.00 },
      { name: 'Neoqueen', rarity: 'CLASSIFIED', price: 5.00 },
      { name: 'Vent Rush', rarity: 'RESTRICTED', price: 2.50 },
      { name: 'Shallow Grave', rarity: 'CLASSIFIED', price: 6.00 },
    ],
    'PP-Bizon': [
      { name: 'Judgement of Anubis', rarity: 'COVERT', price: 12.00 },
      { name: 'High Roller', rarity: 'CLASSIFIED', price: 5.00 },
      { name: 'Fuel Rod', rarity: 'RESTRICTED', price: 2.50 },
      { name: 'Osiris', rarity: 'RESTRICTED', price: 2.00 },
    ],
    'UMP-45': [
      { name: 'Neo-Noir', rarity: 'CLASSIFIED', price: 6.00 },
      { name: 'Wild Child', rarity: 'CLASSIFIED', price: 4.50 },
      { name: 'Momentum', rarity: 'CLASSIFIED', price: 5.50 },
      { name: 'Primal Saber', rarity: 'CLASSIFIED', price: 8.00 },
      { name: 'Scaffold', rarity: 'RESTRICTED', price: 2.50 },
    ],
  },
  heavy: {
    'Nova': [
      { name: 'Hyper Beast', rarity: 'COVERT', price: 18.00 },
      { name: 'Wild Six', rarity: 'CLASSIFIED', price: 4.00 },
      { name: 'Gila', rarity: 'RESTRICTED', price: 2.50 },
      { name: 'Rising Skull', rarity: 'RESTRICTED', price: 3.00 },
    ],
    'XM1014': [
      { name: 'Entombed', rarity: 'CLASSIFIED', price: 5.00 },
      { name: 'Incinegator', rarity: 'CLASSIFIED', price: 4.50 },
      { name: 'Ziggy', rarity: 'RESTRICTED', price: 2.00 },
      { name: 'Black Tie', rarity: 'RESTRICTED', price: 3.50 },
    ],
    'MAG-7': [
      { name: 'Justice', rarity: 'CLASSIFIED', price: 4.00 },
      { name: 'Monster Call', rarity: 'RESTRICTED', price: 2.50 },
      { name: 'Cinquedea', rarity: 'CLASSIFIED', price: 6.00 },
      { name: 'Petroglyph', rarity: 'RESTRICTED', price: 1.80 },
    ],
    'Sawed-Off': [
      { name: 'The Kraken', rarity: 'COVERT', price: 12.00 },
      { name: 'Devourer', rarity: 'CLASSIFIED', price: 4.50 },
      { name: 'Wasteland Princess', rarity: 'CLASSIFIED', price: 5.00 },
      { name: 'Limelight', rarity: 'RESTRICTED', price: 2.00 },
    ],
    'M249': [
      { name: 'Aztec', rarity: 'RESTRICTED', price: 3.00 },
      { name: 'Deep Relief', rarity: 'RESTRICTED', price: 2.50 },
      { name: 'Spectre', rarity: 'MIL_SPEC', price: 1.00 },
    ],
    'Negev': [
      { name: 'Power Loader', rarity: 'RESTRICTED', price: 3.50 },
      { name: 'Loudmouth', rarity: 'RESTRICTED', price: 2.50 },
      { name: 'Devil', rarity: 'MIL_SPEC', price: 1.20 },
    ],
  },
  knives: {
    'Karambit': [
      { name: 'Doppler', rarity: 'EXCEEDINGLY_RARE', price: 1200.00 },
      { name: 'Fade', rarity: 'EXCEEDINGLY_RARE', price: 1800.00 },
      { name: 'Marble Fade', rarity: 'EXCEEDINGLY_RARE', price: 1500.00 },
      { name: 'Tiger Tooth', rarity: 'EXCEEDINGLY_RARE', price: 900.00 },
      { name: 'Crimson Web', rarity: 'EXCEEDINGLY_RARE', price: 650.00 },
      { name: 'Slaughter', rarity: 'EXCEEDINGLY_RARE', price: 750.00 },
    ],
    'Butterfly Knife': [
      { name: 'Fade', rarity: 'EXCEEDINGLY_RARE', price: 950.00 },
      { name: 'Doppler', rarity: 'EXCEEDINGLY_RARE', price: 1100.00 },
      { name: 'Marble Fade', rarity: 'EXCEEDINGLY_RARE', price: 1300.00 },
      { name: 'Tiger Tooth', rarity: 'EXCEEDINGLY_RARE', price: 850.00 },
      { name: 'Crimson Web', rarity: 'EXCEEDINGLY_RARE', price: 700.00 },
    ],
    'M9 Bayonet': [
      { name: 'Doppler', rarity: 'EXCEEDINGLY_RARE', price: 1050.00 },
      { name: 'Fade', rarity: 'EXCEEDINGLY_RARE', price: 1400.00 },
      { name: 'Marble Fade', rarity: 'EXCEEDINGLY_RARE', price: 1250.00 },
      { name: 'Tiger Tooth', rarity: 'EXCEEDINGLY_RARE', price: 800.00 },
      { name: 'Crimson Web', rarity: 'EXCEEDINGLY_RARE', price: 600.00 },
    ],
    'Bowie Knife': [
      { name: 'Marble Fade', rarity: 'EXCEEDINGLY_RARE', price: 420.00 },
      { name: 'Fade', rarity: 'EXCEEDINGLY_RARE', price: 380.00 },
      { name: 'Doppler', rarity: 'EXCEEDINGLY_RARE', price: 450.00 },
      { name: 'Tiger Tooth', rarity: 'EXCEEDINGLY_RARE', price: 320.00 },
    ],
    'Flip Knife': [
      { name: 'Doppler', rarity: 'EXCEEDINGLY_RARE', price: 550.00 },
      { name: 'Fade', rarity: 'EXCEEDINGLY_RARE', price: 620.00 },
      { name: 'Marble Fade', rarity: 'EXCEEDINGLY_RARE', price: 580.00 },
      { name: 'Tiger Tooth', rarity: 'EXCEEDINGLY_RARE', price: 480.00 },
    ],
    'Gut Knife': [
      { name: 'Doppler', rarity: 'EXCEEDINGLY_RARE', price: 280.00 },
      { name: 'Fade', rarity: 'EXCEEDINGLY_RARE', price: 320.00 },
      { name: 'Marble Fade', rarity: 'EXCEEDINGLY_RARE', price: 300.00 },
      { name: 'Tiger Tooth', rarity: 'EXCEEDINGLY_RARE', price: 250.00 },
    ],
    'Huntsman Knife': [
      { name: 'Doppler', rarity: 'EXCEEDINGLY_RARE', price: 380.00 },
      { name: 'Fade', rarity: 'EXCEEDINGLY_RARE', price: 420.00 },
      { name: 'Marble Fade', rarity: 'EXCEEDINGLY_RARE', price: 400.00 },
      { name: 'Tiger Tooth', rarity: 'EXCEEDINGLY_RARE', price: 350.00 },
    ],
    'Falchion Knife': [
      { name: 'Doppler', rarity: 'EXCEEDINGLY_RARE', price: 320.00 },
      { name: 'Fade', rarity: 'EXCEEDINGLY_RARE', price: 360.00 },
      { name: 'Marble Fade', rarity: 'EXCEEDINGLY_RARE', price: 340.00 },
    ],
    'Shadow Daggers': [
      { name: 'Doppler', rarity: 'EXCEEDINGLY_RARE', price: 280.00 },
      { name: 'Fade', rarity: 'EXCEEDINGLY_RARE', price: 310.00 },
      { name: 'Marble Fade', rarity: 'EXCEEDINGLY_RARE', price: 290.00 },
    ],
    'Navaja Knife': [
      { name: 'Doppler', rarity: 'EXCEEDINGLY_RARE', price: 220.00 },
      { name: 'Fade', rarity: 'EXCEEDINGLY_RARE', price: 250.00 },
      { name: 'Marble Fade', rarity: 'EXCEEDINGLY_RARE', price: 240.00 },
    ],
    'Stiletto Knife': [
      { name: 'Doppler', rarity: 'EXCEEDINGLY_RARE', price: 480.00 },
      { name: 'Fade', rarity: 'EXCEEDINGLY_RARE', price: 520.00 },
      { name: 'Marble Fade', rarity: 'EXCEEDINGLY_RARE', price: 500.00 },
    ],
    'Talon Knife': [
      { name: 'Doppler', rarity: 'EXCEEDINGLY_RARE', price: 550.00 },
      { name: 'Fade', rarity: 'EXCEEDINGLY_RARE', price: 600.00 },
      { name: 'Marble Fade', rarity: 'EXCEEDINGLY_RARE', price: 580.00 },
    ],
    'Ursus Knife': [
      { name: 'Doppler', rarity: 'EXCEEDINGLY_RARE', price: 350.00 },
      { name: 'Fade', rarity: 'EXCEEDINGLY_RARE', price: 380.00 },
      { name: 'Marble Fade', rarity: 'EXCEEDINGLY_RARE', price: 360.00 },
    ],
    'Skeleton Knife': [
      { name: 'Doppler', rarity: 'EXCEEDINGLY_RARE', price: 650.00 },
      { name: 'Fade', rarity: 'EXCEEDINGLY_RARE', price: 720.00 },
      { name: 'Marble Fade', rarity: 'EXCEEDINGLY_RARE', price: 680.00 },
    ],
    'Nomad Knife': [
      { name: 'Doppler', rarity: 'EXCEEDINGLY_RARE', price: 420.00 },
      { name: 'Fade', rarity: 'EXCEEDINGLY_RARE', price: 480.00 },
      { name: 'Marble Fade', rarity: 'EXCEEDINGLY_RARE', price: 450.00 },
    ],
    'Survival Knife': [
      { name: 'Doppler', rarity: 'EXCEEDINGLY_RARE', price: 280.00 },
      { name: 'Fade', rarity: 'EXCEEDINGLY_RARE', price: 310.00 },
    ],
    'Paracord Knife': [
      { name: 'Doppler', rarity: 'EXCEEDINGLY_RARE', price: 290.00 },
      { name: 'Fade', rarity: 'EXCEEDINGLY_RARE', price: 320.00 },
    ],
    'Kukri Knife': [
      { name: 'Doppler', rarity: 'EXCEEDINGLY_RARE', price: 350.00 },
      { name: 'Fade', rarity: 'EXCEEDINGLY_RARE', price: 380.00 },
    ],
  },
  gloves: {
    'Sport Gloves': [
      { name: 'Vice', rarity: 'EXCEEDINGLY_RARE', price: 2200.00 },
      { name: 'Omega', rarity: 'EXCEEDINGLY_RARE', price: 1800.00 },
      { name: 'Amphibious', rarity: 'EXCEEDINGLY_RARE', price: 1500.00 },
      { name: 'Superconductor', rarity: 'EXCEEDINGLY_RARE', price: 2500.00 },
    ],
    'Driver Gloves': [
      { name: 'King Snake', rarity: 'EXCEEDINGLY_RARE', price: 850.00 },
      { name: 'Crimson Weave', rarity: 'EXCEEDINGLY_RARE', price: 720.00 },
      { name: 'Imperial Plaid', rarity: 'EXCEEDINGLY_RARE', price: 680.00 },
      { name: 'Snow Leopard', rarity: 'EXCEEDINGLY_RARE', price: 550.00 },
    ],
    'Hand Wraps': [
      { name: 'Cobalt Skulls', rarity: 'EXCEEDINGLY_RARE', price: 620.00 },
      { name: 'Slaughter', rarity: 'EXCEEDINGLY_RARE', price: 480.00 },
      { name: 'Overprint', rarity: 'EXCEEDINGLY_RARE', price: 420.00 },
      { name: 'Badlands', rarity: 'EXCEEDINGLY_RARE', price: 350.00 },
    ],
    'Moto Gloves': [
      { name: 'Spearmint', rarity: 'EXCEEDINGLY_RARE', price: 3200.00 },
      { name: 'Cool Mint', rarity: 'EXCEEDINGLY_RARE', price: 1800.00 },
      { name: 'Polygon', rarity: 'EXCEEDINGLY_RARE', price: 550.00 },
      { name: 'Blood Pressure', rarity: 'EXCEEDINGLY_RARE', price: 480.00 },
    ],
    'Specialist Gloves': [
      { name: 'Crimson Kimono', rarity: 'EXCEEDINGLY_RARE', price: 2800.00 },
      { name: 'Emerald Web', rarity: 'EXCEEDINGLY_RARE', price: 2200.00 },
      { name: 'Field Agent', rarity: 'EXCEEDINGLY_RARE', price: 650.00 },
      { name: 'Marble Fade', rarity: 'EXCEEDINGLY_RARE', price: 580.00 },
    ],
    'Hydra Gloves': [
      { name: 'Emerald', rarity: 'EXCEEDINGLY_RARE', price: 420.00 },
      { name: 'Case Hardened', rarity: 'EXCEEDINGLY_RARE', price: 380.00 },
      { name: 'Mangrove', rarity: 'EXCEEDINGLY_RARE', price: 320.00 },
    ],
    'Broken Fang Gloves': [
      { name: 'Jade', rarity: 'EXCEEDINGLY_RARE', price: 450.00 },
      { name: 'Yellow-banded', rarity: 'EXCEEDINGLY_RARE', price: 380.00 },
      { name: 'Needle Point', rarity: 'EXCEEDINGLY_RARE', price: 350.00 },
    ],
    'Bloodhound Gloves': [
      { name: 'Charred', rarity: 'EXCEEDINGLY_RARE', price: 280.00 },
      { name: 'Snakebite', rarity: 'EXCEEDINGLY_RARE', price: 250.00 },
      { name: 'Guerrilla', rarity: 'EXCEEDINGLY_RARE', price: 220.00 },
    ],
  },
};

function buildSkinsList() {
  const skins = [];
  const categoryMap = {
    rifles: 'rifles',
    pistols: 'pistols',
    smgs: 'smgs',
    heavy: 'heavy',
    knives: 'knives',
    gloves: 'gloves',
  };

  for (const [catSlug, weapons] of Object.entries(skinCollections)) {
    for (const [weapon, skinList] of Object.entries(weapons)) {
      for (const skin of skinList) {
        const fullName = `${weapon} | ${skin.name}`;
        skins.push({
          name: fullName,
          weapon,
          rarity: skin.rarity,
          exterior: randomExterior(),
          float: randomFloat(),
          price: skin.price,
          description: buildDescription(weapon, skin.name, skin.rarity, skin.price),
          stock: Math.floor(randomInRange(1, 20)),
          categorySlug: categoryMap[catSlug],
          images: JSON.stringify([buildSkinImage(weapon, skin.name, skin.rarity)]),
        });
      }
    }
  }

  // Add consumer/industrial tier skins for variety
  const basicWeapons = [
    { weapon: 'AK-47', cat: 'rifles' },
    { weapon: 'AWP', cat: 'rifles' },
    { weapon: 'M4A4', cat: 'rifles' },
    { weapon: 'Glock-18', cat: 'pistols' },
    { weapon: 'USP-S', cat: 'pistols' },
    { weapon: 'MP9', cat: 'smgs' },
    { weapon: 'MAC-10', cat: 'smgs' },
    { weapon: 'Nova', cat: 'heavy' },
  ];

  const basicSkins = [
    { suffix: 'Safari Mesh', rarity: 'CONSUMER', price: 0.08 },
    { suffix: 'Sand Dune', rarity: 'CONSUMER', price: 0.05 },
    { suffix: 'Urban Masked', rarity: 'INDUSTRIAL', price: 0.35 },
    { suffix: 'Forest DDPAT', rarity: 'INDUSTRIAL', price: 0.25 },
    { suffix: 'Blue Spruce', rarity: 'CONSUMER', price: 0.06 },
    { suffix: 'Jungle DDPAT', rarity: 'INDUSTRIAL', price: 0.30 },
  ];

  for (const { weapon, cat } of basicWeapons) {
    for (const basic of basicSkins) {
      skins.push({
        name: `${weapon} | ${basic.suffix}`,
        weapon,
        rarity: basic.rarity,
        exterior: randomExterior(),
        float: randomFloat(),
        price: basic.price,
        description: buildDescription(weapon, basic.suffix, basic.rarity, basic.price),
        stock: Math.floor(randomInRange(5, 50)),
        categorySlug: cat,
        images: JSON.stringify([buildSkinImage(weapon, basic.suffix, basic.rarity)]),
      });
    }
  }

  return skins;
}

const casesData = [
  {
    name: 'Dreams & Nightmares Case',
    slug: 'dreams-nightmares',
    description: 'Premium Collection Case featuring surreal weapon skins and rare gloves/knives.',
    price: 2.50,
    isFeatured: true,
    imageUrl: '/cases/dreams-nightmares.png',
    items: [
      { skinName: 'Karambit | Doppler', dropRate: 0.2 },
      { skinName: 'AK-47 | Nightwish', dropRate: 0.6 },
      { skinName: 'MP9 | Starlight Protector', dropRate: 0.6 },
      { skinName: 'USP-S | Ticket to Hell', dropRate: 3.2 },
      { skinName: 'FAMAS | Rapid Eye Movement', dropRate: 3.2 },
      { skinName: 'MAC-10 | Ensnared', dropRate: 15.9 },
      { skinName: 'Glock-18 | Vogue', dropRate: 15.9 },
      { skinName: 'MP7 | Abyssal Apparition', dropRate: 3.2 },
      { skinName: 'Five-SeveN | Fairy Tale', dropRate: 3.2 },
      { skinName: 'PP-Bizon | High Roller', dropRate: 15.9 },
      { skinName: 'XM1014 | Entombed', dropRate: 15.9 },
      { skinName: 'SCAR-20 | Poultrygeist', dropRate: 15.9 },
      { skinName: 'Dual Berettas | Melondrama', dropRate: 3.2 },
      { skinName: 'P2000 | Imperial Dragon', dropRate: 3.2 },
      { skinName: 'Sawed-Off | Wasteland Princess', dropRate: 3.2 },
      { skinName: 'MAG-7 | Monster Call', dropRate: 15.9 },
      { skinName: 'M249 | Deep Relief', dropRate: 15.9 },
    ],
  },
  {
    name: 'Revolution Case',
    slug: 'revolution',
    description: 'Revolutionary designs with bold colors and patterns.',
    price: 2.49,
    isFeatured: true,
    imageUrl: '/cases/revolution.png',
    items: [
      { skinName: 'Butterfly Knife | Fade', dropRate: 0.2 },
      { skinName: 'AK-47 | Head Shot', dropRate: 0.6 },
      { skinName: 'AWP | Duality', dropRate: 0.6 },
      { skinName: 'M4A4 | Temukau', dropRate: 0.6 },
      { skinName: 'Glock-18 | Snack Attack', dropRate: 3.2 },
      { skinName: 'UMP-45 | Wild Child', dropRate: 3.2 },
      { skinName: 'P90 | Vent Rush', dropRate: 15.9 },
      { skinName: 'MP5-SD | Kitbash', dropRate: 15.9 },
      { skinName: 'Nova | Wild Six', dropRate: 3.2 },
      { skinName: 'MAG-7 | Justice', dropRate: 3.2 },
    ],
  },
  {
    name: 'Recoil Case',
    slug: 'recoil',
    description: 'High-impact skins from the Recoil collection.',
    price: 2.49,
    isFeatured: true,
    imageUrl: '/cases/recoil.png',
    items: [
      { skinName: 'M9 Bayonet | Marble Fade', dropRate: 0.2 },
      { skinName: 'AK-47 | Ice Coaled', dropRate: 0.6 },
      { skinName: 'AWP | Chromatic Aberration', dropRate: 0.6 },
      { skinName: 'USP-S | Printstream', dropRate: 0.6 },
      { skinName: 'SG 553 | Dragon Tech', dropRate: 15.9 },
      { skinName: 'R8 Revolver | Crazy 8', dropRate: 15.9 },
      { skinName: 'Dual Berettas | Royal Consorts', dropRate: 15.9 },
      { skinName: 'P250 | Visions', dropRate: 3.2 },
      { skinName: 'Negev | Devil', dropRate: 15.9 },
    ],
  },
  {
    name: 'Kilowatt Case',
    slug: 'kilowatt',
    description: 'Electric-themed skins with neon accents.',
    price: 2.49,
    isFeatured: true,
    imageUrl: '/cases/kilowatt.png',
    items: [
      { skinName: 'Skeleton Knife | Doppler', dropRate: 0.2 },
      { skinName: 'AK-47 | Inheritance', dropRate: 0.6 },
      { skinName: 'M4A1-S | Black Lotus', dropRate: 0.6 },
      { skinName: 'Zeus x27 | Olympus', dropRate: 3.2 },
      { skinName: 'MP7 | Just Smile', dropRate: 3.2 },
      { skinName: 'Five-SeveN | Hybrid', dropRate: 3.2 },
      { skinName: 'Sawed-Off | Analog Input', dropRate: 15.9 },
      { skinName: 'XM1014 | Irezumi', dropRate: 15.9 },
    ],
  },
  {
    name: 'Fever Case',
    slug: 'fever',
    description: 'Hot skins that are trending in the community.',
    price: 2.49,
    isFeatured: false,
    imageUrl: '/cases/fever.png',
    items: [
      { skinName: 'Talon Knife | Fade', dropRate: 0.2 },
      { skinName: 'AK-47 | Searing Rage', dropRate: 0.6 },
      { skinName: 'AWP | Printstream', dropRate: 0.6 },
      { skinName: 'Glock-18 | Gold Toof', dropRate: 3.2 },
      { skinName: 'UMP-45 | K.O. Factory', dropRate: 3.2 },
      { skinName: 'P90 | Randy Rush', dropRate: 15.9 },
      { skinName: 'Nova | Yorkshire', dropRate: 15.9 },
    ],
  },
  {
    name: 'Gallery Case',
    slug: 'gallery',
    description: 'Artistic skins from the Gallery collection.',
    price: 2.49,
    isFeatured: false,
    imageUrl: '/cases/gallery.png',
    items: [
      { skinName: 'Stiletto Knife | Marble Fade', dropRate: 0.2 },
      { skinName: 'M4A4 | Turbine', dropRate: 0.6 },
      { skinName: 'AK-47 | The Outsiders', dropRate: 0.6 },
      { skinName: 'Desert Eagle | Calligraffiti', dropRate: 3.2 },
      { skinName: 'MP5-SD | Liquidation', dropRate: 15.9 },
      { skinName: 'SSG 08 | Fever Dream', dropRate: 15.9 },
    ],
  },
];

module.exports = { buildSkinsList, casesData, RARITIES };
