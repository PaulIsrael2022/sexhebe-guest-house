import { supabase } from '../lib/supabase';

export interface CleaningTask {
  id: string;
  name: string;
  assignedStaff: string[];
  status: 'pending' | 'in_progress' | 'completed';
  created_at?: string;
  updated_at?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  reorder_point: number;
  created_at?: string;
  updated_at?: string;
}

export interface StaffMember {
  id: string;
  first_name: string;
  last_name: string;
  shift: 'morning' | 'afternoon' | 'night';
  status: 'available' | 'busy' | 'off_duty';
  assigned_rooms: string[];
  created_at?: string;
  updated_at?: string;
}

class HousekeepingService {
  async getAllTasks(): Promise<CleaningTask[]> {
    const { data, error } = await supabase
      .from('cleaning_tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createTask(task: Omit<CleaningTask, 'id'>): Promise<CleaningTask> {
    const { data, error } = await supabase
      .from('cleaning_tasks')
      .insert([task])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTask(id: string, task: Partial<CleaningTask>): Promise<CleaningTask> {
    const { data, error } = await supabase
      .from('cleaning_tasks')
      .update(task)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('cleaning_tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getAllInventory(): Promise<InventoryItem[]> {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createInventoryItem(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
    const { data, error } = await supabase
      .from('inventory')
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateInventoryItem(id: string, item: Partial<InventoryItem>): Promise<InventoryItem> {
    const { data, error } = await supabase
      .from('inventory')
      .update(item)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteInventoryItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getAllStaff(): Promise<StaffMember[]> {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createStaffMember(member: Omit<StaffMember, 'id'>): Promise<StaffMember> {
    const { data, error } = await supabase
      .from('staff')
      .insert([member])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateStaffMember(id: string, member: Partial<StaffMember>): Promise<StaffMember> {
    const { data, error } = await supabase
      .from('staff')
      .update(member)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteStaffMember(id: string): Promise<void> {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export const housekeepingService = new HousekeepingService();
