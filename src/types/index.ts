export * from './auth';
export * from './company';

// Add user types directly here if there's no separate user file
export interface User {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
}

export interface Stats {
  totalCompanies: number;
  activeCompanies: number;
  totalTenders: number;
  totalEncumbrances: number;
  recentActivity: {
    date: string;
    companies: number;
  }[];
}