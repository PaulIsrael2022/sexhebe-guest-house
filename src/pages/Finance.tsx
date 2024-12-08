import React, { useState, useEffect } from 'react';
import { Plus, FileText, DollarSign, TrendingUp } from 'lucide-react';
import type { Invoice, Expense, FinancialReport } from '../types';
import { invoiceService } from '../services/invoiceService';
import { expenseService } from '../services/expenseService';
import { financialService } from '../services/financialService';
import { InvoiceList } from '../components/finance/InvoiceList';
import { ExpenseList } from '../components/finance/ExpenseList';
import { InvoiceForm } from '../components/finance/InvoiceForm';
import { ExpenseForm } from '../components/finance/ExpenseForm';
import { FinancialStats } from '../components/finance/FinancialStats';

export function Finance() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'expenses' | 'reports'>('invoices');
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [invoicesData, expensesData] = await Promise.all([
        invoiceService.getAllInvoices(),
        expenseService.getAllExpenses()
      ]);
      
      setInvoices(invoicesData);
      setExpenses(expensesData);

      // Generate report for current month
      const startDate = new Date();
      startDate.setDate(1);
      const endDate = new Date();
      
      const reportData = await financialService.generateReport(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      setReport(reportData);
    } catch (error) {
      console.error('Failed to load financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Finance</h1>
        <div className="flex space-x-3">
          {activeTab === 'invoices' && (
            <button
              onClick={() => setShowInvoiceForm(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              <span>New Invoice</span>
            </button>
          )}
          {activeTab === 'expenses' && (
            <button
              onClick={() => setShowExpenseForm(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              <span>New Expense</span>
            </button>
          )}
        </div>
      </div>

      {report && <FinancialStats report={report} />}

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('invoices')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'invoices'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Invoices</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('expenses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'expenses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Expenses</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Reports</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'invoices' && (
              <InvoiceList
                invoices={invoices}
                onInvoiceUpdate={loadData}
              />
            )}
            {activeTab === 'expenses' && (
              <ExpenseList
                expenses={expenses}
                onExpenseUpdate={loadData}
              />
            )}
            {activeTab === 'reports' && (
              <div className="p-6">
                {/* TODO: Add detailed reports and charts */}
                <p className="text-gray-500">Detailed reports coming soon...</p>
              </div>
            )}
          </>
        )}
      </div>

      {showInvoiceForm && (
        <InvoiceForm
          onClose={() => setShowInvoiceForm(false)}
          onSave={() => {
            loadData();
            setShowInvoiceForm(false);
          }}
        />
      )}

      {showExpenseForm && (
        <ExpenseForm
          onClose={() => setShowExpenseForm(false)}
          onSave={() => {
            loadData();
            setShowExpenseForm(false);
          }}
        />
      )}
    </div>
  );
}