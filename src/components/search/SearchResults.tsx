import React from 'react';
import { Link } from 'react-router-dom';
import { Company } from '../../types';

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

  return (
    <div className="space-y-4">
      {results.map((company) => (
        <Link
          key={company.id}
          to={`/company/${company.id}`}
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900">{company.name}</h2>
          <div className="mt-2 text-gray-600">
            <p>Registration: {company.registrationNumber}</p>
            <p>Status: {company.status}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};