'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Building2, Users, FileText, Clock, Link2, Eye } from 'lucide-react';
import type { Company, Director, Shareholder, Financial, Change, RelatedEntity, Observation } from '@/types';

const tabs = [
  { name: 'Overview', href: '#overview' },
  { name: 'Directors', href: '#directors' },
  { name: 'Shareholders', href: '#shareholders' },
  { name: 'Financials', href: '#financials' },
  { name: 'Changes', href: '#changes' },
  { name: 'Related Entities', href: '#related' },
  { name: 'Observations', href: '#observations' },
];

export default function CompanyPage() {
  const params = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanyDetails() {
      if (!params?.id) return;

      try {
        const response = await fetch(`/api/companies/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch company details');
        const data = await response.json();
        setCompany(data);
      } catch (error) {
        console.error('Error fetching company:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanyDetails();
  }, [params?.id]);

  if (loading || !company) {
    return <div>Loading...</div>;
  }

  const renderDirectors = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Directors</h3>
        <div className="mt-4 divide-y divide-gray-200">
          {company?.directors?.map((director: Director) => (
            <div key={director.id} className="py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-medium">{director.name}</h4>
                  <p className="text-sm text-gray-500">{director.role || 'Director'}</p>
                  {director.appointments?.[0] && (
                    <p className="text-sm text-gray-500">
                      Appointed: {new Date(director.appointments[0].date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {director.nationality && (
                  <span className="text-sm text-gray-500">{director.nationality}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderShareholders = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Shareholders</h3>
        <div className="mt-4 divide-y divide-gray-200">
          {company?.shareholders?.map((shareholder: Shareholder) => {
            // Calculate total shares safely
            const totalShares = Array.isArray(shareholder.shares) 
              ? shareholder.shares.reduce((acc: number, share) => acc + (share.quantity || 0), 0)
              : 0;

            // Calculate percentage safely
            const percentage = company.sharesIssued && company.sharesIssued > 0
              ? (totalShares / company.sharesIssued * 100).toFixed(2)
              : '0.00';

            return (
              <div key={shareholder.id} className="py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-medium">{shareholder.name}</h4>
                    <p className="text-sm text-gray-500">
                      {totalShares.toLocaleString()} shares
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderFinancials = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Financial History</h3>
        <div className="mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit/Loss</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {company?.financials?.map((financial: Financial) => (
                <tr key={financial.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{financial.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    KES {financial.revenue?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    KES {financial.profitLoss?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderChanges = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Company Changes</h3>
        <div className="mt-4 space-y-6">
          {company?.changes?.map((change: Change) => (
            <div key={change.id} className="relative pb-8">
              <div className="relative flex items-start space-x-3">
                <div className="min-w-0 flex-1">
                  <div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">{change.type}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {new Date(change.date).toLocaleDateString()}
                    </p>
                    <p className="mt-2 text-sm text-gray-700">{change.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRelatedEntities = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Related Entities</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {company?.relatedEntities?.map((entity: RelatedEntity) => (
            <div key={entity.id} className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{entity.name}</p>
                <p className="text-sm text-gray-500">{entity.relationship}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderObservations = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Observations</h3>
        <div className="mt-4 space-y-4">
          {company?.observations?.map((observation: Observation) => (
            <div key={observation.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{observation.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">{observation.description}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(observation.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{company.name}</h1>
        <p className="text-gray-600">Company Number: {company.registrationNumber}</p>
        <p className="text-gray-600 mt-1">{company.natureOfBusiness || 'Mobile/Telecommunications Services (Inferred)'}</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.name
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Company Overview */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Company Overview</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium">Nominal Share Capital</p>
                    <p className="text-gray-600">KES {company.nominalCapital?.toLocaleString() || '100,000.00'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium">Shares Issued</p>
                    <p className="text-gray-600">
                      {company.sharesIssued || '100'} Ordinary Shares (KES {company.shareValue?.toLocaleString() || '1,000.00'} each)
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium">Date of Registration</p>
                    <p className="text-gray-600">
                      {new Date(company.registrationDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium">Registered Office</p>
                    <p className="text-gray-600">{company.registeredOffice || 'Shirika Co-op House, Kipande Road, Nairobi'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium">Postal Address</p>
                    <p className="text-gray-600">{company.postalAddress || 'P.O. Box 2004 City Square, Nairobi'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'Directors' && renderDirectors()}
        {activeTab === 'Shareholders' && renderShareholders()}
        {activeTab === 'Financials' && renderFinancials()}
        {activeTab === 'Changes' && renderChanges()}
        {activeTab === 'Related Entities' && renderRelatedEntities()}
        {activeTab === 'Observations' && renderObservations()}
      </div>
    </div>
  );
}
