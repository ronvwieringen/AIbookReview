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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'reader' | 'author' | 'admin'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'reader' | 'author' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'reader' | 'author' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      books: {
        Row: {
          id: string
          title: string
          author_id: string
          author_name: string
          genre: string
          language: string
          description: string | null
          keywords: string[]
          publisher: string | null
          cover_url: string | null
          buy_links: Json
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author_id: string
          author_name: string
          genre: string
          language: string
          description?: string | null
          keywords?: string[]
          publisher?: string | null
          cover_url?: string | null
          buy_links?: Json
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author_id?: string
          author_name?: string
          genre?: string
          language?: string
          description?: string | null
          keywords?: string[]
          publisher?: string | null
          cover_url?: string | null
          buy_links?: Json
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          book_id: string
          ai_score: number
          ai_analysis: Json
          author_response: string | null
          status: 'processing' | 'completed' | 'failed'
          view_count: number
          click_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          book_id: string
          ai_score?: number
          ai_analysis?: Json
          author_response?: string | null
          status?: 'processing' | 'completed' | 'failed'
          view_count?: number
          click_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          ai_score?: number
          ai_analysis?: Json
          author_response?: string | null
          status?: 'processing' | 'completed' | 'failed'
          view_count?: number
          click_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      llm_configs: {
        Row: {
          id: string
          name: string
          type: 'primary' | 'backup' | 'metadata'
          url: string
          model: string
          api_key: string
          status: 'active' | 'standby' | 'inactive'
          last_tested: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'primary' | 'backup' | 'metadata'
          url: string
          model: string
          api_key: string
          status?: 'active' | 'standby' | 'inactive'
          last_tested?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'primary' | 'backup' | 'metadata'
          url?: string
          model?: string
          api_key?: string
          status?: 'active' | 'standby' | 'inactive'
          last_tested?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      prompts: {
        Row: {
          id: string
          name: string
          type: 'metadata' | 'fiction' | 'nonfiction'
          content: string
          version: number
          previous_version: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'metadata' | 'fiction' | 'nonfiction'
          content: string
          version?: number
          previous_version?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'metadata' | 'fiction' | 'nonfiction'
          content?: string
          version?: number
          previous_version?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reading_lists: {
        Row: {
          id: string
          user_id: string
          book_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          created_at?: string
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
      user_role: 'reader' | 'author' | 'admin'
      book_status: 'draft' | 'published' | 'archived'
      review_status: 'processing' | 'completed' | 'failed'
      llm_status: 'active' | 'standby' | 'inactive'
    }
  }
}