export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isAdmin: boolean;
}

export interface AuthUser extends User {
  isAdmin: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export const PERMISSIONS = {
  VIEW_COMPANIES: 'view_companies',
  EDIT_COMPANIES: 'edit_companies',
  DELETE_COMPANIES: 'delete_companies',
  VIEW_USERS: 'view_users',
  EDIT_USERS: 'edit_users',
  VIEW_ANALYTICS: 'view_analytics',
  EXPORT_DATA: 'export_data',
} as const;

export interface AuthState {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
}