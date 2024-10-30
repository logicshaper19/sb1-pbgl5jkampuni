'use client';

import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ClientLayout } from '../components/ClientLayout';
import type { Metadata } from 'next';

// Define metadata directly in the layout file
const metadata: Metadata = {
  title: 'UseKampuni',
  description: 'Business Registration Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
