import { supabase } from '../lib/supabase';

export interface HotelSettings {
  id: string;
  hotel_name: string;
  currency: string;
  check_in_time: string;
  check_out_time: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  tax_rate: number;
  tax_type: 'percentage' | 'fixed';
  tax_name: string;
  booking_terms: string;
  cancellation_policy: string;
  created_at?: string;
  updated_at?: string;
}

class SettingsService {
  async getSettings(): Promise<HotelSettings> {
    const { data, error } = await supabase
      .from('hotel_settings')
      .select('*')
      .single();

    if (error) throw error;
    return data || this.getDefaultSettings();
  }

  async updateSettings(settings: Partial<HotelSettings>): Promise<HotelSettings> {
    const { data, error } = await supabase
      .from('hotel_settings')
      .update(settings)
      .eq('id', '1')
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async calculateTax(amount: number): Promise<{ taxAmount: number; taxLabel: string }> {
    const settings = await this.getSettings();
    return {
      taxAmount: settings.tax_type === 'percentage' 
        ? (amount * settings.tax_rate / 100)
        : settings.tax_rate,
      taxLabel: settings.tax_name
    };
  }

  private getDefaultSettings(): HotelSettings {
    return {
      id: '1',
      hotel_name: 'Sexhebe Guest House',
      currency: 'BWP',
      check_in_time: '14:00',
      check_out_time: '11:00',
      contact_email: '',
      contact_phone: '',
      address: '',
      tax_rate: 14,
      tax_type: 'percentage',
      tax_name: 'VAT/Levy',
      booking_terms: '',
      cancellation_policy: '',
    };
  }

  async initializeSettings(): Promise<void> {
    const { data, error } = await supabase
      .from('hotel_settings')
      .select('id')
      .single();

    if (!data) {
      const defaultSettings = this.getDefaultSettings();
      await supabase
        .from('hotel_settings')
        .insert([defaultSettings]);
    }
  }
}

export const settingsService = new SettingsService();
