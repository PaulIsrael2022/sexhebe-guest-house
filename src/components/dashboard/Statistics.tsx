import React, { useEffect, useState } from 'react';
import { Users, BedDouble, BanknoteIcon, Percent } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Format number to BWP currency
const formatBWP = (amount: number) => {
  return new Intl.NumberFormat('en-BW', {
    style: 'currency',
    currency: 'BWP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format percentage
const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`;
};

const stats = [
  {
    name: 'Total Guests',
    icon: Users,
    format: (value: number) => value.toString(),
  },
  {
    name: 'Room Occupancy',
    icon: BedDouble,
    format: formatPercentage,
  },
  {
    name: 'Revenue',
    icon: BanknoteIcon,
    format: formatBWP,
  },
  {
    name: 'Booking Rate',
    icon: Percent,
    format: formatPercentage,
  }
];

export function Statistics() {
  const [totalGuests, setTotalGuests] = useState<number>(0);
  const [roomOccupancy, setRoomOccupancy] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);
  const [bookingRate, setBookingRate] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      // Get total guests
      const { data: guestsData } = await supabase
        .from('guests')
        .select('*', { count: 'exact' });
      setTotalGuests(guestsData?.length || 0);

      // Get room occupancy
      const { data: roomsData } = await supabase
        .from('rooms')
        .select('*');
      const totalRooms = roomsData?.length || 0;
      const occupiedRooms = roomsData?.filter(room => room.status === 'occupied').length || 0;
      setRoomOccupancy(totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0);

      // Get total revenue
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('price_per_night, check_in, check_out');
      
      const totalRevenue = bookingsData?.reduce((acc, booking) => {
        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        return acc + (booking.price_per_night * nights);
      }, 0) || 0;
      setRevenue(totalRevenue);

      // Get booking rate
      const { data: bookingCountData } = await supabase
        .from('bookings')
        .select('*', { count: 'exact' });
      const totalBookings = bookingCountData?.length || 0;
      setBookingRate(totalRooms > 0 ? (totalBookings / totalRooms) * 100 : 0);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const values = [totalGuests, roomOccupancy, revenue, bookingRate];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={stat.name} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{stat.name}</p>
              <p className="text-2xl font-semibold mt-1">
                {stat.format(values[index])}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <stat.icon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}