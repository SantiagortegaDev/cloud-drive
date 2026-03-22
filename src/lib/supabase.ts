import { createClient } from '@supabase/supabase-js'

// Use VITE_ prefix for client-side Vite apps, with fallback to NEXT_PUBLIC_ for flexibility
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface DbFolder {
  id: string
  name: string
  parent_id: string | null
  created_at: string
}

export interface DbFile {
  id: string
  name: string
  url: string
  folder_id: string | null
  size_bytes: number
  file_type: string
  icon: string
  created_at: string
}

export interface ActivityLog {
  id: string
  action: string
  item_type: string
  item_name: string
  details: string | null
  created_at: string
}

export async function logActivity(action: string, itemType: string, itemName: string, details?: string) {
  await supabase.from('activity_logs').insert({
    action,
    item_type: itemType,
    item_name: itemName,
    details: details || null
  })
}
