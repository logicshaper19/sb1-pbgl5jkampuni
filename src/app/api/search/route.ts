import { NextResponse } from 'next/server';
import type { SearchResult } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  const results: SearchResult[] = [
    {
      id: '1',
      type: 'company',
      title: 'Example Company Ltd',
      subtitle: 'Registration: 123456',
      url: '/companies/1'
    }
  ];

  return NextResponse.json(results);
} 