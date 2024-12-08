export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type RoomType = 'single' | 'double' | 'suite' | 'deluxe'
export type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance'
export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded'
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'mobile_money'
export type TaskStatus = 'pending' | 'in_progress' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'
export type StaffShift = 'morning' | 'afternoon' | 'night'
export type StaffStatus = 'available' | 'busy' | 'off_duty'
export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected'

export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string
          room_number: string
          room_type: RoomType
          status: RoomStatus
          floor_number: number
          price_per_night: number
          capacity: number
          amenities: Json
          description: string | null
          images: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['rooms']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['rooms']['Insert']>
      }
      guests: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          id_type: string | null
          id_number: string | null
          address: string | null
          nationality: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['guests']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['guests']['Insert']>
      }
      bookings: {
        Row: {
          id: string
          room_id: string
          guest_id: string
          check_in: string
          check_out: string
          status: BookingStatus
          number_of_guests: number
          total_amount: number
          special_requests: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
      }
      staff: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          role: string
          shift: StaffShift
          status: StaffStatus
          assigned_rooms: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['staff']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['staff']['Insert']>
      }
      cleaning_tasks: {
        Row: {
          id: string
          room_id: string
          assigned_to: string
          status: TaskStatus
          priority: TaskPriority
          scheduled_for: string
          completed_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['cleaning_tasks']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['cleaning_tasks']['Insert']>
      }
      inventory: {
        Row: {
          id: string
          name: string
          category: string | null
          quantity: number
          unit: string
          reorder_point: number
          cost_per_unit: number | null
          supplier: string | null
          last_restocked: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['inventory']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['inventory']['Insert']>
      }
      inventory_transactions: {
        Row: {
          id: string
          inventory_id: string
          transaction_type: string
          quantity: number
          reason: string | null
          performed_by: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['inventory_transactions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['inventory_transactions']['Insert']>
      }
      payments: {
        Row: {
          id: string
          booking_id: string
          amount: number
          payment_method: PaymentMethod
          status: PaymentStatus
          transaction_id: string | null
          payment_date: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['payments']['Insert']>
      }
      expenses: {
        Row: {
          id: string
          category: string
          amount: number
          description: string | null
          date: string
          approved_by: string
          receipt_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['expenses']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['expenses']['Insert']>
      }
      quotations: {
        Row: {
          id: string
          guest_id: string
          room_id: string
          check_in: string
          check_out: string
          number_of_guests: number
          amount: number
          status: QuotationStatus
          valid_until: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['quotations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['quotations']['Insert']>
      }
      settings: {
        Row: {
          id: string
          category: string
          name: string
          value: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['settings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['settings']['Insert']>
      }
    }
  }
}