import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params?.id) {
    return NextResponse.json(
      { error: 'Company ID is required' },
      { status: 400 }
    );
  }

  try {
    const company = await prisma.company.findUnique({
      where: {
        id: String(params.id)  // Ensure id is a string
      },
      include: {
        directors: true,
        shareholders: true,
        address: true,
        contactInfo: true,
        // Only include relations that exist in your schema
        // Remove or comment out relations that aren't defined yet
        // financials: true,
        // changes: true,
        // relatedEntities: true,
        // observations: true
      }
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company details' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Convert existing company update logic
}
