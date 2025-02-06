export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          category: string
          subcategory: string
          type: 'file' | 'link'
          url: string
          thumbnail_url: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          category: string
          subcategory: string
          type: 'file' | 'link'
          url: string
          thumbnail_url: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          category?: string
          subcategory?: string
          type?: 'file' | 'link'
          url?: string
          thumbnail_url?: string
          user_id?: string
        }
      }
      tutorials: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          category: string
          youtube_url: string
          thumbnail_url: string
          duration: string
          views: number
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          category: string
          youtube_url: string
          thumbnail_url: string
          duration: string
          views?: number
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          category?: string
          youtube_url?: string
          thumbnail_url?: string
          duration?: string
          views?: number
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 