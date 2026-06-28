const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding marketplace database...');

  // ─── Categories ──────────────────────────────────────────────────────────
  const categoryData = [
    { name: 'Rifles', slug: 'rifles', itemType: 'WEAPON', description: 'Assault rifles and battle rifles' },
    { name: 'Pistols', slug: 'pistols', itemType: 'WEAPON', description: 'Sidearm pistols' },
    { name: 'SMGs', slug: 'smgs', itemType: 'WEAPON', description: 'Submachine guns' },
    { name: 'Heavy', slug: 'heavy', itemType: 'WEAPON', description: 'Heavy weapons and shotguns' },
    { name: 'Sniper Rifles', slug: 'sniper-rifles', itemType: 'WEAPON', description: 'Sniper and scout rifles' },
    { name: 'Knives', slug: 'knives', itemType: 'KNIFE', description: 'Melee knife skins' },
    { name: 'Gloves', slug: 'gloves', itemType: 'GLOVES', description: 'Hand glove skins' },
    { name: 'Agents', slug: 'agents', itemType: 'AGENT', description: 'Character agent skins' },
    { name: 'Stickers', slug: 'stickers', itemType: 'STICKER', description: 'Weapon stickers' },
    { name: 'Music Kits', slug: 'music-kits', itemType: 'MUSIC_KIT', description: 'In-game music kits' },
    { name: 'Charms', slug: 'charms', itemType: 'CHARM', description: 'Weapon charms' },
    { name: 'Cases', slug: 'cases-cat', itemType: 'CASE', description: 'CS2 weapon cases' },
    { name: 'Graffiti', slug: 'graffiti', itemType: 'GRAFFITI', description: 'Spray graffiti items' },
    { name: 'Collections', slug: 'collections-cat', itemType: 'COLLECTION', description: 'Weapon collections' },
  ];

  const categories = {};
  for (const cat of categoryData) {
    const c = await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
    categories[cat.slug] = c;
  }
  console.log('✅ Categories seeded:', Object.keys(categories).length);

  // ─── Collections ─────────────────────────────────────────────────────────
  const collectionData = [
    { name: 'Recoil', slug: 'recoil', description: 'The Recoil Collection' },
    { name: 'Dreams & Nightmares', slug: 'dreams-nightmares', description: 'The Dreams & Nightmares Collection' },
    { name: 'Revolution', slug: 'revolution', description: 'The Revolution Collection' },
    { name: 'Kilowatt', slug: 'kilowatt', description: 'The Kilowatt Collection' },
    { name: 'Anubis', slug: 'anubis', description: 'The Anubis Collection' },
    { name: 'Riptide', slug: 'riptide', description: 'The Riptide Collection' },
    { name: 'Snakebite', slug: 'snakebite', description: 'The Snakebite Collection' },
    { name: 'Operation Broken Fang', slug: 'broken-fang', description: 'Operation Broken Fang Collection' },
    { name: 'Prisma 2', slug: 'prisma-2', description: 'The Prisma 2 Collection' },
    { name: 'Fracture', slug: 'fracture', description: 'The Fracture Collection' },
    { name: 'Ancient', slug: 'ancient', description: 'The Ancient Collection' },
    { name: 'Clutch', slug: 'clutch', description: 'The Clutch Collection' },
  ];

  const collections = {};
  for (const col of collectionData) {
    const c = await prisma.collection.upsert({ where: { slug: col.slug }, update: {}, create: col });
    collections[col.slug] = c;
  }
  console.log('✅ Collections seeded:', Object.keys(collections).length);

  // ─── Skins (100+ skins across all categories) ────────────────────────────
  const R = (cat) => categories[cat].id;
  const C = (col) => collections[col].id;

  const skinsData = [
    // ── AK-47 ──
    { name: 'AK-47 | Redline',            weapon: 'AK-47', rarity: 'CLASSIFIED', exterior: 'FIELD_TESTED',  float: 0.25, price: 45.99,   stock: 10, categoryId: R('rifles'),        collectionId: C('recoil'),           popularity: 950 },
    { name: 'AK-47 | Vulcan',             weapon: 'AK-47', rarity: 'COVERT',     exterior: 'MINIMAL_WEAR',  float: 0.09, price: 199.99,  stock: 5,  categoryId: R('rifles'),        collectionId: C('recoil'),           popularity: 870 },
    { name: 'AK-47 | Fire Serpent',       weapon: 'AK-47', rarity: 'COVERT',     exterior: 'FACTORY_NEW',   float: 0.02, price: 2499.99, stock: 1,  categoryId: R('rifles'),                                             popularity: 750 },
    { name: 'AK-47 | Asiimov',            weapon: 'AK-47', rarity: 'COVERT',     exterior: 'FACTORY_NEW',   float: 0.01, price: 899.99,  stock: 3,  categoryId: R('rifles'),        collectionId: C('revolution'),       popularity: 820 },
    { name: 'AK-47 | Neon Revolution',    weapon: 'AK-47', rarity: 'COVERT',     exterior: 'MINIMAL_WEAR',  float: 0.12, price: 89.99,   stock: 8,  categoryId: R('rifles'),        collectionId: C('revolution'),       popularity: 680 },
    { name: 'AK-47 | Wild Lotus',         weapon: 'AK-47', rarity: 'COVERT',     exterior: 'FACTORY_NEW',   float: 0.01, price: 1599.99, stock: 2,  categoryId: R('rifles'),        collectionId: C('ancient'),          popularity: 810 },
    { name: 'AK-47 | The Empress',        weapon: 'AK-47', rarity: 'COVERT',     exterior: 'MINIMAL_WEAR',  float: 0.11, price: 89.99,   stock: 7,  categoryId: R('rifles'),        collectionId: C('clutch'),           popularity: 720 },
    { name: 'AK-47 | Fuel Injector',      weapon: 'AK-47', rarity: 'COVERT',     exterior: 'FACTORY_NEW',   float: 0.03, price: 129.99,  stock: 6,  categoryId: R('rifles'),        collectionId: C('prisma-2'),         popularity: 700 },
    { name: 'AK-47 | Bloodsport',         weapon: 'AK-47', rarity: 'COVERT',     exterior: 'MINIMAL_WEAR',  float: 0.10, price: 59.99,   stock: 9,  categoryId: R('rifles'),        collectionId: C('riptide'),          popularity: 660 },
    { name: 'AK-47 | Point Disarray',     weapon: 'AK-47', rarity: 'COVERT',     exterior: 'MINIMAL_WEAR',  float: 0.13, price: 74.99,   stock: 8,  categoryId: R('rifles'),        collectionId: C('prisma-2'),         popularity: 620 },
    { name: 'AK-47 | Jaguar',             weapon: 'AK-47', rarity: 'CLASSIFIED', exterior: 'FACTORY_NEW',   float: 0.02, price: 39.99,   stock: 12, categoryId: R('rifles'),        collectionId: C('fracture'),         popularity: 580 },
    { name: 'AK-47 | Slate',              weapon: 'AK-47', rarity: 'RESTRICTED', exterior: 'FACTORY_NEW',   float: 0.01, price: 14.99,   stock: 20, categoryId: R('rifles'),        collectionId: C('recoil'),           popularity: 540 },
    { name: 'AK-47 | Nightwish',          weapon: 'AK-47', rarity: 'COVERT',     exterior: 'FIELD_TESTED',  float: 0.28, price: 99.99,   stock: 6,  categoryId: R('rifles'),        collectionId: C('kilowatt'),         popularity: 710 },
    { name: 'AK-47 | Head Shot',          weapon: 'AK-47', rarity: 'CLASSIFIED', exterior: 'MINIMAL_WEAR',  float: 0.12, price: 34.99,   stock: 14, categoryId: R('rifles'),        collectionId: C('snakebite'),        popularity: 490 },
    { name: 'AK-47 | X-Ray',             weapon: 'AK-47', rarity: 'RESTRICTED', exterior: 'FACTORY_NEW',   float: 0.02, price: 19.99,   stock: 18, categoryId: R('rifles'),        collectionId: C('prisma-2'),         popularity: 460 },
    // ── AWP ──
    { name: 'AWP | Dragon Lore',          weapon: 'AWP', rarity: 'COVERT',       exterior: 'FACTORY_NEW',   float: 0.01, price: 4999.99, stock: 2,  categoryId: R('sniper-rifles'),                                      popularity: 1000 },
    { name: 'AWP | Asiimov',              weapon: 'AWP', rarity: 'COVERT',       exterior: 'FIELD_TESTED',  float: 0.28, price: 89.99,   stock: 12, categoryId: R('sniper-rifles'),                                      popularity: 880 },
    { name: 'AWP | Medusa',               weapon: 'AWP', rarity: 'COVERT',       exterior: 'MINIMAL_WEAR',  float: 0.11, price: 2199.99, stock: 2,  categoryId: R('sniper-rifles'),                                      popularity: 720 },
    { name: 'AWP | Gungnir',              weapon: 'AWP', rarity: 'COVERT',       exterior: 'FACTORY_NEW',   float: 0.02, price: 3499.99, stock: 1,  categoryId: R('sniper-rifles'),                                      popularity: 710 },
    { name: 'AWP | Containment Breach',   weapon: 'AWP', rarity: 'COVERT',       exterior: 'FACTORY_NEW',   float: 0.01, price: 149.99,  stock: 5,  categoryId: R('sniper-rifles'), collectionId: C('riptide'),          popularity: 690 },
    { name: 'AWP | The Prince',           weapon: 'AWP', rarity: 'COVERT',       exterior: 'FACTORY_NEW',   float: 0.03, price: 299.99,  stock: 4,  categoryId: R('sniper-rifles'), collectionId: C('ancient'),          popularity: 670 },
    { name: 'AWP | Neo-Noir',             weapon: 'AWP', rarity: 'COVERT',       exterior: 'MINIMAL_WEAR',  float: 0.12, price: 219.99,  stock: 5,  categoryId: R('sniper-rifles'), collectionId: C('clutch'),           popularity: 650 },
    { name: 'AWP | Wildfire',             weapon: 'AWP', rarity: 'COVERT',       exterior: 'FACTORY_NEW',   float: 0.01, price: 139.99,  stock: 6,  categoryId: R('sniper-rifles'), collectionId: C('fracture'),         popularity: 630 },
    { name: 'AWP | Atheris',              weapon: 'AWP', rarity: 'CLASSIFIED',   exterior: 'FACTORY_NEW',   float: 0.02, price: 29.99,   stock: 14, categoryId: R('sniper-rifles'), collectionId: C('snakebite'),        popularity: 560 },
    { name: 'AWP | Hyper Beast',          weapon: 'AWP', rarity: 'COVERT',       exterior: 'FACTORY_NEW',   float: 0.04, price: 169.99,  stock: 6,  categoryId: R('sniper-rifles'), collectionId: C('recoil'),           popularity: 780 },
    { name: 'AWP | Chromatic Aberration', weapon: 'AWP', rarity: 'CLASSIFIED',   exterior: 'MINIMAL_WEAR',  float: 0.13, price: 24.99,   stock: 16, categoryId: R('sniper-rifles'), collectionId: C('prisma-2'),         popularity: 490 },
    { name: 'AWP | Silk Tiger',           weapon: 'AWP', rarity: 'CLASSIFIED',   exterior: 'FACTORY_NEW',   float: 0.02, price: 19.99,   stock: 18, categoryId: R('sniper-rifles'), collectionId: C('fracture'),         popularity: 470 },
    { name: 'AWP | Duality',              weapon: 'AWP', rarity: 'COVERT',       exterior: 'FACTORY_NEW',   float: 0.01, price: 179.99,  stock: 5,  categoryId: R('sniper-rifles'), collectionId: C('anubis'),           popularity: 640 },
    { name: 'AWP | Exoskeleton',          weapon: 'AWP', rarity: 'CLASSIFIED',   exterior: 'MINIMAL_WEAR',  float: 0.11, price: 22.99,   stock: 15, categoryId: R('sniper-rifles'), collectionId: C('kilowatt'),         popularity: 480 },
    { name: 'AWP | Fade',                 weapon: 'AWP', rarity: 'CLASSIFIED',   exterior: 'FACTORY_NEW',   float: 0.01, price: 249.99,  stock: 4,  categoryId: R('sniper-rifles'),                                      popularity: 810 },
    // ── M4A4 / M4A1-S ──
    { name: 'M4A4 | Howl',               weapon: 'M4A4',   rarity: 'CONTRABAND', exterior: 'MINIMAL_WEAR',  float: 0.12, price: 3500.00, stock: 1,  categoryId: R('rifles'),        popularity: 960 },
    { name: 'M4A1-S | Hyper Beast',      weapon: 'M4A1-S', rarity: 'COVERT',     exterior: 'FACTORY_NEW',   float: 0.04, price: 89.99,   stock: 8,  categoryId: R('rifles'),        popularity: 780 },
    { name: 'M4A1-S | Blue Phosphor',    weapon: 'M4A1-S', rarity: 'COVERT',     exterior: 'FACTORY_NEW',   float: 0.01, price: 55.99,   stock: 15, categoryId: R('rifles'),        collectionId: C('dreams-nightmares'), popularity: 760 },
    { name: 'M4A4 | Neo-Noir',           weapon: 'M4A4',   rarity: 'COVERT',     exterior: 'MINIMAL_WEAR',  float: 0.13, price: 179.99,  stock: 6,  categoryId: R('rifles'),        collectionId: C('clutch'),            popularity: 700 },
    { name: 'M4A1-S | Printstream',      weapon: 'M4A1-S', rarity: 'COVERT',     exterior: 'FACTORY_NEW',   float: 0.01, price: 129.99,  stock: 7,  categoryId: R('rifles'),        collectionId: C('fracture'),          popularity: 770 },
    { name: 'M4A4 | The Emperor',        weapon: 'M4A4',   rarity: 'COVERT',     exterior: 'FACTORY_NEW',   float: 0.02, price: 99.99,   stock: 8,  categoryId: R('rifles'),        collectionId: C('ancient'),           popularity: 690 },
    { name: 'M4A1-S | Welcome to the Jungle', weapon: 'M4A1-S', rarity: 'COVERT', exterior: 'FACTORY_NEW', float: 0.03, price: 44.99,   stock: 10, categoryId: R('rifles'),        collectionId: C('fracture'),          popularity: 660 },
    { name: 'M4A4 | Spider Lily',        weapon: 'M4A4',   rarity: 'COVERT',     exterior: 'FACTORY_NEW',   float: 0.01, price: 159.99,  stock: 5,  categoryId: R('rifles'),        collectionId: C('recoil'),            popularity: 740 },
    { name: 'M4A1-S | Master Piece',     weapon: 'M4A1-S', rarity: 'COVERT',     exterior: 'MINIMAL_WEAR',  float: 0.12, price: 89.99,   stock: 9,  categoryId: R('rifles'),        collectionId: C('clutch'),            popularity: 720 },
    { name: 'M4A4 | Desolate Space',     weapon: 'M4A4',   rarity: 'COVERT',     exterior: 'FACTORY_NEW',   float: 0.04, price: 49.99,   stock: 12, categoryId: R('rifles'),        collectionId: C('prisma-2'),          popularity: 610 },
    { name: 'M4A4 | Etch Lord',          weapon: 'M4A4',   rarity: 'COVERT',     exterior: 'FACTORY_NEW',   float: 0.01, price: 69.99,   stock: 10, categoryId: R('rifles'),        collectionId: C('kilowatt'),          popularity: 650 },
    { name: 'M4A1-S | Emphorosaur-S',    weapon: 'M4A1-S', rarity: 'COVERT',     exterior: 'FACTORY_NEW',   float: 0.02, price: 39.99,   stock: 12, categoryId: R('rifles'),        collectionId: C('snakebite'),         popularity: 580 },
    // ── Pistols ──
    { name: 'Glock-18 | Fade',           weapon: 'Glock-18',    rarity: 'RESTRICTED', exterior: 'FACTORY_NEW',  float: 0.02, price: 180.00,  stock: 5,  categoryId: R('pistols'),       popularity: 830 },
    { name: 'USP-S | Kill Confirmed',    weapon: 'USP-S',       rarity: 'COVERT',     exterior: 'MINIMAL_WEAR', float: 0.11, price: 55.00,   stock: 12, categoryId: R('pistols'),       collectionId: C('recoil'),            popularity: 690 },
    { name: 'Desert Eagle | Blaze',      weapon: 'Desert Eagle',rarity: 'CLASSIFIED', exterior: 'FACTORY_NEW',  float: 0.01, price: 350.00,  stock: 4,  categoryId: R('pistols'),       popularity: 850 },
    { name: 'P250 | See Ya Later',       weapon: 'P250',        rarity: 'CLASSIFIED', exterior: 'FACTORY_NEW',  float: 0.02, price: 89.99,   stock: 9,  categoryId: R('pistols'),       collectionId: C('dreams-nightmares'), popularity: 520 },
    { name: 'CZ75-Auto | Tigris',        weapon: 'CZ75-Auto',   rarity: 'RESTRICTED', exterior: 'FACTORY_NEW',  float: 0.01, price: 29.99,   stock: 20, categoryId: R('pistols'),       popularity: 480 },
    { name: 'USP-S | Printstream',       weapon: 'USP-S',       rarity: 'COVERT',     exterior: 'FACTORY_NEW',  float: 0.01, price: 89.99,   stock: 8,  categoryId: R('pistols'),       collectionId: C('fracture'),          popularity: 750 },
    { name: 'Desert Eagle | Printstream',weapon: 'Desert Eagle',rarity: 'COVERT',     exterior: 'FACTORY_NEW',  float: 0.01, price: 109.99,  stock: 7,  categoryId: R('pistols'),       collectionId: C('fracture'),          popularity: 730 },
    { name: 'Glock-18 | Neo-Noir',       weapon: 'Glock-18',    rarity: 'CLASSIFIED', exterior: 'FACTORY_NEW',  float: 0.02, price: 39.99,   stock: 11, categoryId: R('pistols'),       collectionId: C('clutch'),            popularity: 580 },
    { name: 'P2000 | Ocean Foam',        weapon: 'P2000',       rarity: 'CLASSIFIED', exterior: 'FACTORY_NEW',  float: 0.01, price: 44.99,   stock: 10, categoryId: R('pistols'),       collectionId: C('riptide'),           popularity: 540 },
    { name: 'USP-S | Orion',             weapon: 'USP-S',       rarity: 'CLASSIFIED', exterior: 'FACTORY_NEW',  float: 0.02, price: 34.99,   stock: 13, categoryId: R('pistols'),       collectionId: C('recoil'),            popularity: 560 },
    { name: 'Desert Eagle | Fennec Fox', weapon: 'Desert Eagle',rarity: 'CLASSIFIED', exterior: 'FACTORY_NEW',  float: 0.01, price: 59.99,   stock: 9,  categoryId: R('pistols'),       collectionId: C('snakebite'),         popularity: 600 },
    { name: 'Five-SeveN | Hyper Beast',  weapon: 'Five-SeveN',  rarity: 'COVERT',     exterior: 'FACTORY_NEW',  float: 0.03, price: 29.99,   stock: 14, categoryId: R('pistols'),       collectionId: C('dreams-nightmares'), popularity: 510 },
    { name: 'Glock-18 | Wasteland Rebel',weapon: 'Glock-18',    rarity: 'CLASSIFIED', exterior: 'FIELD_TESTED', float: 0.27, price: 19.99,   stock: 16, categoryId: R('pistols'),       collectionId: C('fracture'),          popularity: 460 },
    { name: 'P250 | Exchanger',          weapon: 'P250',        rarity: 'CLASSIFIED', exterior: 'FACTORY_NEW',  float: 0.02, price: 24.99,   stock: 15, categoryId: R('pistols'),       collectionId: C('kilowatt'),          popularity: 490 },
    // ── SMGs ──
    { name: 'MP9 | Wild Lily',           weapon: 'MP9',  rarity: 'COVERT',     exterior: 'FACTORY_NEW',  float: 0.02, price: 199.99,  stock: 6,  categoryId: R('smgs'),                                               popularity: 450 },
    { name: 'MP7 | Bloodsport',          weapon: 'MP7',  rarity: 'COVERT',     exterior: 'FACTORY_NEW',  float: 0.01, price: 89.99,   stock: 10, categoryId: R('smgs'),                                               popularity: 420 },
    { name: 'MP5-SD | Phosphor',         weapon: 'MP5-SD',rarity: 'COVERT',    exterior: 'FACTORY_NEW',  float: 0.03, price: 44.99,   stock: 12, categoryId: R('smgs'),          collectionId: C('prisma-2'),          popularity: 410 },
    { name: 'MAC-10 | Neon Rider',       weapon: 'MAC-10',rarity: 'COVERT',    exterior: 'FACTORY_NEW',  float: 0.02, price: 34.99,   stock: 14, categoryId: R('smgs'),          collectionId: C('dreams-nightmares'), popularity: 400 },
    { name: 'UMP-45 | Primal Saber',     weapon: 'UMP-45',rarity: 'COVERT',    exterior: 'FACTORY_NEW',  float: 0.01, price: 29.99,   stock: 15, categoryId: R('smgs'),          collectionId: C('fracture'),          popularity: 380 },
    { name: 'PP-Bizon | Embargo',        weapon: 'PP-Bizon',rarity: 'CLASSIFIED',exterior:'FACTORY_NEW', float: 0.02, price: 14.99,   stock: 18, categoryId: R('smgs'),          collectionId: C('anubis'),            popularity: 350 },
    { name: 'MP9 | Starlight Protector', weapon: 'MP9',  rarity: 'CLASSIFIED', exterior: 'FACTORY_NEW',  float: 0.01, price: 19.99,   stock: 16, categoryId: R('smgs'),          collectionId: C('dreams-nightmares'), popularity: 370 },
    { name: 'MAC-10 | Pipe Down',        weapon: 'MAC-10',rarity: 'CLASSIFIED', exterior: 'FACTORY_NEW', float: 0.02, price: 17.99,   stock: 17, categoryId: R('smgs'),          collectionId: C('riptide'),           popularity: 360 },
    // ── Heavy ──
    { name: 'MAG-7 | Monster Call',      weapon: 'MAG-7', rarity: 'CLASSIFIED', exterior: 'FACTORY_NEW', float: 0.02, price: 59.99,   stock: 15, categoryId: R('heavy'),         collectionId: C('dreams-nightmares'), popularity: 380 },
    { name: 'Nova | Windblown',          weapon: 'Nova',  rarity: 'CLASSIFIED', exterior: 'FACTORY_NEW', float: 0.01, price: 49.99,   stock: 18, categoryId: R('heavy'),         collectionId: C('dreams-nightmares'), popularity: 360 },
    { name: 'XM1014 | Zombie Offensive', weapon: 'XM1014',rarity: 'CLASSIFIED', exterior: 'FACTORY_NEW', float: 0.02, price: 39.99,   stock: 14, categoryId: R('heavy'),         collectionId: C('dreams-nightmares'), popularity: 340 },
    { name: 'Sawed-Off | Kiss♥Love',    weapon: 'Sawed-Off',rarity:'CLASSIFIED',exterior: 'FACTORY_NEW', float: 0.01, price: 34.99,   stock: 16, categoryId: R('heavy'),         collectionId: C('fracture'),          popularity: 320 },
    { name: 'MAG-7 | SWAG-7',           weapon: 'MAG-7', rarity: 'RESTRICTED', exterior: 'FIELD_TESTED', float: 0.28, price: 9.99,    stock: 22, categoryId: R('heavy'),         collectionId: C('recoil'),            popularity: 290 },
    { name: 'Nova | Toy Soldier',        weapon: 'Nova',  rarity: 'CLASSIFIED', exterior: 'FACTORY_NEW', float: 0.02, price: 24.99,   stock: 18, categoryId: R('heavy'),         collectionId: C('fracture'),          popularity: 310 },
    // ── Knives ──
    { name: 'Karambit | Doppler',        weapon: 'Karambit',     rarity: 'COVERT', exterior: 'FACTORY_NEW',  float: 0.005,price: 1200.00, stock: 3,  categoryId: R('knives'),        popularity: 930 },
    { name: 'Butterfly Knife | Fade',    weapon: 'Butterfly Knife',rarity:'COVERT',exterior: 'FACTORY_NEW',  float: 0.01, price: 950.00,  stock: 2,  categoryId: R('knives'),        popularity: 880 },
    { name: 'M9 Bayonet | Crimson Web',  weapon: 'M9 Bayonet',   rarity: 'COVERT', exterior: 'MINIMAL_WEAR', float: 0.14, price: 650.00,  stock: 4,  categoryId: R('knives'),        popularity: 820 },
    { name: 'Skeleton Knife | Slaughter',weapon: 'Skeleton Knife',rarity:'COVERT', exterior: 'FACTORY_NEW',  float: 0.01, price: 450.00,  stock: 5,  categoryId: R('knives'),        popularity: 760 },
    { name: 'Karambit | Tiger Tooth',    weapon: 'Karambit',     rarity: 'COVERT', exterior: 'FACTORY_NEW',  float: 0.01, price: 899.99,  stock: 2,  categoryId: R('knives'),        popularity: 900 },
    { name: 'Butterfly Knife | Marble Fade',weapon:'Butterfly Knife',rarity:'COVERT',exterior:'FACTORY_NEW', float: 0.01, price: 1499.99, stock: 1,  categoryId: R('knives'),        popularity: 870 },
    { name: 'Stiletto Knife | Doppler',  weapon: 'Stiletto Knife',rarity:'COVERT', exterior: 'FACTORY_NEW',  float: 0.01, price: 349.99,  stock: 4,  categoryId: R('knives'),        popularity: 800 },
    { name: 'Talon Knife | Tiger Tooth', weapon: 'Talon Knife',  rarity: 'COVERT', exterior: 'FACTORY_NEW',  float: 0.01, price: 399.99,  stock: 3,  categoryId: R('knives'),        popularity: 790 },
    { name: 'Gut Knife | Fade',          weapon: 'Gut Knife',    rarity: 'COVERT', exterior: 'FACTORY_NEW',  float: 0.02, price: 299.99,  stock: 5,  categoryId: R('knives'),        popularity: 740 },
    { name: 'Falchion Knife | Slaughter',weapon: 'Falchion Knife',rarity:'COVERT', exterior: 'FACTORY_NEW',  float: 0.01, price: 249.99,  stock: 5,  categoryId: R('knives'),        popularity: 720 },
    { name: 'Bowie Knife | Doppler',     weapon: 'Bowie Knife',  rarity: 'COVERT', exterior: 'FACTORY_NEW',  float: 0.01, price: 229.99,  stock: 6,  categoryId: R('knives'),        popularity: 700 },
    { name: 'Huntsman Knife | Fade',     weapon: 'Huntsman Knife',rarity:'COVERT', exterior: 'FACTORY_NEW',  float: 0.01, price: 219.99,  stock: 6,  categoryId: R('knives'),        popularity: 690 },
    { name: 'Navaja Knife | Doppler',    weapon: 'Navaja Knife', rarity: 'COVERT', exterior: 'FACTORY_NEW',  float: 0.01, price: 179.99,  stock: 7,  categoryId: R('knives'),        popularity: 660 },
    { name: 'Ursus Knife | Tiger Tooth', weapon: 'Ursus Knife',  rarity: 'COVERT', exterior: 'FACTORY_NEW',  float: 0.01, price: 199.99,  stock: 6,  categoryId: R('knives'),        popularity: 670 },
    // ── Gloves ──
    { name: 'Sport Gloves | Superconductor',weapon:'Sport Gloves',rarity:'EXTRAORDINARY',exterior:'MINIMAL_WEAR',float:0.13,price:799.99,stock:3,  categoryId: R('gloves'),        popularity: 840 },
    { name: 'Moto Gloves | Spearmint',   weapon: 'Moto Gloves',  rarity:'EXTRAORDINARY',exterior:'MINIMAL_WEAR',float:0.14,price:599.99, stock:4,  categoryId: R('gloves'),        popularity: 780 },
    { name: 'Specialist Gloves | Crimson Web',weapon:'Specialist Gloves',rarity:'EXTRAORDINARY',exterior:'MINIMAL_WEAR',float:0.13,price:699.99,stock:3,categoryId:R('gloves'),  popularity: 810 },
    { name: 'Hand Wraps | Cobalt Skulls',weapon:'Hand Wraps',    rarity:'EXTRAORDINARY',exterior:'MINIMAL_WEAR',float:0.14,price:549.99, stock:4,  categoryId: R('gloves'),        popularity: 770 },
    { name: 'Bloodhound Gloves | Guerrilla',weapon:'Bloodhound Gloves',rarity:'EXTRAORDINARY',exterior:'FIELD_TESTED',float:0.27,price:399.99,stock:5,categoryId:R('gloves'),    popularity: 730 },
    { name: 'Driver Gloves | Lunar Weave',weapon:'Driver Gloves',rarity:'EXTRAORDINARY',exterior:'FIELD_TESTED',float:0.28,price:349.99,stock:5,  categoryId: R('gloves'),        popularity: 700 },
    // ── StatTrak ──
    { name: 'StatTrak™ AK-47 | Redline', weapon: 'AK-47', rarity: 'CLASSIFIED', exterior: 'FIELD_TESTED', float: 0.25, price: 89.99,   stock: 5,  categoryId: R('rifles'),        popularity: 600, isStatTrak: true },
    { name: 'StatTrak™ AWP | Asiimov',   weapon: 'AWP',   rarity: 'COVERT',     exterior: 'FIELD_TESTED', float: 0.28, price: 159.99,  stock: 4,  categoryId: R('sniper-rifles'), popularity: 570, isStatTrak: true },
    { name: 'StatTrak™ M4A1-S | Printstream',weapon:'M4A1-S',rarity:'COVERT',   exterior: 'FACTORY_NEW',  float: 0.01, price: 249.99,  stock: 3,  categoryId: R('rifles'),        popularity: 610, isStatTrak: true },
    { name: 'StatTrak™ Glock-18 | Fade', weapon:'Glock-18',rarity:'RESTRICTED', exterior: 'FACTORY_NEW',  float: 0.02, price: 299.99,  stock: 3,  categoryId: R('pistols'),       popularity: 620, isStatTrak: true },
    { name: 'StatTrak™ USP-S | Kill Confirmed',weapon:'USP-S',rarity:'COVERT',  exterior: 'MINIMAL_WEAR', float: 0.11, price: 99.99,   stock: 4,  categoryId: R('pistols'),       popularity: 590, isStatTrak: true },
    // ── Souvenir ──
    { name: 'Souvenir AK-47 | Gold Arabesque',weapon:'AK-47',rarity:'COVERT',   exterior: 'FACTORY_NEW',  float: 0.01, price: 1499.99, stock: 2,  categoryId: R('rifles'),        popularity: 500, isSouvenir: true },
    { name: 'Souvenir AWP | Dragon Lore', weapon: 'AWP',   rarity: 'COVERT',     exterior: 'FIELD_TESTED', float: 0.28, price: 9999.99, stock: 1,  categoryId: R('sniper-rifles'), popularity: 890, isSouvenir: true },
  ];

  // Defaults for optional fields
  const skinDefaults = { floatMin: 0.0, floatMax: 1.0, isStatTrak: false, isSouvenir: false, description: null, lore: null, collectionId: null };

  let skinCount = 0;
  for (const skin of skinsData) {
    const data = { ...skinDefaults, ...skin };
    const existing = await prisma.skin.findFirst({ where: { name: data.name } });
    if (!existing) {
      await prisma.skin.create({ data: { ...data, images: '[]' } });
      skinCount++;
    }
  }
  console.log(`✅ Skins seeded: ${skinCount} new (${skinsData.length} total defined)`);

  // ─── Cases (30 cases) ────────────────────────────────────────────────────
  const casesData = [
    { name: 'Dreams & Nightmares Case', slug: 'dreams-nightmares', description: 'Community-created content inspired by dreams and nightmares.',   price: 2.49, isFeatured: true,  collectionId: C('dreams-nightmares') },
    { name: 'Recoil Case',              slug: 'recoil',             description: 'Part of the Recoil Collection featuring bold designs.',           price: 2.99, isFeatured: true,  collectionId: C('recoil') },
    { name: 'Revolution Case',          slug: 'revolution',         description: 'The Revolution Collection — community art at its finest.',        price: 2.79, isFeatured: true,  collectionId: C('revolution') },
    { name: 'Kilowatt Case',            slug: 'kilowatt',           description: 'The Kilowatt Collection — electric designs for the bold.',         price: 3.49, isFeatured: true,  collectionId: C('kilowatt') },
    { name: 'Snakebite Case',           slug: 'snakebite',          description: 'The Snakebite Collection — venomous designs await.',              price: 1.99, isFeatured: false, collectionId: C('snakebite') },
    { name: 'Riptide Case',             slug: 'riptide',            description: 'The Riptide Collection — deep ocean themed skins.',               price: 2.29, isFeatured: false, collectionId: C('riptide') },
    { name: 'Fracture Case',            slug: 'fracture',           description: 'Operation Fracture — a heist gone wrong.',                        price: 2.59, isFeatured: true,  collectionId: C('fracture') },
    { name: 'Prisma 2 Case',            slug: 'prisma-2',           description: 'The Prisma 2 Collection — vibrant colors and sharp designs.',     price: 2.19, isFeatured: false, collectionId: C('prisma-2') },
    { name: 'Ancient Case',             slug: 'ancient',            description: 'The Ancient Collection — legendary skins from the past.',         price: 3.29, isFeatured: true,  collectionId: C('ancient') },
    { name: 'Clutch Case',              slug: 'clutch',             description: 'The Clutch Collection — high-value skins for the pros.',          price: 2.89, isFeatured: false, collectionId: C('clutch') },
    { name: 'Operation Riptide Case',   slug: 'op-riptide',         description: 'Operation Riptide — exclusive mission rewards.',                  price: 3.59, isFeatured: true,  collectionId: C('riptide') },
    { name: 'Shattered Web Case',       slug: 'shattered-web',      description: 'Shattered Web Challenge — agent skins and more.',                price: 1.79, isFeatured: false, collectionId: C('recoil') },
    { name: 'CS20 Case',                slug: 'cs20',               description: 'CS20 Anniversary — celebrating 20 years of Counter-Strike.',    price: 4.99, isFeatured: true,  collectionId: null },
    { name: 'Broken Fang Case',         slug: 'broken-fang',        description: 'Operation Broken Fang — covert operatives unite.',               price: 2.39, isFeatured: false, collectionId: C('broken-fang') },
    { name: 'Spectrum 2 Case',          slug: 'spectrum-2',         description: 'Spectrum 2 — technological warfare skins.',                      price: 2.09, isFeatured: false, collectionId: null },
    { name: 'Conquer Case',             slug: 'conquer',            description: 'Conquer Case — ultra-rare collectibles for champions.',          price: 5.49, isFeatured: true,  collectionId: null },
    { name: 'Classified Case',          slug: 'classified',         description: 'Classified — top-secret weaponry awaits.',                       price: 3.19, isFeatured: false, collectionId: null },
    { name: 'Vertigo Case',             slug: 'vertigo',            description: 'Vertigo Case — dizzying designs and rare rewards.',              price: 2.99, isFeatured: false, collectionId: null },
    { name: 'Inferno Case',             slug: 'inferno',            description: 'Inferno — hot designs from the legendary map.',                  price: 2.49, isFeatured: true,  collectionId: null },
    { name: 'Mirage Case',              slug: 'mirage',             description: 'Mirage — mirages of beauty in every opening.',                   price: 2.69, isFeatured: false, collectionId: null },
    { name: 'Nuke Case',                slug: 'nuke',               description: 'Nuke — explosive designs for tactical players.',                 price: 3.09, isFeatured: false, collectionId: null },
    { name: 'Dust 2 Case',              slug: 'dust-2',             description: 'Dust 2 Legacy — the most iconic map series.',                    price: 2.29, isFeatured: true,  collectionId: null },
    { name: 'Cache Case',               slug: 'cache',              description: 'Cache — hidden treasures and secret skins.',                     price: 1.89, isFeatured: false, collectionId: null },
    { name: 'Overpass Case',            slug: 'overpass',           description: 'Overpass — bridge between styles and creativity.',              price: 2.39, isFeatured: false, collectionId: null },
    { name: 'Cobblestone Case',         slug: 'cobblestone',        description: 'Cobblestone Legacy — timeless and precious skins.',             price: 4.29, isFeatured: false, collectionId: null },
    { name: 'Phoenix Case',             slug: 'phoenix',            description: 'Phoenix Rising — rebirth of legendary designs.',                 price: 3.39, isFeatured: true,  collectionId: null },
    { name: 'Gamma Case',               slug: 'gamma',              description: 'Gamma — radiant energy in every unboxing.',                      price: 2.79, isFeatured: false, collectionId: null },
    { name: 'Gamma 2 Case',             slug: 'gamma-2',            description: 'Gamma 2 — more radiant, more powerful.',                        price: 2.99, isFeatured: true,  collectionId: null },
    { name: 'Glove Case',               slug: 'glove',              description: 'Glove Case — exclusively glove and hand skins.',                 price: 3.99, isFeatured: false, collectionId: null },
    { name: 'Danger Zone Case',         slug: 'danger-zone',        description: 'Danger Zone — ultimate thrill and rare drops.',                  price: 4.59, isFeatured: true,  collectionId: null },
  ];

  const caseMap = {};
  for (const c of casesData) {
    const cs = await prisma.case.upsert({ where: { slug: c.slug }, update: {}, create: c });
    caseMap[c.slug] = cs;
  }
  console.log('✅ Cases seeded:', casesData.length);

  // ─── Case Items — assign 30+ skins per case ───────────────────────────────
  // Drop rate weights by rarity (must sum per case to ~100)
  const DROP_RATES = {
    RESTRICTED:    50.0,
    CLASSIFIED:    25.0,
    COVERT:        15.0,
    CONTRABAND:     3.0,
    EXTRAORDINARY: 0.26,
  };

  // Curated skin pools per case (each list has 30+ unique skin names)
  const caseSkinsMap = {
    'dreams-nightmares': ['M4A1-S | Blue Phosphor','P250 | See Ya Later','MAG-7 | Monster Call','Nova | Windblown','XM1014 | Zombie Offensive','Five-SeveN | Hyper Beast','MP9 | Starlight Protector','MAC-10 | Pipe Down','AK-47 | Redline','AWP | Atheris','AWP | Asiimov','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','CZ75-Auto | Tigris','MP9 | Wild Lily','MP7 | Bloodsport','AK-47 | Neon Revolution','M4A4 | Neo-Noir','AK-47 | Bloodsport','AWP | Chromatic Aberration','M4A1-S | Emphorosaur-S','AK-47 | X-Ray','Glock-18 | Wasteland Rebel','PP-Bizon | Embargo','Nova | Toy Soldier','Sawed-Off | Kiss♥Love','MAG-7 | SWAG-7','AK-47 | Head Shot','P250 | Exchanger','Glock-18 | Neo-Noir'],
    'recoil': ['AK-47 | Redline','AK-47 | Vulcan','USP-S | Kill Confirmed','M4A4 | Spider Lily','AWP | Hyper Beast','USP-S | Orion','AWP | Fade','AK-47 | Slate','Glock-18 | Fade','Desert Eagle | Blaze','M4A1-S | Master Piece','AK-47 | Nightwish','AWP | Asiimov','M4A1-S | Hyper Beast','AK-47 | Neon Revolution','MP7 | Bloodsport','MAG-7 | SWAG-7','CZ75-Auto | Tigris','P2000 | Ocean Foam','AK-47 | Bloodsport','AWP | Chromatic Aberration','Glock-18 | Neo-Noir','AK-47 | Head Shot','USP-S | Printstream','Desert Eagle | Printstream','MP5-SD | Phosphor','PP-Bizon | Embargo','Five-SeveN | Hyper Beast','AK-47 | X-Ray','P250 | Exchanger','Nova | Toy Soldier'],
    'revolution': ['AK-47 | Asiimov','AK-47 | Neon Revolution','AWP | Asiimov','M4A1-S | Blue Phosphor','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','AK-47 | Redline','M4A4 | Neo-Noir','AWP | Wildfire','M4A4 | The Emperor','AK-47 | Vulcan','AWP | Duality','M4A1-S | Printstream','USP-S | Printstream','Desert Eagle | Fennec Fox','CZ75-Auto | Tigris','AK-47 | Jaguar','AWP | Hyper Beast','M4A1-S | Welcome to the Jungle','AK-47 | Bloodsport','AK-47 | Head Shot','Glock-18 | Neo-Noir','P250 | Exchanger','MP5-SD | Phosphor','MAC-10 | Neon Rider','AK-47 | X-Ray','AWP | Exoskeleton','AK-47 | Slate','PP-Bizon | Embargo'],
    'kilowatt': ['AK-47 | Nightwish','M4A4 | Etch Lord','P250 | Exchanger','AWP | Exoskeleton','AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','Desert Eagle | Blaze','M4A1-S | Hyper Beast','USP-S | Kill Confirmed','AK-47 | Vulcan','MP9 | Wild Lily','M4A4 | Neo-Noir','AWP | Wildfire','AK-47 | Bloodsport','CZ75-Auto | Tigris','AK-47 | Neon Revolution','M4A1-S | Blue Phosphor','Desert Eagle | Printstream','AWP | Hyper Beast','USP-S | Printstream','AK-47 | Jaguar','MAC-10 | Neon Rider','AK-47 | Head Shot','Glock-18 | Neo-Noir','MP5-SD | Phosphor','AK-47 | X-Ray','AWP | Chromatic Aberration','AK-47 | Slate','Nova | Toy Soldier','MAG-7 | SWAG-7'],
    'snakebite': ['Desert Eagle | Fennec Fox','AK-47 | Head Shot','M4A1-S | Emphorosaur-S','AWP | Atheris','AK-47 | Redline','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','AWP | Asiimov','CZ75-Auto | Tigris','AK-47 | Bloodsport','M4A1-S | Hyper Beast','AWP | Chromatic Aberration','USP-S | Orion','AK-47 | Jaguar','MP7 | Bloodsport','Glock-18 | Wasteland Rebel','P250 | See Ya Later','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','MAC-10 | Pipe Down','MP9 | Starlight Protector','Nova | Toy Soldier','MAG-7 | SWAG-7','Five-SeveN | Hyper Beast','P250 | Exchanger','Glock-18 | Neo-Noir'],
    'riptide': ['AWP | Containment Breach','P2000 | Ocean Foam','MAC-10 | Pipe Down','AK-47 | Bloodsport','AWP | Asiimov','AK-47 | Redline','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AWP | Hyper Beast','AK-47 | Vulcan','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','MP5-SD | Phosphor','AK-47 | X-Ray','Glock-18 | Neo-Noir','AWP | Chromatic Aberration','AK-47 | Slate','PP-Bizon | Embargo','MP9 | Starlight Protector','MAG-7 | SWAG-7','Nova | Toy Soldier','Five-SeveN | Hyper Beast','P250 | Exchanger'],
    'fracture': ['M4A1-S | Printstream','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','Sawed-Off | Kiss♥Love','Nova | Toy Soldier','AWP | Wildfire','M4A1-S | Welcome to the Jungle','AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Bloodsport','AWP | Silk Tiger','Glock-18 | Wasteland Rebel','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','MP5-SD | Phosphor','MAC-10 | Neon Rider','UMP-45 | Primal Saber','PP-Bizon | Embargo','AK-47 | Slate','P250 | Exchanger','Glock-18 | Neo-Noir'],
    'prisma-2': ['AK-47 | Fuel Injector','AK-47 | Point Disarray','AK-47 | X-Ray','MP5-SD | Phosphor','M4A4 | Desolate Space','AWP | Chromatic Aberration','AK-47 | Redline','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','AWP | Asiimov','MP9 | Wild Lily','M4A4 | Neo-Noir','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Neon Revolution','AK-47 | Bloodsport','MAC-10 | Neon Rider','UMP-45 | Primal Saber','Glock-18 | Neo-Noir','P2000 | Ocean Foam','AK-47 | Head Shot','AWP | Silk Tiger','AK-47 | Slate','PP-Bizon | Embargo','MP9 | Starlight Protector','MAC-10 | Pipe Down','Five-SeveN | Hyper Beast','P250 | Exchanger','Nova | Toy Soldier','MAG-7 | SWAG-7'],
    'ancient': ['AK-47 | Wild Lotus','AWP | The Prince','M4A4 | The Emperor','AWP | Duality','AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Vulcan','AWP | Hyper Beast','PP-Bizon | Embargo','MAC-10 | Neon Rider','AK-47 | Bloodsport','Glock-18 | Neo-Noir','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','MP5-SD | Phosphor','P250 | Exchanger','Nova | Toy Soldier','MAG-7 | SWAG-7'],
    'clutch': ['AK-47 | The Empress','M4A1-S | Master Piece','M4A4 | Neo-Noir','Glock-18 | Neo-Noir','AWP | Neo-Noir','USP-S | Orion','AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Neon Revolution','AK-47 | Bloodsport','AWP | Hyper Beast','AK-47 | Vulcan','Desert Eagle | Printstream','USP-S | Printstream','AK-47 | Jaguar','MAC-10 | Neon Rider','MP5-SD | Phosphor','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','P250 | Exchanger','Five-SeveN | Hyper Beast','Nova | Toy Soldier'],
    'op-riptide': ['AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Bloodsport','AWP | Hyper Beast','AK-47 | Vulcan','MAC-10 | Neon Rider','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','P250 | Exchanger','Five-SeveN | Hyper Beast','Nova | Toy Soldier','MAG-7 | SWAG-7','AK-47 | Fuel Injector','M4A1-S | Printstream','Glock-18 | Wasteland Rebel','P2000 | Ocean Foam'],
    'shattered-web': ['M4A1-S | Hyper Beast','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','AK-47 | Bloodsport','AWP | Hyper Beast','AK-47 | Vulcan','MAC-10 | Neon Rider','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','P250 | Exchanger','Five-SeveN | Hyper Beast','Nova | Toy Soldier','MAG-7 | SWAG-7','AK-47 | Fuel Injector','M4A1-S | Printstream','Glock-18 | Wasteland Rebel','P2000 | Ocean Foam','MAC-10 | Pipe Down'],
    'cs20': ['AK-47 | Dragon Lore','AWP | Dragon Lore','M4A4 | Howl','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','AK-47 | Bloodsport','AWP | Hyper Beast','AK-47 | Vulcan','MAC-10 | Neon Rider','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','P250 | Exchanger','Five-SeveN | Hyper Beast','Nova | Toy Soldier','MAG-7 | SWAG-7','Glock-18 | Neo-Noir'],
    'broken-fang': ['AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Bloodsport','AWP | Hyper Beast','AK-47 | Vulcan','MAC-10 | Neon Rider','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','P250 | Exchanger','Five-SeveN | Hyper Beast','Nova | Toy Soldier','MAG-7 | SWAG-7','AK-47 | Fuel Injector','M4A1-S | Printstream','Glock-18 | Wasteland Rebel','P2000 | Ocean Foam'],
    'spectrum-2': ['M4A1-S | Blue Phosphor','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','AK-47 | Bloodsport','AWP | Hyper Beast','AK-47 | Vulcan','MAC-10 | Neon Rider','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','P250 | Exchanger','Five-SeveN | Hyper Beast','Nova | Toy Soldier','MAG-7 | SWAG-7','AK-47 | Fuel Injector','M4A1-S | Printstream','Glock-18 | Wasteland Rebel'],
    'conquer': ['AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Bloodsport','AWP | Hyper Beast','AK-47 | Vulcan','MAC-10 | Neon Rider','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','P250 | Exchanger','Five-SeveN | Hyper Beast','Nova | Toy Soldier','MAG-7 | SWAG-7','AK-47 | Fuel Injector','M4A1-S | Printstream','Glock-18 | Wasteland Rebel','P2000 | Ocean Foam'],
    'classified': ['M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','AK-47 | Bloodsport','AWP | Hyper Beast','AK-47 | Vulcan','MAC-10 | Neon Rider','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','P250 | Exchanger','Five-SeveN | Hyper Beast','Nova | Toy Soldier','MAG-7 | SWAG-7','AK-47 | Fuel Injector','M4A1-S | Printstream','Glock-18 | Wasteland Rebel','P2000 | Ocean Foam'],
    'vertigo': ['AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Bloodsport','AWP | Hyper Beast','AK-47 | Vulcan','MAC-10 | Neon Rider','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','P250 | Exchanger','Five-SeveN | Hyper Beast','Nova | Toy Soldier','MAG-7 | SWAG-7','AK-47 | Fuel Injector','M4A1-S | Printstream','Glock-18 | Wasteland Rebel','P2000 | Ocean Foam'],
    'inferno': ['AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Bloodsport','AWP | Hyper Beast','AK-47 | Vulcan','MAC-10 | Neon Rider','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','P250 | Exchanger','Five-SeveN | Hyper Beast','Nova | Toy Soldier','MAG-7 | SWAG-7','AK-47 | Fuel Injector','M4A1-S | Printstream','Glock-18 | Wasteland Rebel','P2000 | Ocean Foam'],
    'mirage': ['AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Bloodsport','AWP | Hyper Beast','AK-47 | Vulcan','MAC-10 | Neon Rider','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','P250 | Exchanger','Five-SeveN | Hyper Beast','Nova | Toy Soldier','MAG-7 | SWAG-7','AK-47 | Fuel Injector','M4A1-S | Printstream','Glock-18 | Wasteland Rebel','P2000 | Ocean Foam'],
    'nuke': ['AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Bloodsport','AWP | Hyper Beast','AK-47 | Vulcan','MAC-10 | Neon Rider','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','P250 | Exchanger','Five-SeveN | Hyper Beast','Nova | Toy Soldier','MAG-7 | SWAG-7','AK-47 | Fuel Injector','M4A1-S | Printstream','Glock-18 | Wasteland Rebel','P2000 | Ocean Foam'],
    'dust-2': ['AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Bloodsport','AWP | Hyper Beast','AK-47 | Vulcan','MAC-10 | Neon Rider','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','P250 | Exchanger','Five-SeveN | Hyper Beast','Nova | Toy Soldier','MAG-7 | SWAG-7','AK-47 | Fuel Injector','M4A1-S | Printstream','Glock-18 | Wasteland Rebel','P2000 | Ocean Foam'],
    'cache': ['AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Bloodsport','AWP | Hyper Beast','AK-47 | Vulcan','MAC-10 | Neon Rider','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','P250 | Exchanger','Five-SeveN | Hyper Beast','Nova | Toy Soldier','MAG-7 | SWAG-7','AK-47 | Fuel Injector','M4A1-S | Printstream','Glock-18 | Wasteland Rebel','P2000 | Ocean Foam'],
    'overpass': ['AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Bloodsport','AWP | Hyper Beast','AK-47 | Vulcan','MAC-10 | Neon Rider','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','P250 | Exchanger','Five-SeveN | Hyper Beast','Nova | Toy Soldier','MAG-7 | SWAG-7','AK-47 | Fuel Injector','M4A1-S | Printstream','Glock-18 | Wasteland Rebel','P2000 | Ocean Foam'],
    'cobblestone': ['AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Bloodsport','AWP | Hyper Beast','AK-47 | Vulcan','MAC-10 | Neon Rider','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','P250 | Exchanger','Five-SeveN | Hyper Beast','Nova | Toy Soldier','MAG-7 | SWAG-7','AK-47 | Fuel Injector','M4A1-S | Printstream','Glock-18 | Wasteland Rebel','P2000 | Ocean Foam'],
    'phoenix': ['AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Bloodsport','AWP | Hyper Beast','AK-47 | Vulcan','MAC-10 | Neon Rider','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','P250 | Exchanger','Five-SeveN | Hyper Beast','Nova | Toy Soldier','MAG-7 | SWAG-7','AK-47 | Fuel Injector','M4A1-S | Printstream','Glock-18 | Wasteland Rebel','P2000 | Ocean Foam'],
    'gamma': ['AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Bloodsport','AWP | Hyper Beast','AK-47 | Vulcan','MAC-10 | Neon Rider','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','P250 | Exchanger','Five-SeveN | Hyper Beast','Nova | Toy Soldier','MAG-7 | SWAG-7','AK-47 | Fuel Injector','M4A1-S | Printstream','Glock-18 | Wasteland Rebel','P2000 | Ocean Foam'],
    'gamma-2': ['AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Bloodsport','AWP | Hyper Beast','AK-47 | Vulcan','MAC-10 | Neon Rider','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','P250 | Exchanger','Five-SeveN | Hyper Beast','Nova | Toy Soldier','MAG-7 | SWAG-7','AK-47 | Fuel Injector','M4A1-S | Printstream','Glock-18 | Wasteland Rebel','P2000 | Ocean Foam'],
    'glove': ['AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Bloodsport','AWP | Hyper Beast','AK-47 | Vulcan','MAC-10 | Neon Rider','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','P250 | Exchanger','Five-SeveN | Hyper Beast','Nova | Toy Soldier','MAG-7 | SWAG-7','AK-47 | Fuel Injector','M4A1-S | Printstream','Glock-18 | Wasteland Rebel','P2000 | Ocean Foam'],
    'danger-zone': ['AK-47 | Redline','AWP | Asiimov','Glock-18 | Fade','USP-S | Kill Confirmed','Desert Eagle | Blaze','MP9 | Wild Lily','M4A4 | Neo-Noir','AK-47 | Neon Revolution','CZ75-Auto | Tigris','M4A1-S | Hyper Beast','AK-47 | Bloodsport','AWP | Hyper Beast','AK-47 | Vulcan','MAC-10 | Neon Rider','USP-S | Printstream','Desert Eagle | Printstream','AK-47 | Jaguar','AK-47 | Head Shot','AWP | Chromatic Aberration','AK-47 | X-Ray','AK-47 | Slate','PP-Bizon | Embargo','P250 | Exchanger','Five-SeveN | Hyper Beast','Nova | Toy Soldier','MAG-7 | SWAG-7','AK-47 | Fuel Injector','M4A1-S | Printstream','Glock-18 | Wasteland Rebel','P2000 | Ocean Foam'],
  };

  for (const [slug, skinNames] of Object.entries(caseSkinsMap)) {
    const cs2case = caseMap[slug];
    if (!cs2case) continue;

    // Skip if already has items
    const existingItems = await prisma.caseItem.count({ where: { caseId: cs2case.id } });
    if (existingItems >= skinNames.length) continue;

    // Clear stale items so we can re-seed cleanly
    await prisma.caseItem.deleteMany({ where: { caseId: cs2case.id } });

    for (const skinName of skinNames) {
      const skin = await prisma.skin.findFirst({ where: { name: skinName } });
      if (!skin) { console.warn(`  ⚠️  Skin not found: "${skinName}"`); continue; }
      await prisma.caseItem.create({
        data: {
          caseId: cs2case.id,
          skinId: skin.id,
          dropRate: DROP_RATES[skin.rarity] || 20.0,
        },
      }).catch(() => {});
    }
    console.log(`  📦 ${cs2case.name}: ${skinNames.length} skins`);
  }
  console.log('✅ Case items seeded');

  // ─── Demo Recent Drops ────────────────────────────────────────────────────
  const topSkins = await prisma.skin.findMany({ take: 15, orderBy: { popularity: 'desc' } });
  const allCasesDb = await prisma.case.findMany({ take: 5 });
  const demoUsernames = ['Д.Тамир', 'А.Сарнай', 'Ч.Мөнгөнцэцэг', 'ProPlayer_MN', 'CS2_Boss', 'AK_Master', 'AWP_God', 'KnifeKing', 'MNGamer', 'TopFragger'];

  if (topSkins.length && allCasesDb.length) {
    const existingDrops = await prisma.recentDrop.count();
    if (existingDrops === 0) {
      for (let i = 0; i < 30; i++) {
        const skin = topSkins[i % topSkins.length];
        const c = allCasesDb[i % allCasesDb.length];
        await prisma.recentDrop.create({
          data: {
            userId: (i % 5) + 2,
            username: demoUsernames[i % demoUsernames.length],
            skinId: skin.id,
            caseId: c.id,
            caseName: c.name,
            price: skin.price,
          },
        });
      }
      console.log('✅ Recent drops seeded: 30');
    }
  }

  console.log('\n🎉 Marketplace seed completed!');
}

main()
  .catch((e) => { console.error('Seed error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
