import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Company } from '../../types';
import { CompanyDirectorsForm } from '../../components/admin/CompanyDirectorsForm';
import { CompanyFinancialsForm } from '../../components/admin/CompanyFinancialsForm';
import { CompanyTendersForm } from '../../components/admin/CompanyTendersForm';
import { CompanyEncumbrancesForm } from '../../components/admin/CompanyEncumbrancesForm';

export const CompanyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<Partial<Company>>({
    name: '',
    registrationNumber: '',
    registrationDate: '',
    status: 'ACTIVE',
    address: '',
    contactInfo: {
      email: '',
      phone: '',
    },
    directors: [],
    shareholders: [],
    encumbrances: [],
    tenders: [],
    financialResults: [],
  });

  useEffect(() => {
    if (id) {
      fetchCompany();
    }
  }, [id]);

  const fetchCompany = async () => {
    try {
      const response = await fetch(`/api/companies/${id}`);
      const data = await response.json();
      setCompany(data);
    } catch (error) {
      console.error('Failed to fetch company:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = id ? `/api/companies/${id}` : '/api/companies';
      const method = id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(company),
      });

      if (!response.ok) {
        throw new Error('Failed to save company');
      }

      navigate('/admin/companies');
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCompany(prev => ({
        ...prev,
        [parent]: { ...prev[parent as keyof Company], [child]: value },
      }));
    } else {
      setCompany(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">
          {id ? 'Edit Company' : 'New Company'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                name="name"
                value={company.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                value={company.registrationNumber}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Registration Date</label>
              <input
                type="date"
                name="registrationDate"
                value={company.registrationDate?.split('T')[0]}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={company.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="DISSOLVED">Dissolved</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="contactInfo.email"
                value={company.contactInfo?.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="contactInfo.phone"
                value={company.contactInfo?.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={company.address}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <CompanyDirectorsForm
            directors={company.directors || []}
            onChange={directors => setCompany(prev => ({ ...prev, directors }))}
          />

          <CompanyFinancialsForm
            financials={company.financialResults || []}
            onChange={financialResults => setCompany(prev => ({ ...prev, financialResults }))}
          />

          <CompanyTendersForm
            tenders={company.tenders || []}
            onChange={tenders => setCompany(prev => ({ ...prev, tenders }))}
          />

          <CompanyEncumbrancesForm
            encumbrances={company.encumbrances || []}
            onChange={encumbrances => setCompany(prev => ({ ...prev, encumbrances }))}
          />

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/companies')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};