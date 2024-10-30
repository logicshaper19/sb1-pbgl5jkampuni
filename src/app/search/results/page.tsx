'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, Calendar, MapPin, ArrowUpRight } from 'lucide-react';
import type { Company } from '@/types';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') ?? '';
  const [results, setResults] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResults() {
      if (!query) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/companies/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to fetch results');
        const data = await response.json();
        setResults(data.results);
      } catch (error) {
        console.error('Search failed:', error);
        setError('Failed to load search results');
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Results Found</h1>
          <p className="text-sm text-gray-500 mt-1">
            {results.length} companies match your query
          </p>
        </div>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
          Export results
        </button>
      </div>

      <div className="space-y-4">
        {results.map((company) => (
          <Link
            key={company.id}
            href={`/companies/${company.id}`}
            className="block bg-white shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {company.name}
                    </h2>
                    <span className={`ml-2 inline-block w-2 h-2 rounded-full ${
                      company.status === 'ACTIVE' ? 'bg-green-400' : 'bg-yellow-400'
                    }`} />
                  </div>
                  
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-500">Company Number</p>
                      <p className="text-sm font-medium">{company.registrationNumber}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Registration Date</p>
                      <p className="text-sm font-medium">
                        {new Date(company.registrationDate).toLocaleDateString()}
                      </p>
                    </div>

                    {company.address && (
                      <div className="sm:col-span-2">
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-sm font-medium">{company.address.postalAddress}</p>
                      </div>
                    )}
                  </div>

                  {company.directors && company.directors.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-1">Directors</p>
                      <div className="flex flex-wrap gap-2">
                        {company.directors.map((director) => (
                          <span
                            key={director.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {director.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </Link>
        ))}

        {results.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No companies found matching "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
