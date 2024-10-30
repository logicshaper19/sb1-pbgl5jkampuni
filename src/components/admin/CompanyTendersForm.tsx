'use client';

import React, { useState } from 'react';
import { Tender } from '../../types';
import { Plus, Trash2, AlertTriangle, Building2, Calendar, DollarSign } from 'lucide-react';

interface CompanyTendersFormProps {
  tenders: Tender[];
  onChange: (tenders: Tender[]) => void;
}

export const CompanyTendersForm = ({ tenders, onChange }: CompanyTendersFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const validateTender = (tender: Tender): boolean => {
    if (!tender.projectName || !tender.governmentEntity || !tender.amount) {
      setError('All required fields must be filled');
      return false;
    }
    if (tender.amount < 0) {
      setError('Amount cannot be negative');
      return false;
    }
    setError(null);
    return true;
  };

  const addTender = () => {
    const newTender: Tender = {
      id: `temp-${Date.now()}`,
      projectName: '',
      amount: 0,
      awardDate: new Date().toISOString().split('T')[0],
      completionStatus: 'AWARDED',
      governmentEntity: '',
    };
    onChange([...tenders, newTender]);
  };

  const removeTender = (index: number) => {
    onChange(tenders.filter((_, i) => i !== index));
  };

  const updateTender = (index: number, field: keyof Tender, value: string) => {
    const updatedTenders = tenders.map((tender, i) => {
      if (i === index) {
        const updatedTender = {
          ...tender,
          [field]: field === 'amount' ? parseFloat(value) : value
        };
        validateTender(updatedTender);
        return updatedTender;
      }
      return tender;
    });
    onChange(updatedTenders);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Government Tenders</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add or modify government tender records
          </p>
        </div>
        <button
          type="button"
          onClick={addTender}
          className="flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Tender
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

      {tenders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tenders</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new tender record
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tenders.map((tender, index) => (
            <div key={tender.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <span className="flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    Project Name
                  </span>
                </label>
                <input
                  type="text"
                  value={tender.projectName}
                  onChange={(e) => updateTender(index, 'projectName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <span className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Amount
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={tender.amount}
                  onChange={(e) => updateTender(index, 'amount', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Award Date
                  </span>
                </label>
                <input
                  type="date"
                  value={tender.awardDate.split('T')[0]}
                  onChange={(e) => updateTender(index, 'awardDate', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={tender.completionStatus}
                  onChange={(e) => updateTender(index, 'completionStatus', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="AWARDED">Awarded</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="TERMINATED">Terminated</option>
                </select>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  <span className="flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    Government Entity
                  </span>
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={tender.governmentEntity}
                    onChange={(e) => updateTender(index, 'governmentEntity', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeTender(index)}
                    className="ml-2 p-1 text-red-600 hover:text-red-800"
                    title="Remove tender"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};