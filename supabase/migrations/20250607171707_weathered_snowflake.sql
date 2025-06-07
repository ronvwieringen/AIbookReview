/*
  # Initial Database Schema

  1. New Tables
    - `users` - User accounts with roles
    - `authors` - Author-specific profile information
    - `service_providers` - Service provider-specific profile information
    - `publishers` - Publishing companies
    - `genres` - Book genres
    - `languages` - Supported languages
    - `books` - Book information
    - `keywords` - Keywords/tags for books
    - `book_keywords` - Junction table for books and keywords
    - `ai_reviews` - AI-generated reviews
    - `author_process_checklists` - Author's process transparency
    - `book_purchase_links` - Where to buy books
    - `reader_reviews` - User-generated reviews
    - `services` - Services offered by providers
    - `service_provider_reviews` - Reviews of service providers
    - `user_follows` - User follow relationships
    - `reading_lists` - User reading lists
    - `reading_list_items` - Books in reading lists
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('Author', 'Reader', 'ServiceProvider', 'PublisherAdmin', 'PlatformAdmin')),
  profile_picture_url TEXT,
  bio TEXT,
  preferred_language TEXT DEFAULT 'en',
  stripe_customer_id TEXT UNIQUE,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Authors table
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  website_url TEXT,
  social_media_links JSONB DEFAULT '{}',
  author_pseudonym TEXT
);

-- Service Providers table
CREATE TABLE IF NOT EXISTS service_providers (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT,
  website_url TEXT,
  service_categories JSONB DEFAULT '[]',
  portfolio_url TEXT,
  years_of_experience INTEGER,
  verification_status TEXT DEFAULT 'Unverified' CHECK (verification_status IN ('Unverified', 'PendingVerification', 'Verified', 'Rejected')),
  verification_documents JSONB DEFAULT '[]'
);

-- Publishers table
CREATE TABLE IF NOT EXISTS publishers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  website_url TEXT,
  contact_email TEXT,
  logo_url TEXT,
  description TEXT,
  associated_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Genres table
CREATE TABLE IF NOT EXISTS genres (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT
);

-- Languages table
CREATE TABLE IF NOT EXISTS languages (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT UNIQUE NOT NULL
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
  publisher_id UUID REFERENCES publishers(id) ON DELETE SET NULL,
  genre_id INTEGER REFERENCES genres(id) ON DELETE SET NULL,
  language_id INTEGER REFERENCES languages(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'SubmittedForAIReview', 'AIReviewInProgress', 'AIReviewCompleted', 'Published', 'Unpublished', 'Rejected', 'AnonymousProcessing')),
  cover_image_url TEXT,
  blurb TEXT,
  isbn TEXT UNIQUE,
  publication_date DATE,
  page_count INTEGER,
  target_audience TEXT,
  manuscript_url TEXT,
  average_reader_rating DECIMAL(3, 2) DEFAULT 0.00,
  reader_review_count INTEGER DEFAULT 0,
  ai_quality_score DECIMAL(3, 2),
  plagiarism_score DECIMAL(5, 2),
  has_author_responded_to_ai_review BOOLEAN DEFAULT FALSE,
  submitted_for_ai_review_at TIMESTAMP WITH TIME ZONE,
  ai_review_completed_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Keywords table
CREATE TABLE IF NOT EXISTS keywords (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

-- Book Keywords junction table
CREATE TABLE IF NOT EXISTS book_keywords (
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  keyword_id INTEGER REFERENCES keywords(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, keyword_id)
);

-- AI Reviews table
CREATE TABLE IF NOT EXISTS ai_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  review_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  processing_status TEXT DEFAULT 'Pending' CHECK (processing_status IN ('Pending', 'Processing', 'Completed', 'Failed')),
  error_message TEXT,
  ai_model_version TEXT,
  full_blurb TEXT,
  promotional_blurb TEXT,
  single_line_summary TEXT,
  detailed_summary TEXT,
  review_summary TEXT,
  full_review_content TEXT,
  author_response TEXT,
  service_needs JSONB DEFAULT '[]',
  plagiarism_details JSONB DEFAULT '{}',
  ai_fiction_analysis JSONB DEFAULT '{}',
  ai_non_fiction_analysis JSONB DEFAULT '{}',
  ai_hybrid_analysis JSONB DEFAULT '{}',
  sentiment_analysis JSONB DEFAULT '{}',
  readability_scores JSONB DEFAULT '{}',
  strengths JSONB DEFAULT '[]',
  weaknesses JSONB DEFAULT '[]',
  suggestions_for_improvement JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Author Process Checklists table
CREATE TABLE IF NOT EXISTS author_process_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  professional_services_used JSONB DEFAULT '[]',
  ai_tools_used JSONB DEFAULT '[]',
  author_declaration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Book Purchase Links table
CREATE TABLE IF NOT EXISTS book_purchase_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  platform_name TEXT NOT NULL,
  url TEXT NOT NULL,
  link_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reader Reviews table
CREATE TABLE IF NOT EXISTS reader_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating DECIMAL(2, 1) NOT NULL CHECK (rating >= 0.5 AND rating <= 5.0),
  comment TEXT,
  review_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price_range TEXT,
  turnaround_time TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Service Provider Reviews table
CREATE TABLE IF NOT EXISTS service_provider_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  reviewer_author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  rating DECIMAL(2, 1) NOT NULL CHECK (rating >= 0.5 AND rating <= 5.0),
  comment TEXT,
  review_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Follows table
CREATE TABLE IF NOT EXISTS user_follows (
  follower_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  followed_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  follow_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_user_id, followed_user_id)
);

-- Reading Lists table
CREATE TABLE IF NOT EXISTS reading_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  list_name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, list_name)
);

-- Reading List Items table
CREATE TABLE IF NOT EXISTS reading_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_list_id UUID NOT NULL REFERENCES reading_lists(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  UNIQUE (reading_list_id, book_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE author_process_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_purchase_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE reader_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_provider_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_list_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'PlatformAdmin'
    )
  );

CREATE POLICY "Admins can update all users"
  ON users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'PlatformAdmin'
    )
  );

-- Books policies
CREATE POLICY "Anyone can view published books"
  ON books FOR SELECT
  USING (status = 'Published');

CREATE POLICY "Authors can view their own books"
  ON books FOR SELECT
  USING (author_id = auth.uid());

CREATE POLICY "Authors can create their own books"
  ON books FOR INSERT
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update their own books"
  ON books FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Authors can delete their own books"
  ON books FOR DELETE
  USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all books"
  ON books FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'PlatformAdmin'
    )
  );

-- AI Reviews policies
CREATE POLICY "Anyone can view AI reviews for published books"
  ON ai_reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM books
      WHERE books.id = ai_reviews.book_id AND books.status = 'Published'
    )
  );

CREATE POLICY "Authors can view AI reviews for their own books"
  ON ai_reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM books
      WHERE books.id = ai_reviews.book_id AND books.author_id = auth.uid()
    )
  );

CREATE POLICY "Authors can update AI reviews for their own books"
  ON ai_reviews FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM books
      WHERE books.id = ai_reviews.book_id AND books.author_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all AI reviews"
  ON ai_reviews FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'PlatformAdmin'
    )
  );

-- Reader Reviews policies
CREATE POLICY "Anyone can view reader reviews"
  ON reader_reviews FOR SELECT
  USING (TRUE);

CREATE POLICY "Authenticated users can create reader reviews"
  ON reader_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reader reviews"
  ON reader_reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reader reviews"
  ON reader_reviews FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reader reviews"
  ON reader_reviews FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'PlatformAdmin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_books_author_id ON books(author_id);
CREATE INDEX IF NOT EXISTS idx_books_genre_id ON books(genre_id);
CREATE INDEX IF NOT EXISTS idx_books_language_id ON books(language_id);
CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
CREATE INDEX IF NOT EXISTS idx_ai_reviews_book_id ON ai_reviews(book_id);
CREATE INDEX IF NOT EXISTS idx_reader_reviews_book_id ON reader_reviews(book_id);
CREATE INDEX IF NOT EXISTS idx_reader_reviews_user_id ON reader_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_services_service_provider_id ON services(service_provider_id);

-- Insert initial data for genres
INSERT INTO genres (name, description) VALUES
('Fiction', 'Narrative works created from the imagination'),
('Non-Fiction', 'Informative or factual works based on real events, people, or information'),
('Mystery', 'Fiction dealing with the solution of a crime or puzzle'),
('Romance', 'Fiction focused on the romantic relationship between characters'),
('Science Fiction', 'Fiction based on imagined future scientific or technological advances'),
('Fantasy', 'Fiction involving magical or supernatural elements'),
('Thriller', 'Fiction characterized by suspense, excitement, and high stakes'),
('Biography', 'Non-fiction account of a person''s life written by someone else'),
('Self-Help', 'Books aimed at guiding readers to solve personal problems'),
('History', 'Non-fiction focused on past events'),
('Poetry', 'Literary work in which special intensity is given to the expression of feelings and ideas'),
('Young Adult', 'Fiction marketed to adolescents and young adults'),
('Children''s', 'Books written for children'),
('Horror', 'Fiction intended to scare, unsettle, or horrify the audience'),
('Literary Fiction', 'Fiction considered to have literary merit')
ON CONFLICT (name) DO NOTHING;

-- Insert initial data for languages
INSERT INTO languages (code, name) VALUES
('en', 'English'),
('nl', 'Dutch'),
('de', 'German'),
('fr', 'French'),
('es', 'Spanish'),
('it', 'Italian'),
('pt', 'Portuguese')
ON CONFLICT (code) DO NOTHING;