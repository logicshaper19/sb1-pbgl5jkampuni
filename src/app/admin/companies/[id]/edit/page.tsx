'use client';

import { CompanyForm } from '@/components/admin/CompanyForm';
import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import type { Company } from '@/types';

type Props = {
  params: {
    id: string;
  }
}

export default function EditCompanyPage({ params }: Props) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`/api/admin/companies/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch company');
        }
        const data = await response.json();
        setCompany(data);
      } catch (error) {
        console.error('Failed to fetch company:', error);
        setError('Failed to load company');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Error</h2>
        <p className="mt-2 text-gray-600">{error}</p>
      </div>
    );
  }

  if (!company) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Company: {company.name}</h1>
      <CompanyForm initialData={company} />
    </div>
  );
}
