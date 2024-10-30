'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  Calendar,
  Building2
} from 'lucide-react';
import type { Tender } from '@/types';

interface TenderHistoryProps {
  tenders: Tender[];
}

export function TenderHistory({ tenders }: TenderHistoryProps) {
  const [showAllTenders, setShowAllTenders] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const sortedTenders = [...tenders].sort((a, b) => 
    new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
  );

  const filteredTenders = sortedTenders.filter(tender => 
    selectedStatus === 'all' || tender.status.toLowerCase() === selectedStatus.toLowerCase()
  );

  const displayedTenders = showAllTenders ? filteredTenders : filteredTenders.slice(0, 5);

  const getTotalValue = () => {
    return filteredTenders.reduce((sum, tender) => sum + tender.value, 0);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'won':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'won':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'lost':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Tender History</h3>
          <div className="flex items-center space-x-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">All Status</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
              <option value="pending">Pending</option>
            </select>
            <div className="text-sm text-gray-500">
              Total Value: <span className="font-medium">{formatCurrency(getTotalValue())}</span>
            </div>
          </div>
        </div>

        {filteredTenders.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tenders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedStatus === 'all' 
                ? 'No tender history available'
                : `No ${selectedStatus} tenders found`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedTenders.map((tender) => (
              <div 
                key={tender.id}
                className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="text-sm font-medium text-gray-900">
                        {tender.title}
                      </h4>
                      <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tender.status)}`}>
                        {tender.status}
                      </span>
                    </div>
                    <div className="mt-1 grid grid-cols-2 gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-1" />
                        {tender.organization}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(tender.submissionDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatCurrency(tender.value)}
                      </div>
                      {tender.completionDate && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(tender.completionDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    {getStatusIcon(tender.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredTenders.length > 5 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAllTenders(!showAllTenders)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {showAllTenders ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Show All ({filteredTenders.length})
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
