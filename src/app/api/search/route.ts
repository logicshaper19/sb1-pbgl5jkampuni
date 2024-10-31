import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    const results = await prisma.company.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { registrationNumber: { contains: query, mode: 'insensitive' } }
        ]
      }
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
} 