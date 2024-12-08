import React from 'react';
import { User } from 'lucide-react';

const mockStaffSchedule = [
  {
    id: '1',
    name: 'Maria Garcia',
    shift: 'Morning',
    hours: '7:00 AM - 3:00 PM',
    assignedRooms: ['101', '102', '103'],
    status: 'on-duty'
  },
  {
    id: '2',
    name: 'John Smith',
    shift: 'Afternoon',
    hours: '3:00 PM - 11:00 PM',
    assignedRooms: ['201', '202', '203'],
    status: 'break'
  }
];

export function StaffSchedule() {
  return (
    <div className="p-6">
      <div className="grid gap-4">
        {mockStaffSchedule.map((staff) => (
          <div key={staff.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{staff.name}</h3>
                  <p className="text-sm text-gray-600">{staff.shift} Shift</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                staff.status === 'on-duty' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {staff.status}
              </span>
            </div>
            <div className="ml-10">
              <p className="text-sm text-gray-600">{staff.hours}</p>
              <div className="mt-2">
                <p className="text-sm font-medium">Assigned Rooms:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {staff.assignedRooms.map((room) => (
                    <span 
                      key={room}
                      className="px-2 py-1 bg-gray-100 rounded-lg text-sm"
                    >
                      Room {room}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}