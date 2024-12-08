import { supabase } from '../lib/supabase';
import type { Guest } from '../types';

const GUEST_SELECT = 'id, first_name, last_name, email, phone, id_number, address, created_at, updated_at';

export const guestService = {
  async createGuest(guest: Omit<Guest, 'id' | 'created_at' | 'updated_at'>): Promise<Guest> {
    try {
      const { data, error } = await supabase
        .from('guests')
        .insert([{
          first_name: guest.first_name,
          last_name: guest.last_name,
          email: guest.email,
          phone: guest.phone,
          id_number: guest.id_number,
          address: guest.address || ''
        }])
        .select(GUEST_SELECT)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create guest:', error);
      throw error;
    }
  },

  async updateGuest(id: string, guest: Partial<Guest>): Promise<Guest> {
    try {
      const updateData: Partial<Guest> = {};
      if (guest.first_name) updateData.first_name = guest.first_name;
      if (guest.last_name) updateData.last_name = guest.last_name;
      if (guest.email) updateData.email = guest.email;
      if (guest.phone) updateData.phone = guest.phone;
      if (guest.id_number) updateData.id_number = guest.id_number;
      if (guest.address) updateData.address = guest.address;

      const { data, error } = await supabase
        .from('guests')
        .update(updateData)
        .eq('id', id)
        .select(GUEST_SELECT)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update guest:', error);
      throw error;
    }
  },

  async deleteGuest(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete guest:', error);
      throw error;
    }
  },

  async getGuestById(id: string): Promise<Guest | null> {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select(GUEST_SELECT)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get guest by id:', error);
      throw error;
    }
  },

  async getGuestByEmail(email: string): Promise<Guest | null> {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select(GUEST_SELECT)
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Failed to get guest by email:', error);
      throw error;
    }
  },

  async getAllGuests(): Promise<Guest[]> {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select(GUEST_SELECT)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get all guests:', error);
      throw error;
    }
  },

  async searchGuests(query: string): Promise<Guest[]> {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select(GUEST_SELECT)
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%,id_number.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to search guests:', error);
      throw error;
    }
  }
};