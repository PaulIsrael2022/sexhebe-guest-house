import React from 'react';
import { RoomStatus } from '../components/dashboard/RoomStatus';
import { RecentBookings } from '../components/dashboard/RecentBookings';
import { Statistics } from '../components/dashboard/Statistics';

export function Dashboard() {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Statistics />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RoomStatus />
        <RecentBookings />
      </div>
    </div>
  );
}