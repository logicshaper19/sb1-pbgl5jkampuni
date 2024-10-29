import React, { useState } from 'react';
import { Person } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface CompanyDirectorsFormProps {
  directors: Person[];
  onChange: (directors: Person[]) => void;
}

export const CompanyDirectorsForm = ({ directors, onChange }: CompanyDirectorsFormProps) => {
  const addDirector = () => {
    onChange([
      ...directors,
      {
        id: `temp-${Date.now()}`,
        name: '',
        role: '',
        nationality: '',
        appointmentDate: new Date().toISOString().split('T')[0],
      },
    ]);
  };

  const removeDirector = (index: number) => {
    onChange(directors.filter((_, i) => i !== index));
  };

  const updateDirector = (index: number, field: keyof Person, value: string) => {
    const updatedDirectors = directors.map((director, i) =>
      i === index ? { ...director, [field]: value } : director
    );
    onChange(updatedDirectors);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Directors</h3>
        <button
          type="button"
          onClick={addDirector}
          className="flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Director
        </button>
      </div>

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