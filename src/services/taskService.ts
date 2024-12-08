import { supabase } from '../lib/supabase';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  assigned_to: string;
  category: 'maintenance' | 'housekeeping' | 'front_desk' | 'general';
  created_at?: string;
  updated_at?: string;
}

class TaskService {
  async getAllTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getTasksByCategory(category: Task['category']): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update(task)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async searchTasks(query: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getTaskStats(): Promise<{
    total: number;
    completed: number;
    pending: number;
    in_progress: number;
  }> {
    const { data, error } = await supabase
      .from('tasks')
      .select('status');

    if (error) throw error;

    const stats = {
      total: data.length,
      completed: data.filter(task => task.status === 'completed').length,
      pending: data.filter(task => task.status === 'pending').length,
      in_progress: data.filter(task => task.status === 'in_progress').length,
    };

    return stats;
  }
}

export const taskService = new TaskService();
