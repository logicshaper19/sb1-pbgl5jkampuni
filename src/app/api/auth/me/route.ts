import { NextResponse } from 'next/server';

export async function GET() {
  // For now, return 401 to indicate no active session
  return NextResponse.json(
    { error: 'Not authenticated' }, 
    { status: 401 }
  );
}
