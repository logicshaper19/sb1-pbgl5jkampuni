'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import type { User } from '@/types';

interface TopNavProps {
  companyCount: number;
}

export default function TopNav({ companyCount }: TopNavProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const displayName = user?.name || 'User';

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              kampuni
            </Link>
            <span className="ml-4 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {companyCount} Companies
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-gray-700">{displayName}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
