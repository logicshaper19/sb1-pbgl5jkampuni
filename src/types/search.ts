// Create a new file for search-related types
export interface SearchResult {
  id: string;
  type: 'company' | 'person' | 'document';
  title: string;
  subtitle?: string;
  url: string;
} 