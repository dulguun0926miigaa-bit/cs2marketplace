const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function main() {
  const all = await p.case.findMany({ select: { name: true, isActive: true, isFeatured: true } });
  console.log('Total:', all.length);
  console.log('Active:', all.filter(c => c.isActive).length);
  console.log('Inactive:', all.filter(c => !c.isActive).length);
  all.filter(c => !c.isActive).forEach(c => console.log('  INACTIVE:', c.name));
}
main().finally(() => p.$disconnect());
