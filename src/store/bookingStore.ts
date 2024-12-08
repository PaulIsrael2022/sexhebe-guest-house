import { create } from 'zustand';
import { Booking } from '../types';
import { bookingService } from '../services/bookingService';

interface BookingStore {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  createBooking: (booking: Omit<Booking, 'id'>) => Promise<void>;
  fetchBookingsByDateRange: (startDate: Date, endDate: Date) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
}

export const useBookingStore = create<BookingStore>((set) => ({
  bookings: [],
  loading: false,
  error: null,
  createBooking: async (booking) => {
    set({ loading: true });
    try {
      const newBooking = await bookingService.createBooking(booking);
      set((state) => ({
        bookings: [...state.bookings, newBooking],
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  fetchBookingsByDateRange: async (startDate, endDate) => {
    set({ loading: true });
    try {
      const bookings = await bookingService.getBookingsByDateRange(startDate, endDate);
      set({ bookings, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  updateBookingStatus: async (id, status) => {
    try {
      await bookingService.updateBookingStatus(id, status);
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking.id === id ? { ...booking, status } : booking
        ),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));