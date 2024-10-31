import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Find all companies where person is a director
    const directorships = await prisma.director.findMany({
      where: { id: params.id },
      include: {
        company: {
          include: {
            directors: true,
            shareholders: true
          }
        }
      }
    });

    // Find all companies where person is a shareholder
    const shareholdings = await prisma.shareholder.findMany({
      where: { id: params.id },
      include: {
        company: {
          include: {
            directors: true,
            shareholders: true
          }
        }
      }
    });

    // Combine and deduplicate companies
    const companies = [
      ...directorships.map(d => d.company),
      ...shareholdings.map(s => s.company)
    ].filter((company, index, self) => 
      index === self.findIndex((c) => c.id === company.id)
    );

    return NextResponse.json({ companies });
  } catch (error) {
    console.error('Error fetching related companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related companies' },
      { status: 500 }
    );
  }
} 