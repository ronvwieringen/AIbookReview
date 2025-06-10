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
          profile_picture_url: string | null
          bio: string | null
          website_url: string | null
          social_media_links: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'reader' | 'author' | 'admin'
          profile_picture_url?: string | null
          bio?: string | null
          website_url?: string | null
          social_media_links?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'reader' | 'author' | 'admin'
          profile_picture_url?: string | null
          bio?: string | null
          website_url?: string | null
          social_media_links?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_sso_integrations: {
        Row: {
          id: string
          user_id: string
          provider: 'google' | 'microsoft'
          provider_user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider: 'google' | 'microsoft'
          provider_user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider?: 'google' | 'microsoft'
          provider_user_id?: string
          created_at?: string
        }
      }
      genres: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
      }
      keywords: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
      }
      books: {
        Row: {
          id: string
          author_id: string
          genre_id: number | null
          title: string
          language: string
          book_type: string | null
          cover_image_url: string | null
          visibility: 'private' | 'public'
          publication_date: string | null
          description: string | null
          publisher: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          genre_id?: number | null
          title: string
          language?: string
          book_type?: string | null
          cover_image_url?: string | null
          visibility?: 'private' | 'public'
          publication_date?: string | null
          description?: string | null
          publisher?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          genre_id?: number | null
          title?: string
          language?: string
          book_type?: string | null
          cover_image_url?: string | null
          visibility?: 'private' | 'public'
          publication_date?: string | null
          description?: string | null
          publisher?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      book_keywords: {
        Row: {
          book_id: string
          keyword_id: number
        }
        Insert: {
          book_id: string
          keyword_id: number
        }
        Update: {
          book_id?: string
          keyword_id?: number
        }
      }
      book_purchase_links: {
        Row: {
          id: string
          book_id: string
          platform_name: string
          url: string
          created_at: string
        }
        Insert: {
          id?: string
          book_id: string
          platform_name: string
          url: string
          created_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          platform_name?: string
          url?: string
          created_at?: string
        }
      }
      ai_reviews: {
        Row: {
          id: string
          book_id: string
          prompt_version_id: number | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          ai_quality_score: number | null
          plot_score: number | null
          character_score: number | null
          writing_style_score: number | null
          pacing_score: number | null
          world_building_score: number | null
          summary_single_line: string | null
          summary_100_word: string | null
          promotional_blurb: string | null
          ai_analysis: Json
          author_response: string | null
          view_count: number
          click_count: number
          review_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          book_id: string
          prompt_version_id?: number | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          ai_quality_score?: number | null
          plot_score?: number | null
          character_score?: number | null
          writing_style_score?: number | null
          pacing_score?: number | null
          world_building_score?: number | null
          summary_single_line?: string | null
          summary_100_word?: string | null
          promotional_blurb?: string | null
          ai_analysis?: Json
          author_response?: string | null
          view_count?: number
          click_count?: number
          review_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          prompt_version_id?: number | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          ai_quality_score?: number | null
          plot_score?: number | null
          character_score?: number | null
          writing_style_score?: number | null
          pacing_score?: number | null
          world_building_score?: number | null
          summary_single_line?: string | null
          summary_100_word?: string | null
          promotional_blurb?: string | null
          ai_analysis?: Json
          author_response?: string | null
          view_count?: number
          click_count?: number
          review_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      author_process_checklists: {
        Row: {
          id: string
          book_id: string
          professional_services_used: Json
          ai_tools_used: Json
          updated_at: string
        }
        Insert: {
          id?: string
          book_id: string
          professional_services_used?: Json
          ai_tools_used?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          professional_services_used?: Json
          ai_tools_used?: Json
          updated_at?: string
        }
      }
      reader_reviews: {
        Row: {
          id: string
          book_id: string
          user_id: string
          rating: number
          comment: string | null
          is_visible: boolean
          review_date: string
        }
        Insert: {
          id?: string
          book_id: string
          user_id: string
          rating: number
          comment?: string | null
          is_visible?: boolean
          review_date?: string
        }
        Update: {
          id?: string
          book_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          is_visible?: boolean
          review_date?: string
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
          id: number
          prompt_name: string
          prompt_type: 'metadata_extraction' | 'fiction_review' | 'nonfiction_review' | 'summarization'
          prompt_text: string
          version: number
          is_active: boolean
          updated_at: string
        }
        Insert: {
          id?: number
          prompt_name: string
          prompt_type: 'metadata_extraction' | 'fiction_review' | 'nonfiction_review' | 'summarization'
          prompt_text: string
          version?: number
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          id?: number
          prompt_name?: string
          prompt_type?: 'metadata_extraction' | 'fiction_review' | 'nonfiction_review' | 'summarization'
          prompt_text?: string
          version?: number
          is_active?: boolean
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
      book_visibility: 'private' | 'public'
      review_status: 'pending' | 'processing' | 'completed' | 'failed'
      llm_status: 'active' | 'standby' | 'inactive'
      llm_type: 'primary' | 'backup' | 'metadata'
      prompt_type: 'metadata_extraction' | 'fiction_review' | 'nonfiction_review' | 'summarization'
      sso_provider: 'google' | 'microsoft'
    }
  }
}