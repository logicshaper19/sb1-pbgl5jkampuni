import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import MainNav from '@/components/navigation/MainNav'
import { cookies } from 'next/headers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kampuni',
  description: 'Access accurate, real-time information about businesses across Africa.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <MainNav />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
