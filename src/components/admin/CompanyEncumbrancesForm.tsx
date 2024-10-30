'use client';

import React, { useState } from 'react';
import { Encumbrance } from '../../types';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';

interface CompanyEncumbrancesFormProps {
  encumbrances: Encumbrance[];
  onChange: (encumbrances: Encumbrance[]) => void;
}

export const CompanyEncumbrancesForm = ({ encumbrances, onChange }: CompanyEncumbrancesFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const validateEncumbrance = (encumbrance: Encumbrance): boolean => {
    if (!encumbrance.type || !encumbrance.amount) {
      setError('Type and amount are required');
      return false;
    }
    if (encumbrance.amount < 0) {
      setError('Amount cannot be negative');
      return false;
    }
    setError(null);
    return true;
  };

  const addEncumbrance = () => {
    onChange([
      ...encumbrances,
      {
        id: `temp-${Date.now()}`,
        type: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
        description: '',
      },
    ]);
  };

  const removeEncumbrance = (index: number) => {
    onChange(encumbrances.filter((_, i) => i !== index));
  };

  const updateEncumbrance = (index: number, field: keyof Encumbrance, value: string) => {
    const updatedEncumbrances = encumbrances.map((encumbrance, i) => {
      if (i === index) {
        const updatedEncumbrance = { 
          ...encumbrance, 
          [field]: field === 'amount' ? parseFloat(value) : value 
        };
        validateEncumbrance(updatedEncumbrance);
        return updatedEncumbrance;
      }
      return encumbrance;
    });
    onChange(updatedEncumbrances);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Encumbrances</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add or modify company encumbrances and liens
          </p>
        </div>
        <button
          type="button"
          onClick={addEncumbrance}
          className="flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Encumbrance
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

      {encumbrances.map((encumbrance, index) => (
        <div key={encumbrance.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={encumbrance.type}
              onChange={(e) => updateEncumbrance(index, 'type', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select type</option>
              <option value="MORTGAGE">Mortgage</option>
              <option value="LIEN">Lien</option>
              <option value="CHARGE">Charge</option>
              <option value="DEBENTURE">Debenture</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              min="0"
              value={encumbrance.amount}
              onChange={(e) => updateEncumbrance(index, 'amount', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={encumbrance.date.split('T')[0]}
              onChange={(e) => updateEncumbrance(index, 'date', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={encumbrance.status}
              onChange={(e) => updateEncumbrance(index, 'status', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="DISCHARGED">Discharged</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <div className="flex items-center">
              <input
                type="text"
                value={encumbrance.description}
                onChange={(e) => updateEncumbrance(index, 'description', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Optional description"
              />
              <button
                type="button"
                onClick={() => removeEncumbrance(index)}
                className="ml-2 p-1 text-red-600 hover:text-red-800"
                title="Remove encumbrance"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};