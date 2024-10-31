'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { Company } from '@/types/company';
import { Calendar, Building2, AlertCircle } from 'lucide-react';

export interface SearchResultsProps {
  results: Company[];
}

export function SearchResults({ results }: SearchResultsProps) {
  const router = useRouter();

  if (!results) return null;

  if (!Array.isArray(results) || results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No companies found. Try a different search term.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((company) => (
        <div
          key={company.id}
          onClick={() => {
            console.log('Navigating to:', `/companies/${company.id}`);
            router.push(`/companies/${company.id}`);
          }}
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