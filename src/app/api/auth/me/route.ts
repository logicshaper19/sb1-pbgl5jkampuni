import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get user ID from session cookie
    const sessionCookie = cookies().get('session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json(null);
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

    if (!user) {
      return NextResponse.json(null);
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(null);
  }
}
