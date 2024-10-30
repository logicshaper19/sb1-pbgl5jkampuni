'use client';

import React, { useState } from 'react';
import { License } from '../../types';
import { Plus, Trash2, AlertTriangle, FileCheck, Calendar, Building2 } from 'lucide-react';

interface CompanyLicensesFormProps {
  licenses: License[];
  onChange: (licenses: License[]) => void;
}

export const CompanyLicensesForm = ({ licenses, onChange }: CompanyLicensesFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const validateLicense = (license: License): boolean => {
    if (!license.type || !license.number || !license.issuingAuthority) {
      setError('Type, number and issuing authority are required');
      return false;
    }
    if (new Date(license.expiryDate) < new Date()) {
      setError('Expiry date cannot be in the past');
      return false;
    }
    setError(null);
    return true;
  };

  const addLicense = () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    
    onChange([
      ...licenses,
      {
        id: `temp-${Date.now()}`,
        type: '',
        number: '',
        issuingAuthority: '',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: futureDate.toISOString().split('T')[0],
        status: 'ACTIVE',
      },
    ]);
  };

  const removeLicense = (index: number) => {
    onChange(licenses.filter((_, i) => i !== index));
  };

  const updateLicense = (index: number, field: keyof License, value: string) => {
    const updatedLicenses = licenses.map((license, i) => {
      if (i === index) {
        const updatedLicense = { 
          ...license, 
          [field]: value 
        };
        validateLicense(updatedLicense);
        return updatedLicense;
      }
      return license;
    });
    onChange(updatedLicenses);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Licenses & Permits</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add or modify company licenses and permits
          </p>
        </div>
        <button
          type="button"
          onClick={addLicense}
          className="flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add License
        </button>
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

      <div className="space-y-4">
        {licenses.map((license, index) => (
          <div key={license.id} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 border rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <FileCheck className="w-4 h-4 mr-2" />
                  License Type
                </span>
              </label>
              <select
                value={license.type}
                onChange={(e) => updateLicense(index, 'type', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                <option value="BUSINESS">Business License</option>
                <option value="TRADE">Trade License</option>
                <option value="PROFESSIONAL">Professional License</option>
                <option value="ENVIRONMENTAL">Environmental Permit</option>
                <option value="SAFETY">Safety Certification</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">License Number</label>
              <input
                type="text"
                value={license.number}
                onChange={(e) => updateLicense(index, 'number', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter license number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  Issuing Authority
                </span>
              </label>
              <input
                type="text"
                value={license.issuingAuthority}
                onChange={(e) => updateLicense(index, 'issuingAuthority', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter authority name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Issue Date
                </span>
              </label>
              <input
                type="date"
                value={license.issueDate.split('T')[0]}
                onChange={(e) => updateLicense(index, 'issueDate', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Expiry Date
                </span>
              </label>
              <input
                type="date"
                value={license.expiryDate.split('T')[0]}
                onChange={(e) => updateLicense(index, 'expiryDate', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <div className="flex items-center">
                <select
                  value={license.status}
                  onChange={(e) => updateLicense(index, 'status', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="EXPIRED">Expired</option>
                  <option value="PENDING">Pending Renewal</option>
                  <option value="REVOKED">Revoked</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeLicense(index)}
                  className="ml-2 p-1 text-red-600 hover:text-red-800"
                  title="Remove license"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 