import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    console.log('Login attempt for email:', email);
    
    const user = await prisma.user.findUnique({
      where: { email }
    });

    console.log('User found:', !!user);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await compare(password, user.password);
    
    console.log('Password valid:', isValidPassword);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Get the cookie store first
    const cookieStore = cookies();
    
    // Then set the cookie
    await cookieStore.set('session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      },
      redirectUrl: user.isAdmin ? '/admin' : '/'
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
