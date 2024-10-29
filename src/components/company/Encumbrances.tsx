import React from 'react';
import { Encumbrance } from '../../types';

interface EncumbrancesProps {
  encumbrances: Encumbrance[];
}

export const Encumbrances = ({ encumbrances }: EncumbrancesProps) => {
  const sortedEncumbrances = [...encumbrances].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Encumbrances</h2>
      <div className="space-y-4">
        {sortedEncumbrances.map((encumbrance) => (
          <div key={encumbrance.id} className="border-b border-gray-200 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{encumbrance.type}</h3>
                <p className="text-sm text-gray-500 mt-1">{encumbrance.description}</p>
              </div>
              <span className={`px-2 py-1 text-sm rounded-full ${
                encumbrance.status === 'Active' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {encumbrance.status}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-sm text-gray-900">
                  {new Date(encumbrance.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-sm text-gray-900">
                  {encumbrance.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};