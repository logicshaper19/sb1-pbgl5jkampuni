import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma';

async function createAdminUser() {
  const password = 'slp225khayega';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email: 'admin@me.com',
        password: hashedPassword,
        name: 'Admin User',
        isAdmin: true,
      },
    });
    console.log('Admin user created:', user.email);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
