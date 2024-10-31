'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { Director } from '@/types/company';

interface CompanyDirectorsFormProps {
  directors: Director[];
  onChange: (directors: Director[]) => void;
}

export function CompanyDirectorsForm({ directors, onChange }: CompanyDirectorsFormProps) {
  const addDirector = () => {
    onChange([
      ...directors,
      { id: '', name: '', nationality: '', role: '', shares: 0 } as Director
    ]);
  };

  const removeDirector = (index: number) => {
    const newDirectors = [...directors];
    newDirectors.splice(index, 1);
    onChange(newDirectors);
  };

  const updateDirector = (index: number, field: keyof Director, value: string | number) => {
    const newDirectors = directors.map((director, i) => {
      if (i === index) {
        return { ...director, [field]: value } as Director;
      }
      return director;
    });
    onChange(newDirectors);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Directors</h3>
      
      {directors.map((director, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Director {index + 1}</h4>
            <button
              type="button"
              onClick={() => removeDirector(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={director.name}
                onChange={(e) => updateDirector(index, 'name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nationality
              </label>
              <input
                type="text"
                value={director.nationality}
                onChange={(e) => updateDirector(index, 'nationality', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <input
                type="text"
                value={director.role}
                onChange={(e) => updateDirector(index, 'role', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shares
              </label>
              <input
                type="number"
                value={director.shares}
                onChange={(e) => updateDirector(index, 'shares', parseInt(e.target.value, 10))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addDirector}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add Director
      </button>
    </div>
  );
}