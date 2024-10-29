import React, { useState } from 'react';
import { FinancialResult } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface CompanyFinancialsFormProps {
  financials: FinancialResult[];
  onChange: (financials: FinancialResult[]) => void;
}

export const CompanyFinancialsForm = ({ financials, onChange }: CompanyFinancialsFormProps) => {
  const addFinancialYear = () => {
    onChange([
      ...financials,
      {
        year: new Date().getFullYear(),
        revenue: 0,
        profit: 0,
        assets: 0,
        liabilities: 0,
        employeeCount: 0,
      },
    ]);
  };

  const removeFinancialYear = (index: number) => {
    onChange(financials.filter((_, i) => i !== index));
  };

  const updateFinancial = (index: number, field: keyof FinancialResult, value: string) => {
    const updatedFinancials = financials.map((financial, i) =>
      i === index ? { ...financial, [field]: field === 'year' ? parseInt(value) : parseFloat(value) } : financial
    );
    onChange(updatedFinancials);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Financial Results</h3>
        <button
          type="button"
          onClick={addFinancialYear}
          className="flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Year
        </button>
      </div>

      {financials.map((financial, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="number"
              value={financial.year}
              onChange={(e) => updateFinancial(index, 'year', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Revenue</label>
            <input
              type="number"
              value={financial.revenue}
              onChange={(e) => updateFinancial(index, 'revenue', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Profit</label>
            <input
              type="number"
              value={financial.profit}
              onChange={(e) => updateFinancial(index, 'profit', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assets</label>
            <input
              type="number"
              value={financial.assets}
              onChange={(e) => updateFinancial(index, 'assets', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Liabilities</label>
            <input
              type="number"
              value={financial.liabilities}
              onChange={(e) => updateFinancial(index, 'liabilities', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Employees</label>
            <input
              type="number"
              value={financial.employeeCount}
              onChange={(e) => updateFinancial(index, 'employeeCount', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeFinancialYear(index)}
              className="absolute top-0 right-0 p-1 text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};