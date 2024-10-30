'use client';

import { SearchBar } from '../components/search/SearchBar';
import { SearchResults } from '../components/search/SearchResults';
import { useState } from 'react';
import type { Company } from '../types';

export default function Home() {
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(`/api/companies/search?q=${encodedQuery}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error('Search failed:', error);
      setError('Failed to search companies');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-24 px-4">
      <h1 className="text-4xl font-bold mb-8">Kampuni</h1>
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Search for registered companies in Kenya
          </p>
        </div>
        
        <SearchBar onSearch={handleSearch} />
        
        <div className="mt-8">
          {isLoading && searchResults && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          
          {error && (
            <div className="text-center text-red-500 bg-red-50 p-4 rounded-md">
              {error}
            </div>
          )}

          {!isLoading && !error && (
            <SearchResults results={searchResults} />
          )}
        </div>
      </div>
    </main>
  );
}
