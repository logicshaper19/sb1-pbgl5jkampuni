import { NextResponse } from 'next/server';
import type { User, UserRole } from '@/types/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user: User = {
      id: '1',
      email: body.email,
      role: 'ADMIN' as UserRole,
      isAdmin: true
    };

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
