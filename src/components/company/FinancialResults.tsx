import React from 'react';
import { FinancialResult } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FinancialResultsProps {
  results: FinancialResult[];
}

export const FinancialResults = ({ results }: FinancialResultsProps) => {
  const sortedResults = [...results].sort((a, b) => a.year - b.year);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Financial Results</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sortedResults}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue" />
            <Line type="monotone" dataKey="profit" stroke="#10b981" name="Profit" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Year</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Revenue</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Profit</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Employees</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedResults.map((result) => (
              <tr key={result.year}>
                <td className="px-4 py-2 text-sm text-gray-900">{result.year}</td>
                <td className="px-4 py-2 text-sm text-right text-gray-900">
                  {result.revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </td>
                <td className="px-4 py-2 text-sm text-right text-gray-900">
                  {result.profit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </td>
                <td className="px-4 py-2 text-sm text-right text-gray-900">{result.employeeCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};