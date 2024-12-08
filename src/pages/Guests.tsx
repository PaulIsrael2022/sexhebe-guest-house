import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import type { Guest } from '../types';
import { guestService } from '../services/guestService';
import { GuestForm } from '../components/guests/GuestForm';
import { toast } from 'react-hot-toast';

export function Guests() {
  const [showForm, setShowForm] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await guestService.getAllGuests();
      setGuests(data);
    } catch (error) {
      console.error('Failed to load guests:', error);
      setError('Failed to load guests. Please try again later.');
      toast.error('Failed to load guests');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await loadGuests();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await guestService.searchGuests(searchQuery);
      setGuests(data);
    } catch (error) {
      console.error('Failed to search guests:', error);
      setError('Failed to search guests. Please try again later.');
      toast.error('Failed to search guests');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGuest = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this guest?')) {
      return;
    }

    try {
      await guestService.deleteGuest(id);
      toast.success('Guest deleted successfully');
      loadGuests();
    } catch (error) {
      console.error('Failed to delete guest:', error);
      toast.error('Failed to delete guest');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <p className="mb-4">{error}</p>
          <button
            onClick={loadGuests}
            className="text-blue-600 hover:text-blue-800"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (guests.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <p className="mb-4">No guests found</p>
          <button
            onClick={() => {
              setSelectedGuest(null);
              setShowForm(true);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            Add your first guest
          </button>
        </div>
      );
    }

    return (
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Number</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {guests.map((guest) => (
            <tr key={guest.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {`${guest.first_name} ${guest.last_name}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {guest.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {guest.phone || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {guest.id_number || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => {
                    setSelectedGuest(guest);
                    setShowForm(true);
                  }}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteGuest(guest.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Guests</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search guests..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search 
              className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={handleSearch}
            />
          </div>
          <button
            onClick={() => {
              setSelectedGuest(null);
              setShowForm(true);
            }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            <span>New Guest</span>
          </button>
        </div>
      </div>

      {showForm && (
        <GuestForm
          guest={selectedGuest}
          onClose={() => {
            setShowForm(false);
            setSelectedGuest(null);
          }}
          onSave={() => {
            loadGuests();
            setShowForm(false);
            setSelectedGuest(null);
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}