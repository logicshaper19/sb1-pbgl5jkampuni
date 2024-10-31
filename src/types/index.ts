export * from './auth';
export * from './company';

// Add user types directly here if there's no separate user file
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
}