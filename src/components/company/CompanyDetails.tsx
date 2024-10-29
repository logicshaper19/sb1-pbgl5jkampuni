import React from 'react';
import { Company } from '../../types';

interface CompanyDetailsProps {
  company: Company;
}

export const CompanyDetails = ({ company }: CompanyDetailsProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Company Details</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Directors</h3>
          <div className="space-y-2">
            {company.directors.map((director) => (
              <div key={director.id} className="flex justify-between">
                <span className="text-gray-600">{director.name}</span>
                <span className="text-gray-500">{director.role}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Shareholders</h3>
          <div className="space-y-2">
            {company.shareholders.map((shareholder) => (
              <div key={shareholder.id} className="flex justify-between">
                <span className="text-gray-600">{shareholder.name}</span>
                <span className="text-gray-500">{shareholder.nationality}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};