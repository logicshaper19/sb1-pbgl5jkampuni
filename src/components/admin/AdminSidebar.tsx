import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar = () => {
  const { logout } = useAuth();

  return (
    <div className="w-64 bg-gray-900 text-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      <nav className="mt-6">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white ${
              isActive ? 'bg-gray-800 text-white' : ''
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Overview
        </NavLink>
        <NavLink
          to="/admin/companies"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white ${
              isActive ? 'bg-gray-800 text-white' : ''
            }`
          }
        >
          <Building2 className="w-5 h-5 mr-3" />
          Companies
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white ${
              isActive ? 'bg-gray-800 text-white' : ''
            }`
          }
        >
          <Users className="w-5 h-5 mr-3" />
          Users
        </NavLink>
      </nav>
      <div className="absolute bottom-0 w-64 p-6">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};