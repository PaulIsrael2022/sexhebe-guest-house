import React from 'react';
import { Package, AlertTriangle } from 'lucide-react';

const mockInventory = [
  {
    id: '1',
    name: 'Cleaning Solution',
    quantity: 15,
    unit: 'bottles',
    minThreshold: 10,
    lastRestocked: '2024-03-10'
  },
  {
    id: '2',
    name: 'Towels',
    quantity: 8,
    unit: 'dozen',
    minThreshold: 12,
    lastRestocked: '2024-03-12'
  },
  {
    id: '3',
    name: 'Toilet Paper',
    quantity: 45,
    unit: 'rolls',
    minThreshold: 30,
    lastRestocked: '2024-03-14'
  }
];

export function SuppliesInventory() {
  return (
    <div className="p-6">
      <div className="grid gap-4">
        {mockInventory.map((item) => {
          const lowStock = item.quantity <= item.minThreshold;
          
          return (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Last restocked: {item.lastRestocked}
                    </p>
                  </div>
                </div>
                {lowStock && (
                  <div className="flex items-center text-yellow-600">
                    <AlertTriangle className="w-5 h-5 mr-1" />
                    <span className="text-sm">Low Stock</span>
                  </div>
                )}
              </div>
              <div className="mt-3 ml-10">
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    <span className="font-medium">{item.quantity}</span> {item.unit}
                  </p>
                  <p className="text-sm text-gray-600">
                    Min. threshold: {item.minThreshold} {item.unit}
                  </p>
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${
                      lowStock ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${(item.quantity / (item.minThreshold * 2)) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}