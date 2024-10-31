'use client';

import { useAuth } from '@/hooks/useAuth';
import { AdminNav } from '@/components/admin/AdminNav';
import { redirect } from 'next/navigation';
import type { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth() as AuthState;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      
      <main className="flex-1 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
