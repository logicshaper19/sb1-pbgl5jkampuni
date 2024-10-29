import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminTopNav = () => {
  const { logout } = useAuth();

  return (
    <div className="bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-white text-xl font-bold">Admin Panel</h1>
            <nav className="ml-10 flex items-baseline space-x-4">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Overview
              </NavLink>
              <NavLink
                to="/admin/companies"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <Building2 className="w-4 h-4 mr-2" />
                Companies
              </NavLink>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <Users className="w-4 h-4 mr-2" />
                Users
              </NavLink>
            </nav>
          </div>
          <button
            onClick={logout}
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};