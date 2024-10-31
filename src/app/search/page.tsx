'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchResults } from '@/components/search/SearchResults';
import { Search as SearchIcon } from 'lucide-react';
import type { Company } from '@/types/company';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams?.get('q') || '');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setCompanies([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/companies/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setCompanies(data.results || []);
    } catch (err) {
      setError('An unexpected error occurred');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial search from URL params
  useEffect(() => {
    const query = searchParams?.get('q');
    if (query) {
      setSearchTerm(query);
      performSearch(query);
    }
  }, [searchParams, performSearch]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchTerm(query);
    performSearch(query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Search Companies</h1>
      
      <div className="relative mb-8">
        <input
          type="text"
          className="w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search by company name, registration number, or director"
          value={searchTerm}
          onChange={handleSearch}
          disabled={loading}
        />
        <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {!loading && !error && <SearchResults results={companies} />}

      {!loading && searchTerm.length >= 2 && companies.length === 0 && !error && (
        <div className="text-center py-8 text-gray-500">
          No companies found matching your search criteria
        </div>
      )}
    </div>
  );
}