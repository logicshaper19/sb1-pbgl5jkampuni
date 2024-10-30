import React from 'react';
import Link from 'next/link';
import { Company } from '../../types';
import { Calendar, Users, Building2, AlertCircle } from 'lucide-react';

interface SearchResultsProps {
  results: Company[];
}

export const SearchResults = ({ results }: SearchResultsProps) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No companies found. Try a different search term.
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {results.map((company) => (
        <Link
          key={company.id}
          href={`/company/${company.id}`}
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{company.name}</h2>
              <div className="mt-2 space-y-2">
                <div className="flex items-center text-gray-600">
                  <Building2 className="w-4 h-4 mr-2" />
                  <span>Registration: {company.registrationNumber}</span>
                </div>
                
                {company.incorporationDate && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Registered: {formatDate(company.incorporationDate)}</span>
                  </div>
                )}

                <div className="flex items-center text-gray-600">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span>Status: {company.status}</span>
                </div>
              </div>
            </div>

            {company.shareholders && company.shareholders.length > 0 && (
              <div className="ml-6">
                <h3 className="text-sm font-medium text-gray-700 flex items-center mb-2">
                  <Users className="w-4 h-4 mr-1" />
                  Shareholders
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  {company.shareholders.slice(0, 3).map((shareholder) => (
                    <div key={shareholder.id} className="flex justify-between">
                      <span>{shareholder.name}</span>
                      <span className="ml-4 text-gray-500">{shareholder.percentage}%</span>
                    </div>
                  ))}
                  {company.shareholders.length > 3 && (
                    <div className="text-sm text-blue-600">
                      +{company.shareholders.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {company.description && (
            <p className="mt-4 text-gray-600 text-sm line-clamp-2">
              {company.description}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
};