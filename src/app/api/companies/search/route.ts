import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const companies = await prisma.company.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { registrationNumber: { contains: query, mode: 'insensitive' } },
          { directors: {
            some: {
              name: { contains: query, mode: 'insensitive' }
            }
          }}
        ]
      },
      include: {
        directors: true,
      },
      take: 5 // Limit results for quick search
    });

    return NextResponse.json({
      results: companies
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search companies' }, 
      { status: 500 }
    );
  }
}
