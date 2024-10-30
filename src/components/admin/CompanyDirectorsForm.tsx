'use client';

import React, { useState } from 'react';
import { Person } from '../../types';
import { Plus, Trash2, AlertTriangle, User, Calendar, Globe, Briefcase } from 'lucide-react';

interface CompanyDirectorsFormProps {
  directors: Person[];
  onChange: (directors: Person[]) => void;
}

export const CompanyDirectorsForm = ({ directors, onChange }: CompanyDirectorsFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateDirector = (director: Person): boolean => {
    if (!director.name || !director.role || !director.nationality || !director.appointmentDate) {
      setError('All director fields are required');
      return false;
    }
    setError(null);
    return true;
  };

  const addDirector = () => {
    const newDirector: Person = {
      id: `temp-${Date.now()}`,
      name: '',
      role: '',
      nationality: '',
      appointmentDate: new Date().toISOString().split('T')[0],
    };
    onChange([...directors, newDirector]);
  };

  const removeDirector = (index: number) => {
    if (directors.length === 1) {
      setError('At least one director is required');
      return;
    }
    onChange(directors.filter((_, i) => i !== index));
    setError(null);
  };

  const updateDirector = (index: number, field: keyof Person, value: string) => {
    setIsValidating(true);
    const updatedDirectors = directors.map((director, i) =>
      i === index ? { ...director, [field]: value } : director
    );
    
    const updatedDirector = updatedDirectors[index];
    if (validateDirector(updatedDirector)) {
      onChange(updatedDirectors);
    }
    setIsValidating(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Directors</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add or modify company directors
          </p>
        </div>
        <button
          type="button"
          onClick={addDirector}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Director
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
        {directors.map((director, index) => (
          <div 
            key={director.id} 
            className="bg-white shadow rounded-lg overflow-hidden transition-shadow hover:shadow-md"
          >
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Full Name
                    </span>
                  </label>
                  <input
                    type="text"
                    value={director.name}
                    onChange={(e) => updateDirector(index, 'name', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter director's name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Role
                    </span>
                  </label>
                  <input
                    type="text"
                    value={director.role}
                    onChange={(e) => updateDirector(index, 'role', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter director's role"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      Nationality
                    </span>
                  </label>
                  <input
                    type="text"
                    value={director.nationality}
                    onChange={(e) => updateDirector(index, 'nationality', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter nationality"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Appointment Date
                    </span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="date"
                      value={director.appointmentDate.split('T')[0]}
                      onChange={(e) => updateDirector(index, 'appointmentDate', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeDirector(index)}
                      className="ml-2 p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove director"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {directors.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No directors</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new director
            </p>
            <button
              type="button"
              onClick={addDirector}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Director
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
      {directors.map((director, index) => (
        <div key={director.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={director.name}
              onChange={(e) => updateDirector(index, 'name', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              value={director.role}
              onChange={(e) => updateDirector(index, 'role', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nationality</label>
            <input
              type="text"
              value={director.nationality}
              onChange={(e) => updateDirector(index, 'nationality', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Appointment Date</label>
            <input
              type="date"
              value={director.appointmentDate.split('T')[0]}
              onChange={(e) => updateDirector(index, 'appointmentDate', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeDirector(index)}
              className="absolute top-0 right-0 p-1 text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};