import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Bookings } from './pages/Bookings';
import { Guests } from './pages/Guests';
import { Rooms } from './pages/Rooms';
import { Finance } from './pages/Finance';
import { Quotations } from './pages/Quotations';
import { Reports } from './pages/Reports';
import { Housekeeping } from './pages/Housekeeping';
import { Settings } from './pages/Settings';
import { Tasks } from './pages/Tasks';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer, ToastViewport } from './components/ui/toast';

export default function App() {
  return (
    <ErrorBoundary>
      <ToastContainer>
        <div className="min-h-screen bg-gray-100">
          <Layout>
            <main className="flex-1 p-6">
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="guests" element={<Guests />} />
                <Route path="rooms" element={<Rooms />} />
                <Route path="finance" element={<Finance />} />
                <Route path="quotations" element={<Quotations />} />
                <Route path="reports" element={<Reports />} />
                <Route path="housekeeping" element={<Housekeeping />} />
                <Route path="settings" element={<Settings />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </main>
          </Layout>
        </div>
      <ToastViewport />
      </ToastContainer>
    </ErrorBoundary>
  );
}