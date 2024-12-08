import { supabase } from '../lib/supabase';
import type { FinancialReport } from '../types';

export const financialService = {
  async generateReport(startDate: string, endDate: string): Promise<FinancialReport> {
    // Get all bookings in date range
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*')
      .gte('checkIn', startDate)
      .lte('checkOut', endDate);

    // Get all expenses in date range
    const { data: expenses } = await supabase
      .from('expenses')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate);

    // Calculate revenue
    const bookingRevenue = bookings?.reduce((sum, booking) => sum + booking.totalAmount, 0) || 0;

    // Calculate expenses by category
    const expensesByCategory = expenses?.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>) || {};

    const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);

    // Calculate occupancy rate
    const { data: rooms } = await supabase.from('rooms').select('*');
    const totalRoomDays = (rooms?.length || 0) * getDaysBetween(startDate, endDate);
    const occupiedRoomDays = bookings?.reduce((sum, booking) => {
      return sum + getDaysBetween(booking.checkIn, booking.checkOut);
    }, 0) || 0;
    const occupancyRate = totalRoomDays > 0 ? (occupiedRoomDays / totalRoomDays) * 100 : 0;

    const report: FinancialReport = {
      id: `${startDate}_${endDate}`,
      startDate,
      endDate,
      revenue: {
        bookings: bookingRevenue,
        other: 0, // Add other revenue sources if needed
        total: bookingRevenue
      },
      expenses: {
        byCategory: expensesByCategory,
        total: totalExpenses
      },
      profit: bookingRevenue - totalExpenses,
      occupancyRate
    };

    return report;
  },

  async saveReport(report: FinancialReport): Promise<void> {
    const { error } = await supabase
      .from('financial_reports')
      .insert([report]);

    if (error) throw error;
  },

  async getReport(startDate: string, endDate: string): Promise<FinancialReport | null> {
    const { data, error } = await supabase
      .from('financial_reports')
      .select('*')
      .eq('startDate', startDate)
      .eq('endDate', endDate)
      .single();

    if (error) throw error;
    return data;
  }
};

function getDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
