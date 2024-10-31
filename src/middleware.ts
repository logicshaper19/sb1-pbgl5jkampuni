import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');

  // If no session cookie, redirect to login
  if (!sessionCookie?.value) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      const response = await fetch('http://localhost:3000/api/auth/me', {
        headers: {
          cookie: `session=${sessionCookie.value}`
        }
      });

      const user = await response.json();

      // If not admin, redirect to login
      if (!user?.isAdmin) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
