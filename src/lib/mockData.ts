import { Room, Guest, Booking, Invoice, Expense, FinancialReport, Quotation } from '../types';

export const mockRooms: Room[] = [
  {
    id: '1',
    number: '101',
    type: 'single',
    status: 'available',
    price: 100,
    amenities: ['WiFi', 'TV', 'Air Conditioning'],
    description: 'Cozy single room with city view'
  },
  {
    id: '2',
    number: '102',
    type: 'double',
    status: 'occupied',
    price: 150,
    amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'],
    description: 'Spacious double room with garden view'
  },
  {
    id: '3',
    number: '103',
    type: 'suite',
    status: 'available',
    price: 250,
    amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Jacuzzi'],
    description: 'Luxury suite with ocean view'
  }
];

export const mockGuests: Guest[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '098-765-4321'
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    roomId: '2',
    guestId: '1',
    checkIn: '2024-01-01',
    checkOut: '2024-01-05',
    status: 'confirmed',
    totalAmount: 600,
    paymentStatus: 'paid'
  },
  {
    id: '2',
    roomId: '1',
    guestId: '2',
    checkIn: '2024-01-10',
    checkOut: '2024-01-12',
    status: 'pending',
    totalAmount: 200,
    paymentStatus: 'pending'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    bookingId: '1',
    guestId: '1',
    date: '2024-01-01',
    dueDate: '2024-01-15',
    items: [
      {
        description: 'Room 102 - Double Room (4 nights)',
        quantity: 4,
        unitPrice: 150,
        total: 600
      }
    ],
    subtotal: 600,
    tax: 60,
    total: 660,
    status: 'paid'
  }
];

export const mockExpenses: Expense[] = [
  {
    id: '1',
    date: '2024-01-01',
    category: 'Utilities',
    description: 'Electricity Bill',
    amount: 500,
    paymentMethod: 'Bank Transfer',
    status: 'paid'
  },
  {
    id: '2',
    date: '2024-01-02',
    category: 'Maintenance',
    description: 'Room 101 AC Repair',
    amount: 200,
    paymentMethod: 'Cash',
    status: 'paid'
  }
];

export const mockFinancialReports: FinancialReport[] = [
  {
    id: '1',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    revenue: {
      bookings: 800,
      other: 100,
      total: 900
    },
    expenses: {
      byCategory: {
        'Utilities': 500,
        'Maintenance': 200
      },
      total: 700
    },
    profit: 200,
    occupancyRate: 65
  }
];

export const mockQuotations: Quotation[] = [
  {
    id: '1',
    guestId: '1',
    date: '2024-01-01',
    validUntil: '2024-01-15',
    items: [
      {
        description: 'Deluxe Room - 3 nights',
        quantity: 3,
        unitPrice: 150,
        total: 450
      },
      {
        description: 'Airport Transfer',
        quantity: 1,
        unitPrice: 50,
        total: 50
      }
    ],
    subtotal: 500,
    tax: 50,
    total: 550,
    status: 'sent',
    notes: 'Special request for early check-in'
  },
  {
    id: '2',
    guestId: '2',
    date: '2024-01-05',
    validUntil: '2024-01-20',
    items: [
      {
        description: 'Suite Room - 2 nights',
        quantity: 2,
        unitPrice: 250,
        total: 500
      }
    ],
    subtotal: 500,
    tax: 50,
    total: 550,
    status: 'draft'
  }
];
