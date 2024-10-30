'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Building2, Users, Calendar, MapPin } from 'lucide-react';
import type { Company } from '@/types';

interface CompanyDetailsProps {
  company: Company;
}

export function CompanyDetails({ company }: CompanyDetailsProps) {
  const [showAllDirectors, setShowAllDirectors] = useState(false);
  const displayedDirectors = showAllDirectors ? company.directors : company.directors.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Details</h2>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-start space-x-3">
            <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Registration</h3>
              <p className="mt-1 text-sm text-gray-900">
                {company.registrationNumber}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Incorporation Date</h3>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(company.registrationDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Registered Address</h3>
              <p className="mt-1 text-sm text-gray-900">
                {company.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Directors</h2>
        <div className="space-y-4">
          {displayedDirectors.map((director, index) => (
            <div 
              key={director.id} 
              className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50"
            >
              <Users className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{director.name}</h3>
                <div className="mt-1 text-sm text-gray-500">
                  <p>Appointed: {new Date(director.appointmentDate).toLocaleDateString()}</p>
                  {director.nationality && (
                    <p>Nationality: {director.nationality}</p>
                  )}
                  {director.position && (
                    <p>Position: {director.position}</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {company.directors.length > 3 && (
            <button
              onClick={() => setShowAllDirectors(!showAllDirectors)}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {showAllDirectors ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Show All Directors ({company.directors.length})
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {company.description && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600">{company.description}</p>
          </div>
        </div>
      )}

      {company.industryClassification && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Industry Classification</h2>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">{company.industryClassification}</p>
          </div>
        </div>
      )}

      {company.complianceStatus && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Compliance Status</h2>
          <div className={`rounded-lg p-3 ${
            company.complianceStatus === 'COMPLIANT' 
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}>
            <p className="text-sm font-medium">{company.complianceStatus}</p>
          </div>
        </div>
      )}
    </div>
  );
}