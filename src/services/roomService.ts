import { supabase } from '../lib/supabase';
import type { Room } from '../types';

export const roomService = {
  async getAllRooms(): Promise<Room[]> {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('room_number');
    
    if (error) throw error;
    return data;
  },

  async getAvailableRooms(): Promise<Room[]> {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('status', 'available')
      .order('room_number');
    
    if (error) throw error;
    return data;
  },

  async getRoomById(id: string): Promise<Room | null> {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createRoom(room: Omit<Room, 'id'>): Promise<Room> {
    const { data, error } = await supabase
      .from('rooms')
      .insert([room])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateRoom(id: string, room: Partial<Room>): Promise<Room> {
    const { data, error } = await supabase
      .from('rooms')
      .update(room)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateRoomStatus(id: string, status: Room['status']): Promise<void> {
    const { error } = await supabase
      .from('rooms')
      .update({ status })
      .eq('id', id);
    
    if (error) throw error;
  },

  async deleteRoom(id: string): Promise<void> {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};