import 'next-auth';
import type { User as PrismaUser } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: PrismaUser & {
      id: string;
      role: string;
      permissions?: string[];
    };
  }

  interface User extends PrismaUser {
    role: string;
    permissions?: string[];
  }
} 