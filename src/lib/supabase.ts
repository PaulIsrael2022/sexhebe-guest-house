import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Initialize Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

interface CacheItem<T> {
  data: T
  timestamp: number
}

class QueryCache {
  private cache = new Map<string, CacheItem<any>>()

  set<T>(key: string, data: T) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    const isExpired = Date.now() - item.timestamp > CACHE_DURATION
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  clear() {
    this.cache.clear()
  }
}

const queryCache = new QueryCache()

// Error handling wrapper
async function withErrorHandling<T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  retries = MAX_RETRIES
): Promise<{ data: T | null; error: any }> {
  let lastError: any = null
  
  for (let i = 0; i < retries; i++) {
    try {
      const result = await operation()
      if (!result.error) return result
      lastError = result.error
    } catch (error) {
      lastError = error
    }

    if (i < retries - 1) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (i + 1)))
    }
  }

  return { data: null, error: lastError }
}

// Type-safe database helpers
export const db = {
  rooms: {
    async getAll() {
      const cacheKey = 'rooms:all'
      const cached = queryCache.get<any[]>(cacheKey)
      if (cached) return { data: cached, error: null }

      const result = await withErrorHandling(() =>
        supabase.from('rooms').select('*').order('room_number')
      )

      if (result.data) {
        queryCache.set(cacheKey, result.data)
      }

      return result
    },

    async getById(id: string) {
      const cacheKey = `rooms:${id}`
      const cached = queryCache.get<any>(cacheKey)
      if (cached) return { data: cached, error: null }

      const result = await withErrorHandling(() =>
        supabase.from('rooms').select('*').eq('id', id).single()
      )

      if (result.data) {
        queryCache.set(cacheKey, result.data)
      }

      return result
    },

    async create(data: any) {
      const result = await withErrorHandling(() =>
        supabase.from('rooms').insert([data]).select().single()
      )
      
      if (result.data) {
        queryCache.clear() // Clear cache when data changes
      }

      return result
    },

    async update(id: string, data: any) {
      const result = await withErrorHandling(() =>
        supabase.from('rooms').update(data).eq('id', id).select().single()
      )

      if (result.data) {
        queryCache.clear() // Clear cache when data changes
      }

      return result
    },

    async delete(id: string) {
      const result = await withErrorHandling(() =>
        supabase.from('rooms').delete().eq('id', id)
      )

      if (!result.error) {
        queryCache.clear() // Clear cache when data changes
      }

      return result
    },
  },
}