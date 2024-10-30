'use client';

import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react';
import type { FinancialResult } from '@/types';

interface FinancialResultsProps {
  results: FinancialResult[];
}

export function FinancialResults({ results }: FinancialResultsProps) {
  const [showAllResults, setShowAllResults] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'profit'>('revenue');

  const sortedResults = [...results].sort((a, b) => 
    new Date(b.year).getTime() - new Date(a.year).getTime()
  );

  const displayedResults = showAllResults 
    ? sortedResults 
    : sortedResults.slice(0, 3);

  const chartData = sortedResults.map(result => ({
    year: result.year,
    revenue: result.revenue,
    profit: result.profit
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (!previous) return null;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Financial Results</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedMetric('revenue')}
            className={`px-3 py-1 text-sm rounded-md ${
              selectedMetric === 'revenue'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setSelectedMetric('profit')}
            className={`px-3 py-1 text-sm rounded-md ${
              selectedMetric === 'profit'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Profit
          </button>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis 
              tickFormatter={formatCurrency}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        {displayedResults.map((result, index) => {
          const previousResult = sortedResults[index + 1];
          const revenueGrowth = calculateGrowth(result.revenue, previousResult?.revenue);
          const profitGrowth = calculateGrowth(result.profit, previousResult?.profit);

          return (
            <div 
              key={result.year}
              className="p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">Year {result.year}</h3>
                {revenueGrowth !== null && (
                  <div className={`flex items-center text-sm ${
                    revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {revenueGrowth >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(revenueGrowth).toFixed(1)}% YoY
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Revenue</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(result.revenue)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Profit</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(result.profit)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {results.length > 3 && (
          <button
            onClick={() => setShowAllResults(!showAllResults)}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {showAllResults ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Show All Results ({results.length})
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}