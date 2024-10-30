'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, Shield, Calendar, DollarSign } from 'lucide-react';
import type { Encumbrance } from '@/types';

interface EncumbrancesProps {
  encumbrances: Encumbrance[];
}

export function Encumbrances({ encumbrances }: EncumbrancesProps) {
  const [showAllEncumbrances, setShowAllEncumbrances] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  const sortedEncumbrances = [...encumbrances].sort((a, b) => 
    new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
  );

  const filteredEncumbrances = sortedEncumbrances.filter(encumbrance => 
    selectedType === 'all' || encumbrance.type === selectedType
  );

  const displayedEncumbrances = showAllEncumbrances 
    ? filteredEncumbrances 
    : filteredEncumbrances.slice(0, 3);

  const uniqueTypes = Array.from(new Set(encumbrances.map(e => e.type)));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'mortgage':
        return 'bg-purple-100 text-purple-800';
      case 'charge':
        return 'bg-blue-100 text-blue-800';
      case 'lien':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalValue = (encumbrances: Encumbrance[]) => {
    return encumbrances.reduce((sum, encumbrance) => sum + encumbrance.value, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Encumbrances</h2>
          <p className="text-sm text-gray-500 mt-1">
            Total Value: {formatCurrency(getTotalValue(encumbrances))}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 text-sm rounded-md ${
              selectedType === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {uniqueTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 text-sm rounded-md capitalize ${
                selectedType === type
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {filteredEncumbrances.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No encumbrances found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedType === 'all' 
              ? 'No encumbrances registered'
              : `No ${selectedType} encumbrances found`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedEncumbrances.map((encumbrance) => (
            <div 
              key={encumbrance.id}
              className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium text-gray-900">
                      {encumbrance.title}
                    </h3>
                    <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(encumbrance.type)}`}>
                      {encumbrance.type}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Reference: {encumbrance.referenceNumber}
                  </p>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(encumbrance.value)}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-gray-500">Registration Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(encumbrance.registrationDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                {encumbrance.expiryDate && (
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-gray-500">Expiry Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(encumbrance.expiryDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {encumbrance.description && (
                <p className="mt-4 text-sm text-gray-600">
                  {encumbrance.description}
                </p>
              )}
            </div>
          ))}

          {filteredEncumbrances.length > 3 && (
            <button
              onClick={() => setShowAllEncumbrances(!showAllEncumbrances)}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {showAllEncumbrances ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Show All Encumbrances ({filteredEncumbrances.length})
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}