'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Save,
  X,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import type { Company } from '@/types';
import { CompanyDirectorsForm } from './CompanyDirectorsForm';
import { CompanyFinancialsForm } from './CompanyFinancialsForm';
import { CompanyTendersForm } from './CompanyTendersForm';
import { CompanyEncumbrancesForm } from './CompanyEncumbrancesForm';

interface CompanyFormProps {
  initialData?: Company;
}

type FormStep = 'details' | 'directors' | 'financials' | 'tenders' | 'encumbrances';

export function CompanyForm({ initialData }: CompanyFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FormStep>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Company>>(initialData || {
    name: '',
    registrationNumber: '',
    registrationDate: '',
    address: '',
    contactInfo: {
      email: '',
      phone: ''
    },
    directors: [],
    financials: [],
    tenders: [],
    encumbrances: []
  });

  const steps: { id: FormStep; label: string }[] = [
    { id: 'details', label: 'Company Details' },
    { id: 'directors', label: 'Directors' },
    { id: 'financials', label: 'Financials' },
    { id: 'tenders', label: 'Tenders' },
    { id: 'encumbrances', label: 'Encumbrances' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = initialData 
        ? `/api/companies/${initialData.id}`
        : '/api/companies';
      
      const response = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save company');
      }

      const savedCompany = await response.json();
      router.push(`/companies/${savedCompany.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isStepComplete = (step: FormStep): boolean => {
    switch (step) {
      case 'details':
        return !!(formData.name && formData.registrationNumber);
      case 'directors':
        return (formData.directors?.length ?? 0) > 0;
      case 'financials':
        return (formData.financials?.length ?? 0) > 0;
      case 'tenders':
        return true; // Optional step
      case 'encumbrances':
        return true; // Optional step
      default:
        return false;
    }
  };

  const canProceed = isStepComplete(currentStep);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, index) => (
              <li
                key={step.id}
                className={`relative ${
                  index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''
                }`}
              >
                <div className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                      isStepComplete(step.id)
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : currentStep === step.id
                        ? 'border-2 border-blue-600'
                        : 'border-2 border-gray-300'
                    }`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${
                      currentStep === step.id ? 'bg-blue-600' : 'bg-transparent'
                    }`} />
                  </button>
                  {index !== steps.length - 1 && (
                    <div className={`absolute top-4 w-full h-0.5 ${
                      isStepComplete(step.id) ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
                <span className="absolute -bottom-6 w-max text-sm font-medium text-gray-500">
                  {step.label}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {currentStep === 'details' && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                  Registration Number
                </label>
                <input
                  type="text"
                  id="registrationNumber"
                  required
                  value={formData.registrationNumber}
                  onChange={(e) => updateFormData('registrationNumber', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="registrationDate" className="block text-sm font-medium text-gray-700">
                  Registration Date
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="registrationDate"
                    required
                    value={formData.registrationDate}
                    onChange={(e) => updateFormData('registrationDate', e.target.value)}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.contactInfo?.email}
                    onChange={(e) => updateFormData('contactInfo', {
                      ...formData.contactInfo,
                      email: e.target.value
                    })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.contactInfo?.phone}
                    onChange={(e) => updateFormData('contactInfo', {
                      ...formData.contactInfo,
                      phone: e.target.value
                    })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'directors' && (
          <CompanyDirectorsForm
            directors={formData.directors || []}
            onChange={(directors) => updateFormData('directors', directors)}
          />
        )}

        {currentStep === 'financials' && (
          <CompanyFinancialsForm
            financials={formData.financials || []}
            onChange={(financials) => updateFormData('financials', financials)}
          />
        )}

        {currentStep === 'tenders' && (
          <CompanyTendersForm
            tenders={formData.tenders || []}
            onChange={(tenders) => updateFormData('tenders', tenders)}
          />
        )}

        {currentStep === 'encumbrances' && (
          <CompanyEncumbrancesForm
            encumbrances={formData.encumbrances || []}
            onChange={(encumbrances) => updateFormData('encumbrances', encumbrances)}
          />
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>

          <div className="flex space-x-4">
            {currentStep !== steps[0].id && (
              <button
                type="button"
                onClick={() => {
                  const currentIndex = steps.findIndex(s => s.id === currentStep);
                  setCurrentStep(steps[currentIndex - 1].id);
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Previous
              </button>
            )}

            {currentStep !== steps[steps.length - 1].id ? (
              <button
                type="button"
                onClick={() => {
                  const currentIndex = steps.findIndex(s => s.id === currentStep);
                  setCurrentStep(steps[currentIndex + 1].id);
                }}
                disabled={!canProceed}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !canProceed}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Company
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
