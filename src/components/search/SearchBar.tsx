'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import type { Company } from '@/types';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search for registered companies in Kenya' }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/companies/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to fetch suggestions');
        const data = await response.json();
        setSuggestions(data.results);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleSuggestionClick = (company: Company) => {
    router.push(`/search/results?q=${encodeURIComponent(company.name)}`);
    setQuery('');
    setSuggestions([]);
  };

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search/results?q=${encodeURIComponent(query)}`);
      setSuggestions([]);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              onSearch('');
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
          </button>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg">
          <ul className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {suggestions.length === 1 ? (
              <li
                key={suggestions[0].id}
                onClick={() => {
                  router.push(`/search/results?q=${encodeURIComponent(suggestions[0].name)}`);
                  setQuery('');
                  setSuggestions([]);
                }}
                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{suggestions[0].name}</span>
                  <span className="text-sm text-gray-500">
                    Registration: {suggestions[0].registrationNumber}
                  </span>
                </div>
              </li>
            ) : (
              <li
                onClick={() => {
                  router.push(`/search/results?q=${encodeURIComponent(query)}`);
                  setQuery('');
                  setSuggestions([]);
                }}
                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">
                    {suggestions.length} results found
                  </span>
                  <span className="text-sm text-blue-600">See all</span>
                </div>
              </li>
            )}
          </ul>
        </div>
      )}

      {isLoading && query && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg">
          <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
        </div>
      )}
    </div>
  );
}