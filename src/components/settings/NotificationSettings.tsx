import React, { useState } from 'react';
import { Bell, Mail, MessageSquare } from 'lucide-react';

export function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    newBooking: {
      email: true,
      push: true,
      sms: false
    },
    checkIn: {
      email: true,
      push: true,
      sms: true
    },
    checkOut: {
      email: true,
      push: false,
      sms: false
    },
    lowInventory: {
      email: true,
      push: true,
      sms: false
    }
  });

  const handleToggle = (category: string, type: string) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [type]: !prev[category as keyof typeof prev][type as keyof typeof prev[keyof typeof prev]]
      }
    }));
  };

  const NotificationRow = ({ title, category }: { title: string; category: string }) => (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={notifications[category as keyof typeof notifications].email}
            onChange={() => handleToggle(category, 'email')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <Mail className="ml-2 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={notifications[category as keyof typeof notifications].push}
            onChange={() => handleToggle(category, 'push')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <Bell className="ml-2 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={notifications[category as keyof typeof notifications].sms}
            onChange={() => handleToggle(category, 'sms')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <MessageSquare className="ml-2 h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Notification Channels</h3>
            <p className="text-sm text-gray-500">Choose how you want to be notified</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Mail className="h-5 w-5 mr-1" /> Email
            </span>
            <span className="flex items-center">
              <Bell className="h-5 w-5 mr-1" /> Push
            </span>
            <span className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-1" /> SMS
            </span>
          </div>
        </div>

        <div className="divide-y">
          <NotificationRow title="New Booking Notifications" category="newBooking" />
          <NotificationRow title="Check-in Notifications" category="checkIn" />
          <NotificationRow title="Check-out Notifications" category="checkOut" />
          <NotificationRow title="Low Inventory Alerts" category="lowInventory" />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}