'use client';

import React from 'react';
import { TopNav } from './TopNav';

interface LayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: LayoutProps) {
  return (
    <div>
      <TopNav />
      <main>{children}</main>
    </div>
  );
}
