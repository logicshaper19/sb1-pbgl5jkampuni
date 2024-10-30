'use client';

import { useAuth } from '@/context/AuthContext';
import { SearchBar } from './search/SearchBar';
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
              <h1 className="text-xl font-bold">UseKampuni</h1>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/companies" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                Companies
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-full max-w-lg lg:max-w-xs">
              <SearchBar />
            </div>
            {user && user.name && (
              <div className="ml-4 flex items-center">
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