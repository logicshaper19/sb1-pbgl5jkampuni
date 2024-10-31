'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Settings,
  LogOut 
} from 'lucide-react';

interface AdminNavProps {
  companyCount: number;
}

export default function AdminNav({ companyCount }: AdminNavProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname() ?? '/';

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-xl font-bold text-gray-900">
              kampuni
            </Link>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {companyCount} Companies
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user?.name || user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 font-medium flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
