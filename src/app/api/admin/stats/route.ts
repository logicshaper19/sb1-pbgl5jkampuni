import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [totalCompanies, activeCompanies, totalTenders, totalEncumbrances] = await Promise.all([
      prisma.company.count(),
      prisma.company.count({ where: { status: 'ACTIVE' } }),
      prisma.tender.count(),
      prisma.encumbrance.count(),
    ]);

    // Get recent company registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentCompanies = await prisma.company.groupBy({
      by: ['registrationDate'],
      where: {
        registrationDate: {
          gte: sevenDaysAgo
        }
      },
      _count: true,
    });

    const recentActivity = recentCompanies.map(item => ({
      date: item.registrationDate.toISOString().split('T')[0],
      companies: item._count
    }));

    return NextResponse.json({
      totalCompanies,
      activeCompanies,
      totalTenders,
      totalEncumbrances,
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
} 