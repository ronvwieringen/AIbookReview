import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are missing. Please set the environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for database tables
export type User = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'Author' | 'Reader' | 'ServiceProvider' | 'PublisherAdmin' | 'PlatformAdmin';
  profile_picture_url?: string;
  bio?: string;
  preferred_language?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type Author = {
  id: string;
  website_url?: string;
  social_media_links?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  author_pseudonym?: string;
};

export type Book = {
  id: string;
  title: string;
  author_id: string;
  publisher_id?: string;
  genre_id?: number;
  language_id?: number;
  status: 'Draft' | 'SubmittedForAIReview' | 'AIReviewInProgress' | 'AIReviewCompleted' | 'Published' | 'Unpublished' | 'Rejected' | 'AnonymousProcessing';
  cover_image_url?: string;
  blurb?: string;
  isbn?: string;
  publication_date?: string;
  page_count?: number;
  target_audience?: string;
  manuscript_url?: string;
  average_reader_rating: number;
  reader_review_count: number;
  plagiarism_score?: number;
  has_author_responded_to_ai_review: boolean;
  submitted_for_ai_review_at?: string;
  ai_review_completed_at?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
};

export type AIReview = {
  id: string;
  book_id: string;
  review_date: string;
  processing_status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  error_message?: string;
  ai_model_version?: string;
  full_blurb?: string;
  promotional_blurb?: string;
  single_line_summary?: string;
  detailed_summary?: string;
  review_summary?: string;
  full_review_content?: string;
  author_response?: string;
  service_needs?: Array<{
    category: string;
    suggestion: string;
  }>;
  plagiarism_details?: {
    score: number;
    matches: Array<{
      source: string;
      similarity: string;
    }>;
  };
  created_at: string;
  updated_at: string;
};

export type ReaderReview = {
  id: string;
  book_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  review_date: string;
  verified_purchase: boolean;
  helpful_count: number;
  not_helpful_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};