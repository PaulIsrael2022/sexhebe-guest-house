import React from 'react';
import { Bell, User } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 fixed top-0 right-0 left-64">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-full relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
          <User className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-700">Admin</span>
        </button>
      </div>
    </header>
  );
}