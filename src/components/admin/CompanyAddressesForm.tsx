'use client';

import React, { useState } from 'react';
import { Address } from '../../types';
import { Plus, Trash2, AlertTriangle, MapPin, Building2, Globe } from 'lucide-react';

interface CompanyAddressesFormProps {
  addresses: Address[];
  onChange: (addresses: Address[]) => void;
}

export const CompanyAddressesForm = ({ addresses, onChange }: CompanyAddressesFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const validateAddress = (address: Address): boolean => {
    if (!address.street || !address.city || !address.country) {
      setError('Street, city and country are required');
      return false;
    }
    if (address.postalCode && !/^[A-Z0-9\s-]{3,10}$/i.test(address.postalCode)) {
      setError('Invalid postal code format');
      return false;
    }
    setError(null);
    return true;
  };

  const addAddress = () => {
    onChange([
      ...addresses,
      {
        id: `temp-${Date.now()}`,
        type: 'REGISTERED',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        isHeadOffice: addresses.length === 0,
      },
    ]);
  };

  const removeAddress = (index: number) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    // If removing head office, make the first remaining address the head office
    if (addresses[index].isHeadOffice && updatedAddresses.length > 0) {
      updatedAddresses[0].isHeadOffice = true;
    }
    onChange(updatedAddresses);
  };

  const updateAddress = (index: number, field: keyof Address, value: string | boolean) => {
    const updatedAddresses = addresses.map((address, i) => {
      if (i === index) {
        const updatedAddress = { ...address, [field]: value };
        if (field === 'isHeadOffice' && value === true) {
          // Ensure only one head office
          return { ...updatedAddress, isHeadOffice: true };
        }
        validateAddress(updatedAddress);
        return updatedAddress;
      }
      // If setting a new head office, unset others
      if (field === 'isHeadOffice' && value === true) {
        return { ...address, isHeadOffice: false };
      }
      return address;
    });
    onChange(updatedAddresses);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Company Addresses</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add or modify company addresses
          </p>
        </div>
        <button
          type="button"
          onClick={addAddress}
          className="flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Address
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Validation Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {addresses.map((address, index) => (
          <div key={address.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Address Type</label>
              <select
                value={address.type}
                onChange={(e) => updateAddress(index, 'type', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="REGISTERED">Registered Office</option>
                <option value="OPERATIONAL">Operational</option>
                <option value="BRANCH">Branch Office</option>
                <option value="WAREHOUSE">Warehouse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Street Address
                </span>
              </label>
              <input
                type="text"
                value={address.street}
                onChange={(e) => updateAddress(index, 'street', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Street address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  City
                </span>
              </label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => updateAddress(index, 'city', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">State/Province</label>
              <input
                type="text"
                value={address.state}
                onChange={(e) => updateAddress(index, 'state', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="State or province"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                value={address.postalCode}
                onChange={(e) => updateAddress(index, 'postalCode', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Postal code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Country
                </span>
              </label>
              <input
                type="text"
                value={address.country}
                onChange={(e) => updateAddress(index, 'country', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Country"
              />
            </div>

            <div className="relative col-span-full">
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={address.isHeadOffice}
                    onChange={(e) => updateAddress(index, 'isHeadOffice', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Head Office</span>
                </label>
                <button
                  type="button"
                  onClick={() => removeAddress(index)}
                  className="p-1 text-red-600 hover:text-red-800"
                  title="Remove address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
