'use client';

import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <TopNav />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}