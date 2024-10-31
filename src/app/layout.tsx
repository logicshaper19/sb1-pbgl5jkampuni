'use client';

import '@/app/globals.css'
import { TopNav } from '@/components/TopNav'
import { AuthProvider } from '@/context/AuthContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white">
        <AuthProvider>
          <TopNav />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
