import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Search, RefreshCw, ClipboardList, Package, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { format } from 'date-fns';
import { toast } from '../components/ui/toast';
import { housekeepingService, CleaningTask, InventoryItem, StaffMember } from '../services/housekeepingService';

export function Housekeeping() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'inventory' | 'staff'>('tasks');
  const [tasks, setTasks] = useState<CleaningTask[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      switch (activeTab) {
        case 'tasks':
          const tasksData = await housekeepingService.getAllTasks();
          setTasks(tasksData);
          break;
        case 'inventory':
          const inventoryData = await housekeepingService.getAllInventory();
          setInventory(inventoryData);
          break;
        case 'staff':
          const staffData = await housekeepingService.getAllStaff();
          setStaff(staffData);
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setIsEditing(false);
    setEditingItem(null);
    setShowForm(true);
  };

  const handleCreate = async (data: any) => {
    try {
      switch (activeTab) {
        case 'tasks':
          await housekeepingService.createTask(data);
          break;
        case 'inventory':
          await housekeepingService.createInventoryItem(data);
          break;
        case 'staff':
          await housekeepingService.createStaffMember(data);
          break;
      }
      loadData();
      setShowForm(false);
      toast({
        title: 'Success',
        description: 'Item created successfully',
      });
    } catch (error) {
      console.error('Error creating item:', error);
      toast({
        title: 'Error',
        description: 'Failed to create item. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      switch (activeTab) {
        case 'tasks':
          await housekeepingService.updateTask(id, data);
          break;
        case 'inventory':
          await housekeepingService.updateInventoryItem(id, data);
          break;
        case 'staff':
          await housekeepingService.updateStaffMember(id, data);
          break;
      }
      loadData();
      setShowForm(false);
      toast({
        title: 'Success',
        description: 'Item updated successfully',
      });
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update item. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      switch (activeTab) {
        case 'tasks':
          await housekeepingService.deleteTask(id);
          break;
        case 'inventory':
          await housekeepingService.deleteInventoryItem(id);
          break;
        case 'staff':
          await housekeepingService.deleteStaffMember(id);
          break;
      }
      loadData();
      toast({
        title: 'Success',
        description: 'Item deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete item. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem?.id) {
      handleUpdate(editingItem.id, editingItem);
    } else {
      handleCreate(editingItem);
    }
  };

  const handleEdit = async (item: any) => {
    setIsEditing(true);
    setEditingItem(item);
    setShowForm(true);
  };

  const renderTasksTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Staff</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.assignedStaff.join(', ')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button onClick={() => handleEdit(task)} className="text-blue-600 hover:text-blue-900">Edit</button>
                <button onClick={() => handleDelete(task.id)} className="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderInventoryTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reorder Point</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Restocked</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {inventory.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.unit}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.reorder_point}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {format(new Date(item.last_restocked), 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderStaffTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shift</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Rooms</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {staff.map((member) => (
            <tr key={member.id}>
              <td className="px-6 py-4 whitespace-nowrap">{member.first_name} {member.last_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{member.shift}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  member.status === 'available' ? 'bg-green-100 text-green-800' :
                  member.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {member.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{member.assigned_rooms.join(', ')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(member)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(member.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {activeTab === 'tasks' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Task Name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={editingItem?.name || ''}
              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned Staff</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter staff names separated by commas"
              value={editingItem?.assignedStaff?.join(', ') || ''}
              onChange={(e) => setEditingItem({ ...editingItem, assignedStaff: e.target.value.split(',').map(staff => staff.trim()) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={editingItem?.status || 'pending'}
              onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </>
      )}

      {activeTab === 'inventory' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={editingItem?.name || ''}
              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={editingItem?.quantity || ''}
              onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Unit</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={editingItem?.unit || ''}
              onChange={(e) => setEditingItem({ ...editingItem, unit: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reorder Point</label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={editingItem?.reorder_point || ''}
              onChange={(e) => setEditingItem({ ...editingItem, reorder_point: parseInt(e.target.value) })}
            />
          </div>
        </>
      )}

      {activeTab === 'staff' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={editingItem?.first_name || ''}
              onChange={(e) => setEditingItem({ ...editingItem, first_name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={editingItem?.last_name || ''}
              onChange={(e) => setEditingItem({ ...editingItem, last_name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Shift</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={editingItem?.shift || 'morning'}
              onChange={(e) => setEditingItem({ ...editingItem, shift: e.target.value })}
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="night">Night</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={editingItem?.status || 'available'}
              onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
            >
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="off_duty">Off Duty</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned Rooms</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter room numbers separated by commas"
              value={editingItem?.assigned_rooms?.join(', ') || ''}
              onChange={(e) => setEditingItem({ ...editingItem, assigned_rooms: e.target.value.split(',').map(room => room.trim()) })}
            />
          </div>
        </>
      )}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setShowForm(false)}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </form>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Housekeeping</h1>
          <div className="flex space-x-2">
            <Button onClick={handleAdd} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
            <Button onClick={loadData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('tasks')}
                className={`py-4 px-6 inline-flex items-center border-b-2 font-medium text-sm ${
                  activeTab === 'tasks'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Tasks
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`py-4 px-6 inline-flex items-center border-b-2 font-medium text-sm ${
                  activeTab === 'inventory'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package className="h-4 w-4 mr-2" />
                Inventory
              </button>
              <button
                onClick={() => setActiveTab('staff')}
                className={`py-4 px-6 inline-flex items-center border-b-2 font-medium text-sm ${
                  activeTab === 'staff'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                Staff
              </button>
            </nav>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            {activeTab === 'tasks' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Cleaning Tasks</h2>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleAdd()} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Task
                    </Button>
                  </div>
                </div>
                {renderTasksTable()}
              </div>
            )}
            {activeTab === 'inventory' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Inventory Items</h2>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleAdd()} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Item
                    </Button>
                  </div>
                </div>
                {renderInventoryTable()}
              </div>
            )}
            {activeTab === 'staff' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Staff Members</h2>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleAdd()} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Staff
                    </Button>
                  </div>
                </div>
                {renderStaffTable()}
              </div>
            )}
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isEditing ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
              </h2>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {renderForm()}
          </div>
        </div>
      )}
    </div>
  );
}