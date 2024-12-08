import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  DollarSign, 
  Users, 
  Bed, 
  FileText, 
  Receipt,
  ClipboardList,
  Settings,
  CheckSquare,
  Sparkles,
  BarChart
} from 'lucide-react';

const sidebarNavItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    title: 'Bookings',
    href: '/bookings',
    icon: Calendar,
  },
  {
    title: 'Rooms',
    href: '/rooms',
    icon: Bed,
  },
  {
    title: 'Guests',
    href: '/guests',
    icon: Users,
  },
  {
    title: 'Finance',
    href: '/finance',
    icon: DollarSign,
  },
  {
    title: 'Quotations',
    href: '/quotations',
    icon: ClipboardList,
  },
  {
    title: 'Tasks',
    href: '/tasks',
    icon: CheckSquare,
  },
  {
    title: 'Housekeeping',
    href: '/housekeeping',
    icon: Sparkles,
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: BarChart,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="h-screen w-64 bg-gray-900 text-white fixed left-0 top-0 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Guest House Manager</h1>
        <p className="text-sm text-gray-400 mt-1">Administration Panel</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {sidebarNavItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/' && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-400">admin@guesthouse.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}