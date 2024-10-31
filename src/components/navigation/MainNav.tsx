'use client';

import Link from 'next/link';

export default function MainNav() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              kampuni
            </Link>
          </div>
          
          <div className="flex items-center">
            <Link
              href="/login"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 