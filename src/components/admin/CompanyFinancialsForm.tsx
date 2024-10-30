'use client';

import React, { useState } from 'react';
import { FinancialResult } from '../../types';
import { Plus, Trash2, AlertTriangle, DollarSign, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

interface CompanyFinancialsFormProps {
  financials: FinancialResult[];
  onChange: (financials: FinancialResult[]) => void;
}

export const CompanyFinancialsForm = ({ financials, onChange }: CompanyFinancialsFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const validateFinancial = (financial: FinancialResult): boolean => {
    if (!financial.year || !financial.revenue || !financial.profit) {
      setError('Year, revenue and profit are required');
      return false;
    }
    if (financial.year < 1900 || financial.year > new Date().getFullYear()) {
      setError('Invalid year');
      return false;
    }
    setError(null);
    return true;
  };

  const addFinancial = () => {
    const currentYear = new Date().getFullYear();
    onChange([
      ...financials,
      {
        id: `temp-${Date.now()}`,
        year: currentYear,
        revenue: 0,
        profit: 0,
        employeeCount: 0,
        notes: '',
      },
    ]);
  };

  const removeFinancial = (index: number) => {
    onChange(financials.filter((_, i) => i !== index));
  };

  const updateFinancial = (index: number, field: keyof FinancialResult, value: string | number) => {
    const updatedFinancials = financials.map((financial, i) => {
      if (i === index) {
        const updatedFinancial = {
          ...financial,
          [field]: ['revenue', 'profit', 'employeeCount', 'year'].includes(field as string)
            ? Number(value)
            : value,
        };
        validateFinancial(updatedFinancial);
        return updatedFinancial;
      }
      return financial;
    });
    onChange(updatedFinancials);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Financial Results</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add or modify company financial records
          </p>
        </div>
        <button
          type="button"
          onClick={addFinancial}
          className="flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Financial Record
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
        {financials.map((financial, index) => (
          <div key={financial.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Year
                </span>
              </label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={financial.year}
                onChange={(e) => updateFinancial(index, 'year', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Revenue
                </span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  min="0"
                  value={financial.revenue}
                  onChange={(e) => updateFinancial(index, 'revenue', e.target.value)}
                  className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Profit
                </span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={financial.profit}
                  onChange={(e) => updateFinancial(index, 'profit', e.target.value)}
                  className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Employee Count</label>
              <input
                type="number"
                min="0"
                value={financial.employeeCount}
                onChange={(e) => updateFinancial(index, 'employeeCount', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={financial.notes}
                  onChange={(e) => updateFinancial(index, 'notes', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Optional notes"
                />
                <button
                  type="button"
                  onClick={() => removeFinancial(index)}
                  className="ml-2 p-1 text-red-600 hover:text-red-800"
                  title="Remove financial record"
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