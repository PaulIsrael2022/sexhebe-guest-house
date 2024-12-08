import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { guestService } from '../../services/guestService';
import type { Guest } from '../../types';
import { GuestForm } from './GuestForm';

interface GuestListProps {
  guests: Guest[];
  searchQuery: string;
  onUpdate: () => void;
}

export function GuestList({ guests, searchQuery, onUpdate }: GuestListProps) {
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (guest.phone && guest.phone.includes(searchQuery))
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guest?')) return;
    
    try {
      await guestService.deleteGuest(id);
      toast.success('Guest deleted successfully');
      onUpdate();
    } catch (error) {
      console.error('Failed to delete guest:', error);
      toast.error('Failed to delete guest');
    }
  };

  return (
    <>
      {editingGuest && (
        <GuestForm 
          guest={editingGuest} 
          onClose={() => setEditingGuest(null)}
          onSubmit={() => {
            setEditingGuest(null);
            onUpdate();
          }}
        />
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredGuests.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No guests found
                </td>
              </tr>
            ) : (
              filteredGuests.map((guest) => (
                <tr key={guest.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{guest.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{guest.email}</div>
                    <div className="text-sm text-gray-500">{guest.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{guest.idNumber || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{guest.address || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => setEditingGuest(guest)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(guest.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}