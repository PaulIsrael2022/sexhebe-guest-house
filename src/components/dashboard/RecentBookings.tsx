import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { bookingService } from '../../services/bookingService';
import { Booking } from '../../types';
import toast from 'react-hot-toast'; // Assuming you have react-hot-toast installed

const statusColors = {
  confirmed: 'bg-green-100 text-green-800',
  'checked-in': 'bg-blue-100 text-blue-800',
  'checked-out': 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
};

const formatSafeDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return format(date, 'MMM dd, yyyy');
  } catch {
    return 'Invalid Date';
  }
};

export function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await bookingService.getAllBookings();
      setBookings(data.slice(0, 5)); // Only show 5 most recent bookings
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await bookingService.deleteBooking(id);
        setBookings(bookings.filter(booking => booking.id !== id));
        toast.success('Booking deleted successfully');
      } catch (error) {
        console.error('Failed to delete booking:', error);
        toast.error('Failed to delete booking. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
        <p className="text-sm text-gray-600">No bookings available to display.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{booking.guests?.first_name} {booking.guests?.last_name}</p>
                <p className="text-sm text-gray-600">Room {booking.rooms?.room_number}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${statusColors[booking.status as keyof typeof statusColors]}`}>
                {booking.status}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <p>Check-in: {formatSafeDate(booking.check_in)}</p>
              <p>Check-out: {formatSafeDate(booking.check_out)}</p>
            </div>
            <button onClick={(e) => { e.preventDefault(); handleDeleteBooking(booking.id); }} className="mt-2 text-red-600 hover:text-red-800">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}