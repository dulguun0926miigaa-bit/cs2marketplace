const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function main() {
  const cases = await p.case.findMany({
    where: { isActive: true },
    orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
    include: { _count: { select: { caseItems: true } } },
  });
  console.log('Total active cases returned by exact service query:', cases.length);
  cases.forEach(c => console.log(` ${c.isFeatured ? '★' : ' '} ${c.name} - $${c.price} - ${c._count.caseItems} items`));
}
main().finally(() => p.$disconnect());
