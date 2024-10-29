import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Company } from '../types';
import { CompanyHeader } from '../components/company/CompanyHeader';
import { CompanyDetails } from '../components/company/CompanyDetails';
import { FinancialResults } from '../components/company/FinancialResults';
import { TenderHistory } from '../components/company/TenderHistory';
import { Encumbrances } from '../components/company/Encumbrances';
import { NetworkGraph } from '../components/network/NetworkGraph';

export const CompanyProfile = () => {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`/api/companies/${id}`);
        const data = await response.json();
        setCompany(data);
      } catch (error) {
        console.error('Failed to fetch company:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Company not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CompanyHeader company={company} />
      
      <div className="mt-8">
        <NetworkGraph
          companyId={company.id}
          companyName={company.name}
          directors={company.directors}
          shareholders={company.shareholders}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <CompanyDetails company={company} />
        <FinancialResults results={company.financialResults} />
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <TenderHistory tenders={company.tenders} />
        <Encumbrances encumbrances={company.encumbrances} />
      </div>
    </div>
  );
};