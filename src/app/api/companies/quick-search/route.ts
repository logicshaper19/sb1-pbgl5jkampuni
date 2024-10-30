import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const companies = await prisma.company.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { registrationNumber: { contains: query, mode: 'insensitive' } },
        ]
      },
      select: {
        id: true,
        name: true,
        registrationNumber: true,
      },
      take: 5, // Limit to 5 quick results
    });

    return NextResponse.json({
      results: companies
    });

  } catch (error) {
    console.error('Quick search error:', error);
    return NextResponse.json(
      { error: 'Failed to search companies' }, 
      { status: 500 }
    );
  }
} 