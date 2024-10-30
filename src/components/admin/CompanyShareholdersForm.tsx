'use client';

import React, { useState } from 'react';
import { Shareholder } from '../../types';
import { Plus, Trash2, AlertTriangle, Users, Percent, Calendar } from 'lucide-react';

interface CompanyShareholdersFormProps {
  shareholders: Shareholder[];
  onChange: (shareholders: Shareholder[]) => void;
}

export const CompanyShareholdersForm = ({ shareholders, onChange }: CompanyShareholdersFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const validateShareholder = (shareholder: Shareholder): boolean => {
    if (!shareholder.name || !shareholder.percentage) {
      setError('Name and percentage are required');
      return false;
    }
    if (shareholder.percentage < 0 || shareholder.percentage > 100) {
      setError('Percentage must be between 0 and 100');
      return false;
    }
    
    // Calculate total percentage
    const totalPercentage = shareholders.reduce((sum, s) => sum + s.percentage, 0);
    if (totalPercentage > 100) {
      setError('Total shareholding cannot exceed 100%');
      return false;
    }
    
    setError(null);
    return true;
  };

  const addShareholder = () => {
    onChange([
      ...shareholders,
      {
        id: `temp-${Date.now()}`,
        name: '',
        percentage: 0,
        type: 'INDIVIDUAL',
        acquisitionDate: new Date().toISOString().split('T')[0],
      },
    ]);
  };

  const removeShareholder = (index: number) => {
    onChange(shareholders.filter((_, i) => i !== index));
  };

  const updateShareholder = (index: number, field: keyof Shareholder, value: string) => {
    const updatedShareholders = shareholders.map((shareholder, i) => {
      if (i === index) {
        const updatedShareholder = { 
          ...shareholder, 
          [field]: field === 'percentage' ? parseFloat(value) : value 
        };
        validateShareholder(updatedShareholder);
        return updatedShareholder;
      }
      return shareholder;
    });
    onChange(updatedShareholders);
  };

  const getTotalPercentage = () => {
    return shareholders.reduce((sum, shareholder) => sum + shareholder.percentage, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Shareholders</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add or modify company shareholders
          </p>
        </div>
        <button
          type="button"
          onClick={addShareholder}
          className="flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-1" />
          Ad
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
        {shareholders.map((shareholder, index) => (
          <div key={shareholder.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Name
                </span>
              </label>
              <input
                type="text"
                value={shareholder.name}
                onChange={(e) => updateShareholder(index, 'name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Shareholder name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <Percent className="w-4 h-4 mr-2" />
                  Percentage
                </span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={shareholder.percentage}
                onChange={(e) => updateShareholder(index, 'percentage', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={shareholder.type}
                onChange={(e) => updateShareholder(index, 'type', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="INDIVIDUAL">Individual</option>
                <option value="CORPORATE">Corporate</option>
                <option value="TRUST">Trust</option>
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Acquisition Date
                </span>
              </label>
              <div className="flex items-center">
                <input
                  type="date"
                  value={shareholder.acquisitionDate.split('T')[0]}
                  onChange={(e) => updateShareholder(index, 'acquisitionDate', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeShareholder(index)}
                  className="ml-2 p-1 text-red-600 hover:text-red-800"
                  title="Remove shareholder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {shareholders.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          Total shareholding: {getTotalPercentage().toFixed(2)}%
        </div>
      )}
    </div>
  );
}; 