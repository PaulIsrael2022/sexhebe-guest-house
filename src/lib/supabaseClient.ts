import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const supabaseUrl = 'https://bnyzhktxomzyfldntgps.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJueXpoa3R4b216eWZsZG50Z3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0NjI3NDIsImV4cCI6MjA0OTAzODc0Mn0.wq5widzIJUMKtheKcllVwzb-f6xoqnoy3TMGPIyszko'

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    }
  }
)
