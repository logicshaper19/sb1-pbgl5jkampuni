'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Building2, Users, FileText } from 'lucide-react';
import type { 
  Company, 
  Director, 
  Shareholder, 
  Financial, 
  Change, 
  RelatedEntity, 
  Observation
} from '@/types/company';
import { CompanyProfile } from '@/components/company/CompanyProfile';

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
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompany() {
      try {
        const response = await fetch(`/api/companies/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            // Add any auth headers if needed
            // 'Authorization': `Bearer ${token}` 
          },
        });
        
        if (response.status === 401) {
          setError('Unauthorized access. Please login first.');
          return;
        }
        
        if (!response.ok) throw new Error('Failed to fetch company details');
        const data = await response.json();
        setCompany(data);
      } catch (err) {
        console.error('Error fetching company:', err);
        setError('Failed to load company details');
      } finally {
        setLoading(false);
      }
    }

    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="p-4">
        <h1>Loading company details...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <h1>Error loading company</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-4">
        <h1>Company not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CompanyProfile company={company} />
    </div>
  );
}
