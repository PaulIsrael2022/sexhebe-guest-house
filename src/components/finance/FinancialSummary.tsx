import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';

const summaryData = [
  {
    title: 'Total Revenue',
    amount: 45000,
    change: '+12%',
    trend: 'up',
    icon: DollarSign
  },
  {
    title: 'Total Expenses',
    amount: 15000,
    change: '-5%',
    trend: 'down',
    icon: CreditCard
  }
];

export function FinancialSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {summaryData.map((item) => (
        <div key={item.title} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{item.title}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-2xl font-semibold">${item.amount.toLocaleString()}</span>
                <span className={`flex items-center text-sm ${
                  item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {item.change}
                </span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <item.icon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-2 rounded-full ${
                  item.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: '70%' }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}