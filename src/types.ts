export interface Quotation {
  id: string;
  number: string;
  guest_id: string;
  amount: number;
  subtotal: number;
  tax: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  valid_until: string;
  date: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  items: QuotationItem[];
  guests?: Guest;
}

export interface QuotationItem {
  id?: string;
  quotation_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at?: string;
  updated_at?: string;
}

export interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  id_number?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  room_number: string;
  room_type: string;
  status: 'available' | 'occupied' | 'maintenance';
  price_per_night: number;
  amenities?: string[];
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id: string;
  guest_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  price_per_night: number;
  total_amount: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  guests: Guest;
  rooms: Room;
}

export interface Invoice {
  id: string;
  booking_id: string;
  quotation_id?: string;
  invoice_number: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  due_date: string;
  issued_date: string;
  paid_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  bookings?: Booking;
  quotations?: Quotation;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  paid_by?: string;
  receipt_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FinancialReport {
  revenue: number;
  expenses: number;
  profit: number;
  pendingPayments: number;
  period: {
    start: string;
    end: string;
  };
}
