// Remove 'use client' since we want this to be a Server Component
import AdminNav from '@/components/admin/AdminNav';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get session on the server side
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  
  if (!sessionCookie) {
    redirect('/login');
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { id: sessionCookie },
    select: {
      id: true,
      email: true,
      name: true,
      isAdmin: true
    }
  });

  if (!user?.isAdmin) {
    redirect('/login');
  }

  // Get company count from database
  const companyCount = await prisma.company.count();

  return (
    <div>
      <AdminNav companyCount={companyCount} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
