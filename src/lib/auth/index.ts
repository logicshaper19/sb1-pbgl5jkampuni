import { authConfig } from './config';  // Use relative path
import NextAuth from 'next-auth';

export const { auth } = NextAuth(authConfig); 