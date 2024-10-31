'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth status on mount
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data) setUser(data);
      })
      .catch(err => console.error('Auth check failed:', err))
      .finally(() => setLoading(false));
  }, []);

  const login = (email: string, password: string): Promise<string> => {
    return fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    .then(res => {
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    })
    .then(data => {
      setUser(data.user);
      return data.redirectUrl;
    });
  };

  const logout = (): Promise<void> => {
    return fetch('/api/auth/logout', {
      method: 'POST',
    })
    .then(() => {
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}