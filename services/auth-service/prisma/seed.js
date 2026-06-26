const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Seed roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'System administrator' },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'User' },
    update: {},
    create: { name: 'User', description: 'Regular user' },
  });

  console.log('Roles seeded:', adminRole.name, userRole.name);

  // Seed admin user
  const hashedPassword = await bcrypt.hash('Admin@12345', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cs2market.com' },
    update: {},
    create: {
      email: 'admin@cs2market.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Admin',
      isActive: true,
      isVerified: true,
      roleId: adminRole.id,
    },
  });

  console.log('Admin user seeded:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
