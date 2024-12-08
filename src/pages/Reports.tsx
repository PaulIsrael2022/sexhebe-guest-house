import React, { useState, useEffect } from 'react';
import { Calendar, Download, Filter } from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Button } from '../components/ui/button';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Chart options
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Monthly Performance',
    },
  },
};

interface ReportData {
  guestCount: number;
  bookingCount: number;
  totalRevenue: number;
  occupancyRate: number;
  averageStayLength: number;
  paidInvoices: number;
  pendingInvoices: number;
  topRoomTypes: { type: string; bookings: number }[];
  monthlyStats: {
    month: string;
    revenue: number;
    bookings: number;
    guests: number;
  }[];
  guestDetails: {
    id: string;
    name: string;
    checkIn: string;
    checkOut: string;
    roomNumber: string;
    roomType: string;
    amountPaid: number;
    status: string;
  }[];
  expenseDetails: {
    id: string;
    date: string;
    category: string;
    description: string;
    amount: number;
    status: string;
  }[];
}

export function Reports() {
  const [dateRange, setDateRange] = useState<'month' | 'custom'>('month');
  const [startDate, setStartDate] = useState(startOfMonth(new Date()).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(endOfMonth(new Date()).toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'guests' | 'expenses'>('overview');

  useEffect(() => {
    loadReportData();
  }, [startDate, endDate]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      const mockData: ReportData = {
        guestCount: 156,
        bookingCount: 89,
        totalRevenue: 45678.90,
        occupancyRate: 78.5,
        averageStayLength: 3.2,
        paidInvoices: 67,
        pendingInvoices: 12,
        topRoomTypes: [
          { type: 'Deluxe', bookings: 34 },
          { type: 'Standard', bookings: 28 },
          { type: 'Suite', bookings: 15 }
        ],
        monthlyStats: [
          { month: 'Jan', revenue: 15000, bookings: 30, guests: 45 },
          { month: 'Feb', revenue: 18000, bookings: 35, guests: 52 },
          { month: 'Mar', revenue: 22000, bookings: 40, guests: 60 }
        ],
        guestDetails: [
          {
            id: '1',
            name: 'John Doe',
            checkIn: '2024-01-15',
            checkOut: '2024-01-18',
            roomNumber: '101',
            roomType: 'Deluxe',
            amountPaid: 450.00,
            status: 'Completed'
          },
          {
            id: '2',
            name: 'Jane Smith',
            checkIn: '2024-01-20',
            checkOut: '2024-01-25',
            roomNumber: '205',
            roomType: 'Suite',
            amountPaid: 1200.00,
            status: 'Completed'
          },
          // Add more mock guest data as needed
        ],
        expenseDetails: [
          {
            id: '1',
            date: '2024-01-10',
            category: 'Maintenance',
            description: 'Room 101 AC Repair',
            amount: 250.00,
            status: 'Paid'
          },
          {
            id: '2',
            date: '2024-01-15',
            category: 'Supplies',
            description: 'Cleaning Supplies',
            amount: 180.00,
            status: 'Paid'
          },
          // Add more mock expense data as needed
        ]
      };
      setReportData(mockData);
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: reportData?.monthlyStats.map(stat => stat.month) || [],
    datasets: [
      {
        label: 'Revenue',
        data: reportData?.monthlyStats.map(stat => stat.revenue) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Bookings',
        data: reportData?.monthlyStats.map(stat => stat.bookings) || [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
      }
    ]
  };

  const handleQuickDateSelect = (months: number) => {
    const end = new Date();
    const start = subMonths(end, months);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white rounded-lg shadow p-2">
            <Button
              variant={dateRange === 'month' ? 'default' : 'ghost'}
              onClick={() => setDateRange('month')}
            >
              Monthly
            </Button>
            <Button
              variant={dateRange === 'custom' ? 'default' : 'ghost'}
              onClick={() => setDateRange('custom')}
            >
              Custom
            </Button>
          </div>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4 mb-4">
          {dateRange === 'custom' ? (
            <>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
              <span>to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
            </>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => handleQuickDateSelect(1)}>Last Month</Button>
              <Button variant="outline" onClick={() => handleQuickDateSelect(3)}>Last 3 Months</Button>
              <Button variant="outline" onClick={() => handleQuickDateSelect(6)}>Last 6 Months</Button>
            </div>
          )}
        </div>

        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('guests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'guests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Guest Details
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'expenses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Expense Details
            </button>
          </nav>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : reportData ? (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-600">Total Guests</h3>
                    <p className="text-2xl font-semibold mt-1">{reportData.guestCount}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-600">Total Bookings</h3>
                    <p className="text-2xl font-semibold mt-1">{reportData.bookingCount}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-purple-600">Revenue</h3>
                    <p className="text-2xl font-semibold mt-1">${reportData.totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-orange-600">Occupancy Rate</h3>
                    <p className="text-2xl font-semibold mt-1">{reportData.occupancyRate}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Revenue & Bookings Trend</h3>
                    <Line options={options} data={chartData} />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Key Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Average Stay Length</span>
                        <span className="font-medium">{reportData.averageStayLength} days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Paid Invoices</span>
                        <span className="font-medium">{reportData.paidInvoices}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Pending Invoices</span>
                        <span className="font-medium">{reportData.pendingInvoices}</span>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Top Room Types</h4>
                        {reportData.topRoomTypes.map((room, index) => (
                          <div key={index} className="flex justify-between items-center mt-2">
                            <span className="text-gray-600">{room.type}</span>
                            <span className="font-medium">{room.bookings} bookings</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'guests' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Type</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.guestDetails.map((guest) => (
                      <tr key={guest.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{guest.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(guest.checkIn), 'MMM d, yyyy')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(guest.checkOut), 'MMM d, yyyy')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guest.roomNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guest.roomType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${guest.amountPaid.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            guest.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {guest.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'expenses' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.expenseDetails.map((expense) => (
                      <tr key={expense.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(expense.date), 'MMM d, yyyy')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{expense.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${expense.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            expense.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {expense.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500">No data available for the selected period.</div>
        )}
      </div>
    </div>
  );
}
