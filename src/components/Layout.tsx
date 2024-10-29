import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};