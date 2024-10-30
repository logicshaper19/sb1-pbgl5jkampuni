'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Company } from '@/types';
import { Calendar, Building2, AlertCircle } from 'lucide-react';

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const router = useRouter();
  const [results, setResults] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/companies/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        setResults(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Search failed:', error);
        setError('Failed to fetch results');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (!query) return null;

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (query && (!results || results.length === 0)) {
    return (
      <div className="text-center py-8 text-gray-500">
        No companies found. Try a different search term.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array.isArray(results) && results.map((company) => (
        <div
          key={company.id}
          onClick={() => router.push(`/companies/${company.id}`)}
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{company.name}</h2>
              <div className="mt-2 space-y-2">
                <div className="flex items-center text-gray-600">
                  <Building2 className="w-4 h-4 mr-2" />
                  <span>Registration: {company.registrationNumber}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Registered: {new Date(company.registrationDate).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span>Status: {company.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}