// Create a new file for search-related types
import type { Company } from './company';

export interface SearchResult {
  results: Company[];
}

export interface SearchPageProps {
  searchParams: {
    q?: string;
    page?: string;
  };
} 