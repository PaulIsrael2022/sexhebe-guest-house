import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { Invoice, InvoiceItem } from '../../types';
import { invoiceService } from '../../services/invoiceService';

interface InvoiceFormProps {
  invoice?: Invoice;
  onClose: () => void;
  onSave: () => void;
}

export function InvoiceForm({ invoice, onClose, onSave }: InvoiceFormProps) {
  const [formData, setFormData] = useState<Partial<Invoice>>({
    bookingId: invoice?.bookingId || '',
    guestId: invoice?.guestId || '',
    date: invoice?.date || new Date().toISOString().split('T')[0],
    dueDate: invoice?.dueDate || '',
    items: invoice?.items || [],
    subtotal: invoice?.subtotal || 0,
    tax: invoice?.tax || 0,
    total: invoice?.total || 0,
    status: invoice?.status || 'draft'
  });

  const [newItem, setNewItem] = useState<Partial<InvoiceItem>>({
    description: '',
    quantity: 1,
    unitPrice: 0,
    total: 0
  });

  const handleAddItem = () => {
    if (newItem.description && newItem.quantity && newItem.unitPrice) {
      const total = newItem.quantity * newItem.unitPrice;
      const item: InvoiceItem = {
        description: newItem.description,
        quantity: newItem.quantity,
        unitPrice: newItem.unitPrice,
        total
      };

      setFormData(prev => {
        const items = [...(prev.items || []), item];
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const tax = subtotal * 0.1; // 10% tax
        return {
          ...prev,
          items,
          subtotal,
          tax,
          total: subtotal + tax
        };
      });

      setNewItem({
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => {
      const items = prev.items?.filter((_, i) => i !== index) || [];
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.1; // 10% tax
      return {
        ...prev,
        items,
        subtotal,
        tax,
        total: subtotal + tax
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (invoice?.id) {
        await invoiceService.updateInvoice(invoice.id, formData);
      } else {
        await invoiceService.createInvoice(formData as Omit<Invoice, 'id'>);
      }
      onSave();
    } catch (error) {
      console.error('Failed to save invoice:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {invoice ? 'Edit Invoice' : 'New Invoice'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Booking ID
              </label>
              <input
                type="text"
                value={formData.bookingId}
                onChange={(e) => setFormData(prev => ({ ...prev, bookingId: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Guest ID
              </label>
              <input
                type="text"
                value={formData.guestId}
                onChange={(e) => setFormData(prev => ({ ...prev, guestId: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5">
                  <input
                    type="text"
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="1"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="Unit Price"
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-span-2">
                  <div className="text-gray-700 py-2">
                    ${((newItem.quantity || 0) * (newItem.unitPrice || 0)).toFixed(2)}
                  </div>
                </div>
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="w-full h-full flex items-center justify-center bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="border rounded-lg divide-y">
              {formData.items?.map((item, index) => (
                <div key={index} className="p-4 grid grid-cols-12 gap-4">
                  <div className="col-span-5">{item.description}</div>
                  <div className="col-span-2">{item.quantity}</div>
                  <div className="col-span-2">${item.unitPrice.toFixed(2)}</div>
                  <div className="col-span-2">${item.total.toFixed(2)}</div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-end">
              <div className="w-64 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">${formData.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax (10%)</span>
                  <span className="text-gray-900">${formData.tax?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-medium">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${formData.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {invoice ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
