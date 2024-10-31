'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Edit, Share2, Download, AlertTriangle } from 'lucide-react';
import type { Company, User } from '@/types';

interface CompanyHeaderProps {
  company: Company;
  user: User | null;
}

export function CompanyHeader({ company, user }: CompanyHeaderProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copying, setCopying] = useState(false);

  const formatAddress = (address: any) => {
    if (typeof address === 'string') return address;
    
    const parts = [
      address.building,
      address.street,
      address.locality,
      address.city,
      address.postalCode,
      address.postalAddress
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/companies/${company.id}/pdf`);
      if (!response.ok) throw new Error('Failed to generate PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${company.name}-profile.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download company profile');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            <div className="mt-1 flex items-center">
              <span className="text-sm text-gray-500">Registration: {company.registrationNumber}</span>
              {company.status !== 'ACTIVE' && (
                <div className="ml-3 flex items-center text-amber-600">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{company.status}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Share2 className="h-4 w-4 mr-2" />
              {copying ? 'Copied!' : 'Share'}
            </button>

            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>

            {user?.isAdmin && (
              <Link
                href={`/admin/companies/${company.id}/edit`}
                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Incorporation Date</h3>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(company.registrationDate).toLocaleDateString()}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Address</h3>
            <p className="mt-1 text-sm text-gray-900">
              {formatAddress(company.address)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Contact</h3>
            <p className="mt-1 text-sm text-gray-900">
              {company.contactInfo?.email && (
                <a 
                  href={`mailto:${company.contactInfo.email}`}
                  className="text-blue-600 hover:text-blue-500"
                >
                  {company.contactInfo.email}
                </a>
              )}
              {company.contactInfo?.phone && (
                <span className="block">{company.contactInfo.phone}</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900">Share Company Profile</h3>
            <div className="mt-4">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}