export * from './types/company';

export interface User {
  id: string;
  name?: string;
  isAdmin?: boolean;
  // ... other user properties
} 