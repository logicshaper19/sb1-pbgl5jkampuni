const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create or update admin user
  await prisma.user.upsert({
    where: { email: 'admin@me.com' },
    update: {},
    create: {
      email: 'admin@me.com',
      name: 'Admin User',
      password: 'slp225khayega', // Remember to hash this in production
      isAdmin: true
    }
  });

  console.log('Admin user created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
