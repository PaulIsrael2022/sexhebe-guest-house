import React from 'react';
import { CheckCircle, Clock, RotateCcw } from 'lucide-react';

interface TaskListProps {
  filterStatus: string;
}

const mockTasks = [
  {
    id: '1',
    title: 'Clean Room 101',
    description: 'Regular cleaning and bed making',
    assignedTo: 'Maria Garcia',
    status: 'pending',
    priority: 'high',
    dueDate: '2024-03-15'
  },
  {
    id: '2',
    title: 'Restock Supplies',
    description: 'Restock cleaning supplies in storage',
    assignedTo: 'John Smith',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2024-03-16'
  }
];

const statusIcons = {
  pending: Clock,
  'in-progress': RotateCcw,
  completed: CheckCircle
};

const priorityColors = {
  high: 'text-red-600',
  medium: 'text-yellow-600',
  low: 'text-green-600'
};

export function TaskList({ filterStatus }: TaskListProps) {
  const filteredTasks = filterStatus === 'all'
    ? mockTasks
    : mockTasks.filter(task => task.status === filterStatus);

  return (
    <div className="divide-y">
      {filteredTasks.map((task) => {
        const StatusIcon = statusIcons[task.status as keyof typeof statusIcons];
        
        return (
          <div key={task.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              </div>
              <StatusIcon className={`w-5 h-5 ${
                task.status === 'completed' ? 'text-green-600' : 'text-gray-400'
              }`} />
            </div>
            
            <div className="mt-2 flex items-center space-x-4 text-sm">
              <span className="text-gray-600">Assigned to: {task.assignedTo}</span>
              <span className={`${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </span>
              <span className="text-gray-600">Due: {task.dueDate}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}