import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { toast } from '../components/ui/toast';
import { settingsService, HotelSettings } from '../services/settingsService';
import { Save } from 'lucide-react';

export function Settings() {
  const [settings, setSettings] = useState<HotelSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      await settingsService.initializeSettings();
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData(e.currentTarget);
      const updatedSettings: Partial<HotelSettings> = {
        hotel_name: formData.get('hotel_name') as string,
        currency: formData.get('currency') as string,
        check_in_time: formData.get('check_in_time') as string,
        check_out_time: formData.get('check_out_time') as string,
        contact_email: formData.get('contact_email') as string,
        contact_phone: formData.get('contact_phone') as string,
        address: formData.get('address') as string,
        tax_rate: Number(formData.get('tax_rate')),
        tax_type: formData.get('tax_type') as string,
        tax_name: formData.get('tax_name') as string,
        booking_terms: formData.get('booking_terms') as string,
        cancellation_policy: formData.get('cancellation_policy') as string,
      };

      const updated = await settingsService.updateSettings(updatedSettings);
      setSettings(updated);
      toast({
        title: 'Success',
        description: 'Settings updated successfully',
      });
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-4">Hotel Settings</h1>
        <p className="text-gray-600">
          Configure your hotel's general settings, policies, and contact information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">General Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Hotel Name</label>
              <input
                type="text"
                name="hotel_name"
                defaultValue={settings?.hotel_name}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <select
                name="currency"
                defaultValue={settings?.currency}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="BWP">BWP - Botswana Pula</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="ZAR">ZAR - South African Rand</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Check-in Time</label>
              <input
                type="time"
                name="check_in_time"
                defaultValue={settings?.check_in_time}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Check-out Time</label>
              <input
                type="time"
                name="check_out_time"
                defaultValue={settings?.check_out_time}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tax Configuration</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <select
                    name="tax_type"
                    defaultValue={settings?.tax_type}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="tax_rate"
                    defaultValue={settings?.tax_rate}
                    required
                    min="0"
                    max={settings?.tax_type === 'percentage' ? "100" : undefined}
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="mt-2">{settings?.tax_type === 'percentage' ? '%' : settings?.currency}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tax Label</label>
              <input
                type="text"
                name="tax_name"
                defaultValue={settings?.tax_name}
                required
                placeholder="e.g., VAT/Levy, Service Fee, etc."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="contact_email"
                defaultValue={settings?.contact_email}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="contact_phone"
                defaultValue={settings?.contact_phone}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                defaultValue={settings?.address}
                required
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">Policies</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Booking Terms</label>
              <textarea
                name="booking_terms"
                defaultValue={settings?.booking_terms}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cancellation Policy</label>
              <textarea
                name="cancellation_policy"
                defaultValue={settings?.cancellation_policy}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}