import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Users } from 'lucide-react';
import type { FinancialReport } from '../../types';

interface FinancialStatsProps {
  report: FinancialReport;
}

export function FinancialStats({ report }: FinancialStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Revenue
              </dt>
              <dd className="text-lg font-semibold text-gray-900">
                ${report.revenue.total.toFixed(2)}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <TrendingDown className="h-8 w-8 text-red-500" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Expenses
              </dt>
              <dd className="text-lg font-semibold text-gray-900">
                ${report.expenses.total.toFixed(2)}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Net Profit
              </dt>
              <dd className="text-lg font-semibold text-gray-900">
                ${report.profit.toFixed(2)}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Users className="h-8 w-8 text-purple-500" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Occupancy Rate
              </dt>
              <dd className="text-lg font-semibold text-gray-900">
                {report.occupancyRate.toFixed(1)}%
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
