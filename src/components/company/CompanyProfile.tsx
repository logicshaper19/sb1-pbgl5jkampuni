'use client';

import { CompanyHeader } from './CompanyHeader';
import { CompanyDetails } from './CompanyDetails';
import { FinancialResults } from './FinancialResults';
import { TenderHistory } from './TenderHistory';
import { Encumbrances } from './Encumbrances';
import { NetworkGraph } from '../network/NetworkGraph';
import type { Company } from '@/types';

interface CompanyProfileProps {
  company: Company;
}

export function CompanyProfile({ company }: CompanyProfileProps) {
  return (
    <div className="space-y-8">
      <CompanyHeader company={company} />
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Company Network</h2>
        <div className="h-96">
          <NetworkGraph
            companyId={company.id}
            companyName={company.name}
            directors={company.directors}
            shareholders={company.shareholders}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <CompanyDetails company={company} />
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <FinancialResults results={company.financialResults} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <TenderHistory tenders={company.tenders} />
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <Encumbrances encumbrances={company.encumbrances} />
        </div>
      </div>

      {company.shareholders.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Shareholders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shares
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {company.shareholders.map((shareholder, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {shareholder.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shareholder.shares.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shareholder.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
