'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { User } from '@/types';

export function TopNav() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">kampuni</h1>
            </Link>
          </div>
          
          <div className="flex items-center">
            {user && user.name && (
              <div className="flex items-center">
                <span className="text-gray-900">{user.name}</span>
                <button
                  onClick={() => logout()}
                  className="ml-4 text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}