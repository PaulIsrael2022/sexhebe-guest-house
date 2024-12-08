import React from 'react';
import { Edit2, Trash2, Download } from 'lucide-react';
import type { Invoice } from '../../types';
import { invoiceService } from '../../services/invoiceService';

interface InvoiceListProps {
  invoices: Invoice[];
  onInvoiceUpdate: () => void;
}

export function InvoiceList({ invoices, onInvoiceUpdate }: InvoiceListProps) {
  const handleDeleteInvoice = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoiceService.deleteInvoice(id);
        onInvoiceUpdate();
      } catch (error) {
        console.error('Failed to delete invoice:', error);
      }
    }
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // TODO: Implement invoice PDF generation and download
    console.log('Download invoice:', invoice);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                INV-{invoice.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(invoice.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {invoice.guestId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${invoice.total.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  invoice.status === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : invoice.status === 'overdue'
                    ? 'bg-red-100 text-red-800'
                    : invoice.status === 'draft'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {invoice.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleDownloadInvoice(invoice)}
                  className="text-gray-600 hover:text-gray-900 mr-4"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {/* TODO: Implement edit */}}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteInvoice(invoice.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
