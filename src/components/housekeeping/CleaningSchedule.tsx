import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

const mockSchedule = [
  {
    id: '1',
    room: '101',
    status: 'pending',
    assignedTo: 'Maria Garcia',
    timeSlot: '09:00 AM - 10:00 AM',
    priority: 'high'
  },
  {
    id: '2',
    room: '102',
    status: 'completed',
    assignedTo: 'John Smith',
    timeSlot: '10:00 AM - 11:00 AM',
    priority: 'medium'
  }
];

export function CleaningSchedule() {
  return (
    <div className="p-6">
      <div className="grid gap-4">
        {mockSchedule.map((task) => (
          <div 
            key={task.id} 
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center space-x-4">
              {task.status === 'completed' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Clock className="w-5 h-5 text-yellow-600" />
              )}
              <div>
                <h3 className="font-medium">Room {task.room}</h3>
                <p className="text-sm text-gray-600">{task.timeSlot}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{task.assignedTo}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                task.priority === 'high' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {task.priority} priority
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}