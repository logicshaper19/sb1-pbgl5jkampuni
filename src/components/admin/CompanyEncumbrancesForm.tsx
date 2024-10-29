import React from 'react';
import { Encumbrance } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface CompanyEncumbrancesFormProps {
  encumbrances: Encumbrance[];
  onChange: (encumbrances: Encumbrance[]) => void;
}

export const CompanyEncumbrancesForm = ({ encumbrances, onChange }: CompanyEncumbrancesFormProps) => {
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
    const updatedEncumbrances = encumbrances.map((encumbrance, i) =>
      i === index ? { ...encumbrance, [field]: field === 'amount' ? parseFloat(value) : value } : encumbrance
    );
    onChange(updatedEncumbrances);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Encumbrances</h3>
        <button
          type="button"
          onClick={addEncumbrance}
          className="flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Encumbrance
        </button>
      </div>

      {encumbrances.map((encumbrance, index) => (
        <div key={encumbrance.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <input
              type="text"
              value={encumbrance.type}
              onChange={(e) => updateEncumbrance(index, 'type', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
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
            </select>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={encumbrance.description}
              onChange={(e) => updateEncumbrance(index, 'description', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeEncumbrance(index)}
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