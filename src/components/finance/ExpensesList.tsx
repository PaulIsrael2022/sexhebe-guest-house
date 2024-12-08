import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

const mockExpenses = [
  {
    id: '1',
    description: 'Cleaning Supplies',
    amount: 450,
    date: '2024-03-15',
    category: 'Supplies',
    trend: 'up'
  },
  {
    id: '2',
    description: 'Utilities',
    amount: 1200,
    date: '2024-03-14',
    category: 'Services',
    trend: 'down'
  },
  {
    id: '3',
    description: 'Staff Salaries',
    amount: 5000,
    date: '2024-03-13',
    category: 'Payroll',
    trend: 'up'
  }
];

export function ExpensesList() {
  return (
    <div className="space-y-4">
      {mockExpenses.map((expense) => (
        <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">{expense.description}</h3>
            <p className="text-sm text-gray-600">{expense.category}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{expense.amount}</span>
              {expense.trend === 'up' ? (
                <ArrowUp className="w-4 h-4 text-red-500" />
              ) : (
                <ArrowDown className="w-4 h-4 text-green-500" />
              )}
            </div>
            <p className="text-sm text-gray-600">{expense.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}