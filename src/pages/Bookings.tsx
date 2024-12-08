import React, { useState, useEffect } from 'react';
import { Calendar, Plus, List } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { BookingForm } from '../components/bookings/BookingForm';
import { BookingCalendar } from '../components/bookings/BookingCalendar';
import { BookingList } from '../components/bookings/BookingList';
import type { Booking } from '../types';
import { bookingService } from '../services/bookingService';

export function Bookings() {
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setError('Failed to load bookings. Please try again later.');
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadBookings();
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedBooking(null);
  };

  const handleBookingSaved = () => {
    loadBookings();
    handleCloseForm();
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
            onClick={handleRefresh}
            className="text-blue-600 hover:text-blue-800"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (viewMode === 'list' && bookings.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <p className="mb-4">No bookings found</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            Create your first booking
          </button>
        </div>
      );
    }

    return viewMode === 'calendar' ? (
      <BookingCalendar bookings={bookings} onRefresh={handleRefresh} />
    ) : (
      <BookingList 
        bookings={bookings} 
        onRefresh={handleRefresh} 
        onBookingUpdate={handleBookingSaved}
        onEdit={handleEdit}
      />
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <div className="flex space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center space-x-2 px-3 py-1 rounded ${
                viewMode === 'calendar' ? 'bg-white shadow' : ''
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-2 px-3 py-1 rounded ${
                viewMode === 'list' ? 'bg-white shadow' : ''
              }`}
            >
              <List className="w-4 h-4" />
              <span>List</span>
            </button>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {showForm && (
        <BookingForm
          booking={selectedBooking}
          onClose={handleCloseForm}
          onSave={handleBookingSaved}
        />
      )}

      {renderContent()}
    </div>
  );
}