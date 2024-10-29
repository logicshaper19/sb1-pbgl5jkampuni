import React from 'react';
import { Tender } from '../../types';

interface TenderHistoryProps {
  tenders: Tender[];
}

export const TenderHistory = ({ tenders }: TenderHistoryProps) => {
  const sortedTenders = [...tenders].sort((a, b) => 
    new Date(b.awardDate).getTime() - new Date(a.awardDate).getTime()
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Government Tenders</h2>
      <div className="space-y-4">
        {sortedTenders.map((tender) => (
          <div key={tender.id} className="border-b border-gray-200 pb-4">
            <h3 className="font-medium text-gray-900">{tender.projectName}</h3>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Award Date</p>
                <p className="text-sm text-gray-900">
                  {new Date(tender.awardDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-sm text-gray-900">
                  {tender.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-sm text-gray-900">{tender.completionStatus}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Government Entity</p>
                <p className="text-sm text-gray-900">{tender.governmentEntity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};