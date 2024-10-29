import React from 'react';
import { Company } from '../../types';
import { Building2, Phone, Mail } from 'lucide-react';

interface CompanyHeaderProps {
  company: Company;
}

export const CompanyHeader = ({ company }: CompanyHeaderProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center">
          <Building2 className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">{company.registrationNumber}</span>
        </div>
        <div className="flex items-center">
          <Phone className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">{company.contactInfo.phone}</span>
        </div>
        <div className="flex items-center">
          <Mail className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">{company.contactInfo.email}</span>
        </div>
      </div>
      <div className="mt-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          company.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {company.status}
        </span>
      </div>
    </div>
  );
};