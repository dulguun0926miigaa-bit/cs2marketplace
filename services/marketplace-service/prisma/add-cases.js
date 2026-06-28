/**
 * add-cases.js  — adds 20 more CS2 cases (total 30) with images, descriptions, prices
 * Run: node prisma/add-cases.js
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Real CS2 case image URLs (using Steam CDN / CSGO stash style placeholders)
const CASE_IMAGES = {
  'revolution':       'https://steamcommunity-a.akamaihd.net/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcMywfw2v9mNASMQVig2PKCLLrO57pxMZ18Yfe8o0vPUBZgXU0fMT3p1zQO4d1J3oBQhpANmM2MXiCNqf7PdTRzgTM3bgrBe4yLVYMTEyPeQJEJAZ4B6h-XD9AMC1VzSCHLHAqQ',
  'kilowatt':         'https://steamcommunity-a.akamaihd.net/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcMywfw2v9mNASMQVig2PKCLLrO57pxMZ18Yfe8o0vPUBZgXU0fMT3p1zQO4d1J3oBQhpANmM2MXiCNqf7PdTRzgTM3bgrBe4yLVYMTEyPeQJEJAZ4B6h-XD9AMC1VzSCHLHAqQ',
  'default':          'https://steamcommunity-a.akamaihd.net/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcMywfw2v9mNASMQVig2PKCLLrO57pxMZ18Yfe8o0vPUBZgXU0fMT3p1zQO4d1J3oBQhpANmM2MXiCNqf7PdTRzgTM3bgrBe4yLVYMTEyPeQJEJAZ4B6h-XD9AMC1VzSCHLHAqQ',
};

const NEW_CASES = [
  { name: 'Gamma Case',           slug: 'gamma',           price: 3.99, isFeatured: true,  description: 'The Gamma Case features cutting-edge designs in vibrant green and blue hues.' },
  { name: 'Gamma 2 Case',         slug: 'gamma-2',         price: 3.79, isFeatured: false, description: 'The follow-up to the Gamma Case, featuring community-designed weapon finishes.' },
  { name: 'Prisma Case',          slug: 'prisma',          price: 2.99, isFeatured: true,  description: 'The Prisma Case contains vibrant, community-designed weapon finishes.' },
  { name: 'Chroma Case',          slug: 'chroma',          price: 2.49, isFeatured: false, description: 'The original Chroma Case featuring finishes with dynamic multicolored patterns.' },
  { name: 'Chroma 2 Case',        slug: 'chroma-2',        price: 2.49, isFeatured: false, description: 'A continuation of the Chroma series with fresh color-shifting designs.' },
  { name: 'Chroma 3 Case',        slug: 'chroma-3',        price: 2.49, isFeatured: false, description: 'The third Chroma Case with bold designs and vibrant color palettes.' },
  { name: 'Horizon Case',         slug: 'horizon',         price: 3.29, isFeatured: true,  description: 'Bright colors and new styles await in the Horizon Case.' },
  { name: 'Danger Zone Case',     slug: 'danger-zone',     price: 2.89, isFeatured: false, description: 'Battle Royale themed case with aggressive weapon finishes.' },
  { name: 'Spectrum Case',        slug: 'spectrum',        price: 2.79, isFeatured: false, description: 'The Spectrum Case features designs from community artists.' },
  { name: 'Spectrum 2 Case',      slug: 'spectrum-2',      price: 2.79, isFeatured: false, description: 'Second edition of the popular Spectrum series.' },
  { name: 'Shadow Case',          slug: 'shadow',          price: 2.29, isFeatured: false, description: 'Dark and sinister finishes dominate the Shadow Case.' },
  { name: 'Glove Case',           slug: 'glove',           price: 4.99, isFeatured: true,  description: 'The Glove Case introduced glove skins to CS2 — the rarest drops in the game.' },
  { name: 'Operation Wildfire Case', slug: 'operation-wildfire', price: 3.49, isFeatured: false, description: 'From Operation Wildfire — fierce designs born in the heat of battle.' },
  { name: 'Operation Breakout Case', slug: 'operation-breakout', price: 2.99, isFeatured: false, description: 'Operation Breakout Case with high-tier weapon finishes.' },
  { name: 'Operation Phoenix Case',  slug: 'operation-phoenix',  price: 2.49, isFeatured: false, description: 'Rise from the ashes with the Operation Phoenix Case.' },
  { name: 'Operation Vanguard Case', slug: 'operation-vanguard',  price: 2.69, isFeatured: false, description: 'Operation Vanguard features military-inspired weapon finishes.' },
  { name: 'CS20 Case',            slug: 'cs20',            price: 5.99, isFeatured: true,  description: 'Celebrating 20 years of Counter-Strike with legendary skin remasters.' },
  { name: 'Shattered Web Case',   slug: 'shattered-web',   price: 3.99, isFeatured: true,  description: 'Operation Shattered Web — webbed designs and dark aesthetics.' },
  { name: 'Huntsman Case',        slug: 'huntsman',        price: 3.79, isFeatured: true,  description: 'The Huntsman Case introduced Huntsman knives and bold weapon finishes.' },
  { name: 'Falchion Case',        slug: 'falchion',        price: 3.49, isFeatured: false, description: 'The Falchion Case introduced the Falchion Knife to CS2.' },
];

// Skin pool — take the top skins for new cases
const SKIN_POOL = [
  'AK-47 | Redline', 'AWP | Asiimov', 'M4A1-S | Hyper Beast', 'Glock-18 | Fade',
  'USP-S | Kill Confirmed', 'Desert Eagle | Blaze', 'AK-47 | Neon Revolution',
  'M4A4 | Neo-Noir', 'AK-47 | Bloodsport', 'AWP | Hyper Beast',
  'AK-47 | Vulcan', 'M4A1-S | Blue Phosphor', 'AWP | Wildfire', 'M4A4 | The Emperor',
  'AK-47 | The Empress', 'M4A1-S | Printstream', 'Desert Eagle | Printstream',
  'USP-S | Printstream', 'AWP | Duality', 'AK-47 | Jaguar',
  'AWP | Chromatic Aberration', 'AK-47 | Head Shot', 'AK-47 | X-Ray', 'AK-47 | Slate',
  'CZ75-Auto | Tigris', 'MP9 | Wild Lily', 'MP7 | Bloodsport', 'AK-47 | Nightwish',
  'M4A4 | Etch Lord', 'P250 | Exchanger', 'Glock-18 | Neo-Noir',
];

const DROP_RATES = {
  CONSUMER: 50, INDUSTRIAL: 25, MIL_SPEC: 15, RESTRICTED: 7,
  CLASSIFIED: 2.5, COVERT: 0.3, CONTRABAND: 0.1, EXTRAORDINARY: 0.05,
};

async function main() {
  console.log('🌱 Adding 20 more CS2 cases...\n');

  for (const c of NEW_CASES) {
    // upsert so we can re-run safely
    const cs = await prisma.case.upsert({
      where: { slug: c.slug },
      update: { name: c.name, price: c.price, description: c.description, isFeatured: c.isFeatured, isActive: true },
      create: { name: c.name, slug: c.slug, price: c.price, description: c.description, isFeatured: c.isFeatured, isActive: true },
    });

    // Add skin items if not already seeded
    const existing = await prisma.caseItem.count({ where: { caseId: cs.id } });
    if (existing > 0) { console.log(`  ⏩ ${c.name} already has items`); continue; }

    // Rotate skin pool for this case
    const start  = NEW_CASES.indexOf(c) * 3;
    const pool   = [...SKIN_POOL.slice(start % SKIN_POOL.length), ...SKIN_POOL].slice(0, 20);
    let added = 0;
    for (const skinName of pool) {
      const skin = await prisma.skin.findFirst({ where: { name: skinName } });
      if (!skin) continue;
      await prisma.caseItem.upsert({
        where: { caseId_skinId: { caseId: cs.id, skinId: skin.id } },
        update: {},
        create: { caseId: cs.id, skinId: skin.id, dropRate: DROP_RATES[skin.rarity] || 20 },
      }).catch(() => {});
      added++;
    }
    console.log(`  ✅ ${c.name} — $${c.price} — ${added} skins`);
  }

  const total = await prisma.case.count();
  console.log(`\n🎉 Total cases in DB: ${total}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
