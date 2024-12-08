import React from 'react';
import { format, parseISO } from 'date-fns';
import type { Booking } from '../../types';

interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  bookings: Booking[];
}

export function CalendarDay({ date, isCurrentMonth, isToday, bookings }: CalendarDayProps) {
  return (
    <div
      className={`
        min-h-24 p-2 border rounded-lg
        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
        ${isToday ? 'border-blue-500' : 'border-gray-200'}
      `}
    >
      <div className="flex justify-between items-start">
        <span
          className={`
            text-sm font-medium
            ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
            ${isToday ? 'text-blue-600' : ''}
          `}
        >
          {format(date, 'd')}
        </span>
        {bookings.length > 0 && (
          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            {bookings.length}
          </span>
        )}
      </div>
      <div className="mt-2 space-y-1">
        {bookings.map(booking => (
          <div
            key={booking.id}
            className={`
              text-xs p-1 rounded truncate cursor-pointer
              ${booking.status === 'confirmed' ? 'bg-green-50 text-green-700' :
                booking.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                'bg-blue-50 text-blue-700'}
            `}
            title={`
              Guest: ${booking.guests.first_name} ${booking.guests.last_name}
              Room: ${booking.rooms.room_number}
              Check-in: ${format(parseISO(booking.check_in), 'MMM d')}
              Check-out: ${format(parseISO(booking.check_out), 'MMM d')}
              Status: ${booking.status}
            `}
          >
            {`${booking.guests.first_name} ${booking.guests.last_name.charAt(0)}.`}
          </div>
        ))}
      </div>
    </div>
  );
}