export interface Room {
  id: string;
  number: string;
  type: 'single' | 'double' | 'suite';
  status: 'available' | 'occupied' | 'maintenance';
  price: number;
  amenities?: string[];
  description?: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Booking {
  id: string;
  roomId: string;
  guestId: string;
  checkIn: string;
  checkOut: string;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
}

export interface Invoice {
  id: string;
  bookingId: string;
  guestId: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  number: string;
  guest_id: string;
  date: string;
  valid_until: string;
  items: QuotationItem[];
  subtotal: number;
  tax: number;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  guests?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
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

export interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'paid';
}

export interface FinancialReport {
  id: string;
  startDate: string;
  endDate: string;
  revenue: {
    bookings: number;
    other: number;
    total: number;
  };
  expenses: {
    byCategory: Record<string, number>;
    total: number;
  };
  profit: number;
  occupancyRate: number;
}