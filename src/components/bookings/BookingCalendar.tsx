import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  startOfWeek,
  endOfWeek,
  isSameDay,
  parseISO
} from 'date-fns';
import type { Booking } from '../../types';

interface BookingCalendarProps {
  bookings: Booking[];
  onRefresh?: () => void;
}

export function BookingCalendar({ bookings, onRefresh }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDayBookings = (day: Date) => {
    return bookings.filter(booking => {
      const checkIn = parseISO(booking.check_in);
      const checkOut = parseISO(booking.check_out);
      return (isSameDay(day, checkIn) || day > checkIn) && (isSameDay(day, checkOut) || day < checkOut);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 flex items-center justify-between border-b">
        <h2 className="text-lg font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm hover:bg-gray-100 rounded-md"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className={`
                min-h-24 p-2 border rounded-lg
                ${isSameMonth(day, currentDate) ? 'bg-white' : 'bg-gray-50'}
                ${isToday(day) ? 'border-blue-500' : 'border-gray-200'}
              `}
            >
              <div className="flex justify-between items-start">
                <span
                  className={`
                    text-sm font-medium
                    ${isSameMonth(day, currentDate) ? 'text-gray-900' : 'text-gray-400'}
                    ${isToday(day) ? 'text-blue-600' : ''}
                  `}
                >
                  {format(day, 'd')}
                </span>
                {getDayBookings(day).length > 0 && (
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {getDayBookings(day).length}
                  </span>
                )}
              </div>
              <div className="mt-2 space-y-1">
                {getDayBookings(day).map(booking => (
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
          ))}
        </div>
      </div>
    </div>
  );
}