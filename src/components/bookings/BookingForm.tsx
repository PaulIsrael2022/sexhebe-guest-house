import React, { useState, useEffect } from 'react';
import { X, Search, Plus, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { bookingService } from '../../services/bookingService';
import { guestService } from '../../services/guestService';
import { roomService } from '../../services/roomService';
import type { Guest, Room, Booking } from '../../types';

interface BookingFormProps {
  booking?: Booking | null;
  onClose: () => void;
  onSave: () => void;
}

interface BookingFormData {
  guestId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  status: string;
  notes: string;
}

export function BookingForm({ booking, onClose, onSave }: BookingFormProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isNewGuest, setIsNewGuest] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [searchResults, setSearchResults] = useState<Guest[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<BookingFormData>({
    guestId: booking?.guest_id || '',
    roomId: booking?.room_id || '',
    checkIn: booking?.check_in ? new Date(booking.check_in).toISOString().split('T')[0] : '',
    checkOut: booking?.check_out ? new Date(booking.check_out).toISOString().split('T')[0] : '',
    status: booking?.status || 'pending',
    notes: booking?.notes || ''
  });

  const [guestData, setGuestData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    id_number: '',
    address: ''
  });

  useEffect(() => {
    loadFormData();
  }, []);

  useEffect(() => {
    const searchGuests = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        const results = await guestService.searchGuests(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Failed to search guests:', error);
        toast.error('Failed to search for guests');
      }
    };

    const debounce = setTimeout(searchGuests, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const loadFormData = async () => {
    try {
      setLoading(true);
      const [guestsData, roomsData] = await Promise.all([
        guestService.getAllGuests(),
        roomService.getAllRooms()
      ]);
      setGuests(guestsData);
      setRooms(roomsData);
    } catch (error) {
      console.error('Failed to load form data:', error);
      toast.error('Failed to load form data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);

      // If creating a new guest
      let guestId = selectedGuest?.id || formData.guestId;
      if (isNewGuest) {
        const newGuest = await guestService.createGuest(guestData);
        guestId = newGuest.id;
      }

      // Get the selected room's price per night
      const selectedRoom = rooms.find(room => room.id === formData.roomId);
      if (!selectedRoom) {
        throw new Error('Please select a room');
      }

      const bookingData = {
        guest_id: guestId,
        room_id: formData.roomId,
        check_in: formData.checkIn,
        check_out: formData.checkOut,
        status: formData.status as Booking['status'],
        notes: formData.notes,
        price_per_night: selectedRoom.price_per_night,
        total_amount: calculateTotalAmount(selectedRoom.price_per_night, formData.checkIn, formData.checkOut)
      };

      if (booking) {
        await bookingService.updateBooking(booking.id, bookingData);
        toast.success('Booking updated successfully');
      } else {
        await bookingService.createBooking(bookingData);
        toast.success('Booking created successfully');
      }
      
      onSave();
    } catch (error) {
      console.error('Failed to save booking:', error);
      setError('Failed to save booking. Please try again.');
      toast.error('Failed to save booking');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotalAmount = (pricePerNight: number, checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return pricePerNight * nights;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuestData(prev => ({ ...prev, [name]: value }));
  };

  const selectGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setFormData(prev => ({ ...prev, guestId: guest.id }));
    setSearchQuery(`${guest.first_name} ${guest.last_name}`);
    setShowSearchResults(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{booking ? 'Edit Booking' : 'New Booking'}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Guest Information</h3>
              <button
                type="button"
                onClick={() => {
                  setIsNewGuest(!isNewGuest);
                  setSelectedGuest(null);
                  setSearchQuery('');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                {isNewGuest ? (
                  <>Select Existing<Search className="w-4 h-4 ml-1" /></>
                ) : (
                  <>Add New<UserPlus className="w-4 h-4 ml-1" /></>
                )}
              </button>
            </div>

            {!isNewGuest ? (
              <div className="space-y-2">
                <div className="relative">
                  <div className="flex items-center border rounded-md">
                    <Search className="w-5 h-5 ml-2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email, phone or ID..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSearchResults(true);
                      }}
                      className="w-full p-2 rounded-md focus:outline-none"
                    />
                  </div>
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {searchResults.map((guest) => (
                        <div
                          key={guest.id}
                          onClick={() => selectGuest(guest)}
                          className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                        >
                          <div className="font-medium">{guest.first_name} {guest.last_name}</div>
                          <div className="text-sm text-gray-600">{guest.email}</div>
                          {guest.phone && <div className="text-sm text-gray-500">{guest.phone}</div>}
                          {guest.id_number && <div className="text-xs text-gray-500">ID: {guest.id_number}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                  {showSearchResults && searchQuery.length >= 2 && searchResults.length === 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg p-4 text-center text-gray-500">
                      No guests found. Try a different search term or add a new guest.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      required
                      value={guestData.first_name}
                      onChange={handleGuestChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      required
                      value={guestData.last_name}
                      onChange={handleGuestChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={guestData.email}
                    onChange={handleGuestChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={guestData.phone}
                    onChange={handleGuestChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ID Number
                  </label>
                  <input
                    type="text"
                    name="id_number"
                    value={guestData.id_number}
                    onChange={handleGuestChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={guestData.address}
                    onChange={handleGuestChange}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium mb-4">Booking Details</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
                  Room <span className="text-red-500">*</span>
                </label>
                <select
                  id="roomId"
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={loading}
                >
                  <option value="">Select a room</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      Room {room.room_number} - BWP {room.price_per_night.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per night
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700">
                    Check-in Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="checkIn"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700">
                    Check-out Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="checkOut"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {formData.roomId && formData.checkIn && formData.checkOut && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Price Summary</h4>
                  {(() => {
                    const selectedRoom = rooms.find(room => room.id === formData.roomId);
                    if (!selectedRoom) return null;
                    
                    const nights = Math.ceil(
                      (new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / 
                      (1000 * 60 * 60 * 24)
                    );
                    const total = selectedRoom.price_per_night * nights;
                    
                    return (
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Room Rate:</span>
                          <span>BWP {selectedRoom.price_per_night.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per night</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Number of Nights:</span>
                          <span>{nights} night{nights !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex justify-between font-medium pt-2 border-t">
                          <span>Total Amount:</span>
                          <span>BWP {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={loading}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || (!isNewGuest && !selectedGuest)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {submitting ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                booking ? 'Update Booking' : 'Create Booking'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}