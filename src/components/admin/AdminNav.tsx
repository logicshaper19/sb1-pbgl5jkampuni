'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Settings,
  LogOut 
} from 'lucide-react';

export function AdminNav() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') {
      return true;
    }
    return path !== '/admin' && pathname.startsWith(path);
  };

  const navItems = [
    {
      href: '/admin',
      label: 'Overview',
      icon: LayoutDashboard
    },
    {
      href: '/admin/companies',
      label: 'Companies',
      icon: Building2
    },
    {
      href: '/admin/users',
      label: 'Users',
      icon: Users
    },
    {
      href: '/admin/settings',
      label: 'Settings',
      icon: Settings
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-900 w-64">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center px-6 py-3 text-sm font-medium transition-colors
              ${isActive(item.href)
                ? 'text-white bg-gray-800'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }
            `}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
