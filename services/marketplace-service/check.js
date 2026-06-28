const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function main() {
  const cases     = await p.case.count();
  const caseItems = await p.caseItem.count();
  const skins     = await p.skin.count();
  console.log('Cases:', cases, '| CaseItems:', caseItems, '| Skins:', skins);
  const list = await p.case.findMany({ select: { name: true, slug: true }, take: 15 });
  console.log('Case list:', list.map(c => c.name).join(', '));
}
main().finally(() => p.$disconnect());
