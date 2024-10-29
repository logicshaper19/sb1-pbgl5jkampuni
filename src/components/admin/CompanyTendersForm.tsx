import React, { useState } from 'react';
import { Tender } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface CompanyTendersFormProps {
  tenders: Tender[];
  onChange: (tenders: Tender[]) => void;
}

export const CompanyTendersForm = ({ tenders, onChange }: CompanyTendersFormProps) => {
  const addTender = () => {
    onChange([
      ...tenders,
      {
        id: `temp-${Date.now()}`,
        projectName: '',
        amount: 0,
        awardDate: new Date().toISOString().split('T')[0],
        completionStatus: 'AWARDED',
        governmentEntity: '',
      },
    ]);
  };

  const removeTender = (index: number) => {
    onChange(tenders.filter((_, i) => i !== index));
  };

  const updateTender = (index: number, field: keyof Tender, value: string) => {
    const updatedTenders = tenders.map((tender, i) =>
      i === index ? { ...tender, [field]: field === 'amount' ? parseFloat(value) : value } : tender
    );
    onChange(updatedTenders);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Government Tenders</h3>
        <button
          type="button"
          onClick={addTender}
          className="flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Tender
        </button>
      </div>

      {tenders.map((tender, index) => (
        <div key={tender.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Name</label>
            <input
              type="text"
              value={tender.projectName}
              onChange={(e) => updateTender(index, 'projectName', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={tender.amount}
              onChange={(e) => updateTender(index, 'amount', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Award Date</label>
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
            <label className="block text-sm font-medium text-gray-700">Government Entity</label>
            <input
              type="text"
              value={tender.governmentEntity}
              onChange={(e) => updateTender(index, 'governmentEntity', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeTender(index)}
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