import { useState, useEffect } from 'react';
import { Quotation, Room } from '../types';
import { quotationService } from '../services/quotationService';
import { Button } from '../components/ui/button';
import { Plus, Edit, Trash2, Send, X, Save, Search, Download } from 'lucide-react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { supabase } from '../lib/supabase';

interface QuotationFormData {
  guestId: string;
  validUntil: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
  notes?: string;
}

export function Quotations() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuotation, setCurrentQuotation] = useState<Quotation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<QuotationFormData>({
    guestId: '',
    validUntil: new Date().toISOString().split('T')[0],
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    notes: ''
  });

  useEffect(() => {
    if (currentQuotation) {
      setFormData({
        guestId: currentQuotation.guest_id || '',
        validUntil: currentQuotation.valid_until?.split('T')[0] || new Date().toISOString().split('T')[0],
        items: currentQuotation.items?.map(item => ({
          description: item.description || '',
          quantity: item.quantity || 1,
          unitPrice: item.unit_price || 0
        })) || [{ description: '', quantity: 1, unitPrice: 0 }],
        notes: currentQuotation.notes || ''
      });
    }
  }, [currentQuotation]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Invalid date:', dateString);
      return 'Invalid date';
    }
  };

  const calculateSubtotal = (items: Quotation['items']) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((sum, item) => {
      const quantity = item.quantity || 0;
      const unitPrice = item.unit_price || 0;
      return sum + (quantity * unitPrice);
    }, 0);
  };

  const TAX_RATE = 0.14; // 14% VAT/Levy

  const calculateTax = (subtotal: number) => {
    return subtotal * TAX_RATE;
  };

  const calculateTotal = (quotation: Quotation) => {
    const subtotal = calculateSubtotal(quotation.items);
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const formatAmount = (amount: number) => {
    return `BWP ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  useEffect(() => {
    loadQuotations();
    loadRooms();
  }, []);

  const loadQuotations = async () => {
    try {
      setError(null);
      const data = await quotationService.getQuotations();
      setQuotations(data || []);
    } catch (error) {
      console.error('Error loading quotations:', error);
      setError('Failed to load quotations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('room_number');
      
      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error loading rooms:', error);
      setError('Failed to load rooms. Please try again later.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quotation?')) return;
    
    try {
      await quotationService.deleteQuotation(id);
      setQuotations(quotations.filter(q => q.id !== id));
    } catch (error) {
      console.error('Error deleting quotation:', error);
    }
  };

  const handleStatusUpdate = async (id: string, status: Quotation['status']) => {
    try {
      const updated = await quotationService.updateQuotation(id, { status });
      setQuotations(quotations.map(q => q.id === id ? updated : q));
    } catch (error) {
      console.error('Error updating quotation status:', error);
    }
  };

  const handleEdit = (quotation: Quotation) => {
    setIsEditing(true);
    setCurrentQuotation(quotation);
    setShowForm(true);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const subtotal = calculateSubtotal(formData.items);
      const tax = calculateTax(subtotal);
      const total = subtotal + tax;

      const quotationData = {
        ...formData,
        subtotal,
        tax,
        amount: total,
        status: 'draft' as const,
        date: new Date().toISOString()
      };

      if (isEditing && currentQuotation) {
        const updated = await quotationService.updateQuotation(currentQuotation.id, quotationData);
        setQuotations(quotations.map(q => q.id === currentQuotation.id ? updated : q));
      } else {
        const created = await quotationService.createQuotation(quotationData);
        setQuotations([...quotations, created]);
      }

      setShowForm(false);
      setFormData({
        guestId: '',
        validUntil: new Date().toISOString().split('T')[0],
        items: [{ description: '', quantity: 1, unitPrice: 0 }],
        notes: ''
      });
    } catch (error) {
      console.error('Error saving quotation:', error);
    }
  };

  const handleDownloadPDF = (quotation: Quotation) => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('Quotation', 105, 20, { align: 'center' });
    
    // Add quotation details
    doc.setFontSize(12);
    doc.text(`Quotation #: ${quotation.number}`, 20, 40);
    doc.text(`Date: ${formatDate(quotation.created_at)}`, 20, 50);
    doc.text(`Valid Until: ${formatDate(quotation.valid_until)}`, 20, 60);
    
    // Add guest details
    doc.text('Guest Details:', 20, 80);
    doc.text(`Name: ${quotation.guests?.first_name || 'N/A'} ${quotation.guests?.last_name || 'N/A'}`, 30, 90);
    doc.text(`Email: ${quotation.guests?.email || 'N/A'}`, 30, 100);
    
    // Add items table
    const tableData = (quotation.items || []).map(item => [
      `Room ${item.description}`,
      `${item.quantity} night${item.quantity > 1 ? 's' : ''}`,
      formatAmount(item.unit_price || 0),
      formatAmount((item.quantity || 0) * (item.unit_price || 0))
    ]);
    
    doc.autoTable({
      startY: 120,
      head: [['Room', 'Nights', 'Price/Night', 'Amount']],
      body: tableData,
      foot: [
        ['', '', 'Subtotal:', formatAmount(quotation.subtotal || 0)],
        ['', '', 'VAT/Levy (14%):', formatAmount(quotation.tax || 0)],
        ['', '', 'Total:', formatAmount(quotation.amount || 0)]
      ],
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
    });
    
    // Add notes if present
    if (quotation.notes) {
      const finalY = (doc as any).lastAutoTable.finalY || 120;
      doc.text('Notes:', 20, finalY + 20);
      doc.text(quotation.notes, 20, finalY + 30);
    }
    
    // Save the PDF
    doc.save(`quotation-${quotation.id}.pdf`);
  };

  const filteredQuotations = quotations.filter(quotation => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      quotation.status.toLowerCase().includes(searchTermLower) ||
      (quotation.guests?.first_name || '').toLowerCase().includes(searchTermLower) ||
      (quotation.guests?.last_name || '').toLowerCase().includes(searchTermLower) ||
      (quotation.guests?.email || '').toLowerCase().includes(searchTermLower) ||
      quotation.number.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quotations</h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search quotations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          </div>
          <Button onClick={() => { setShowForm(true); setIsEditing(false); }}>
            <Plus className="w-4 h-4 mr-2" /> New Quotation
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : quotations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No quotations found. Create your first quotation by clicking the "New Quotation" button above.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuotations.map((quotation) => (
                <tr key={quotation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {quotation.guests?.first_name || 'N/A'} {quotation.guests?.last_name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">{quotation.guests?.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(quotation.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(quotation.valid_until)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatAmount(quotation.amount || 0)}</div>
                    <div className="text-xs text-gray-500">
                      Subtotal: {formatAmount(quotation.subtotal || 0)}
                      <br />
                      VAT/Levy: {formatAmount(quotation.tax || 0)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      quotation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      quotation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(quotation)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Edit quotation"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(quotation)}
                      className="text-green-600 hover:text-green-900 mr-3"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(quotation.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete quotation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isEditing ? 'Edit Quotation' : 'New Quotation'}
              </h2>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Guest ID</label>
                <input
                  type="text"
                  value={formData.guestId}
                  onChange={(e) => setFormData({ ...formData, guestId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Valid Until</label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <select
                      value={item.description}
                      onChange={(e) => {
                        const selectedRoom = rooms.find(r => r.room_number === e.target.value);
                        handleItemChange(index, 'description', e.target.value);
                        if (selectedRoom) {
                          handleItemChange(index, 'unit_price', selectedRoom.price_per_night);
                        }
                      }}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a room</option>
                      {rooms.map((room) => (
                        <option key={room.id} value={room.room_number}>
                          Room {room.room_number} - {room.room_type} - {formatAmount(room.price_per_night)}/night
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Nights"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                      className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      min="1"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price/Night"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value))}
                      className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                      required
                      disabled
                    />
                    {formData.items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddItem}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="space-y-2">
                  <div className="text-md">Subtotal: {formatAmount(calculateSubtotal(formData.items))}</div>
                  <div className="text-md">VAT/Levy (14%): {formatAmount(calculateTax(calculateSubtotal(formData.items)))}</div>
                  <div className="text-lg font-semibold">Total: {formatAmount(calculateTotal({ items: formData.items }))}</div>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" type="button" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Save Quotation
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
