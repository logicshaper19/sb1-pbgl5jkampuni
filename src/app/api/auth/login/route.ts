import { NextResponse } from 'next/server';
import type { User } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (email === 'test@example.com' && password === 'password') {
      const user: User = {
        id: '1',
        email,
        name: 'Test User',
        role: 'USER',
        isAdmin: false
      };

      return NextResponse.json(user);
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
