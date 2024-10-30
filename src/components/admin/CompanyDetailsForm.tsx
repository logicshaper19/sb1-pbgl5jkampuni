'use client';

import React, { useState } from 'react';
import { Company } from '../../types';
import { AlertTriangle, Building, Globe, Calendar, FileText, Mail, Phone } from 'lucide-react';

interface CompanyDetailsFormProps {
  company: Company;
  onChange: (company: Company) => void;
}

export const CompanyDetailsForm = ({ company, onChange }: CompanyDetailsFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const validateCompany = (updatedCompany: Partial<Company>): boolean => {
    if (!updatedCompany.name || !updatedCompany.registrationNumber) {
      setError('Company name and registration number are required');
      return false;
    }
    if (updatedCompany.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedCompany.email)) {
      setError('Invalid email format');
      return false;
    }
    if (updatedCompany.phone && !/^\+?[\d\s-]{8,}$/.test(updatedCompany.phone)) {
      setError('Invalid phone number format');
      return false;
    }
    setError(null);
    return true;
  };

  const updateField = (field: keyof Company, value: string) => {
    const updatedCompany = {
      ...company,
      [field]: value,
    };
    if (validateCompany(updatedCompany)) {
      onChange(updatedCompany);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Company Details</h3>
        <p className="mt-1 text-sm text-gray-500">
          Basic information about the company
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Validation Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            <span className="flex items-center">
              <Building className="w-4 h-4 mr-2" />
              Company Name
            </span>
          </label>
          <input
            type="text"
            value={company.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Legal company name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            <span className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Registration Number
            </span>
          </label>
          <input
            type="text"
            value={company.registrationNumber}
            onChange={(e) => updateField('registrationNumber', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Company registration number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Incorporation Date
            </span>
          </label>
          <input
            type="date"
            value={company.incorporationDate?.split('T')[0] || ''}
            onChange={(e) => updateField('incorporationDate', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="YYYY-MM-DD"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            <span className="flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Website
            </span>
          </label>
          <input
            type="url"
            value={company.website || ''}
            onChange={(e) => updateField('website', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            <span className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </span>
          </label>
          <input
            type="email"
            value={company.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="company@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            <span className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Phone
            </span>
          </label>
          <input
            type="tel"
            value={company.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="+1 234 567 8900"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={company.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Brief description of the company"
          />
        </div>
      </div>
    </div>
  );
};
