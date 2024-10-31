'use server';

import type { Company } from '@/types/company';

export async function searchCompanies(query: string): Promise<Company[]> {
  try {
    const response = await fetch(`${process.env.API_URL}/api/companies/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search failed');
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}
