import React from 'react';
import { BarChart, DollarSign } from 'lucide-react';

const mockData = [
  { month: 'Jan', revenue: 12500 },
  { month: 'Feb', revenue: 15000 },
  { month: 'Mar', revenue: 18000 },
  { month: 'Apr', revenue: 16500 },
  { month: 'May', revenue: 21000 },
  { month: 'Jun', revenue: 19500 },
];

export function RevenueChart() {
  const maxRevenue = Math.max(...mockData.map(d => d.revenue));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BarChart className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-gray-600">Monthly Revenue</span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <span className="text-lg font-semibold">${maxRevenue.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="relative h-64">
        <div className="absolute inset-0 flex items-end justify-between">
          {mockData.map((item) => (
            <div key={item.month} className="flex flex-col items-center w-1/6">
              <div 
                className="w-12 bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
              />
              <div className="mt-2 text-sm text-gray-600">{item.month}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}