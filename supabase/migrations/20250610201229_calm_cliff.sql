-- Updated Database Schema for AIbookReview.com
-- Incorporating elements from the MySQL schema proposal

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS reading_lists CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS book_keywords CASCADE;
DROP TABLE IF EXISTS keywords CASCADE;
DROP TABLE IF EXISTS book_purchase_links CASCADE;
DROP TABLE IF EXISTS reader_reviews CASCADE;
DROP TABLE IF EXISTS author_process_checklists CASCADE;
DROP TABLE IF EXISTS genres CASCADE;
DROP TABLE IF EXISTS prompts CASCADE;
DROP TABLE IF EXISTS llm_configs CASCADE;
DROP TABLE IF EXISTS user_sso_integrations CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create custom types
CREATE TYPE user_role AS ENUM ('reader', 'author', 'admin');
CREATE TYPE book_visibility AS ENUM ('private', 'public');
CREATE TYPE review_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE llm_status AS ENUM ('active', 'standby', 'inactive');
CREATE TYPE llm_type AS ENUM ('primary', 'backup', 'metadata');
CREATE TYPE prompt_type AS ENUM ('metadata_extraction', 'fiction_review', 'nonfiction_review', 'summarization');
CREATE TYPE sso_provider AS ENUM ('google', 'microsoft');

-- =================================================================
-- 1. Core User, Profile, and Genre Tables
-- =================================================================

-- Enhanced profiles table based on your Users table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'reader',
  profile_picture_url TEXT,
  bio TEXT,
  website_url TEXT,
  social_media_links JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SSO integrations table from your schema
CREATE TABLE IF NOT EXISTS user_sso_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider sso_provider NOT NULL,
  provider_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider, provider_user_id)
);

-- Genres table from your schema
CREATE TABLE IF NOT EXISTS genres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

-- Keywords table from your schema
CREATE TABLE IF NOT EXISTS keywords (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

-- =================================================================
-- 2. Book, Review, and Content Tables
-- =================================================================

-- Enhanced books table incorporating your structure
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  genre_id INTEGER REFERENCES genres(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'english',
  book_type TEXT,
  cover_image_url TEXT,
  visibility book_visibility DEFAULT 'private',
  publication_date DATE,
  description TEXT,
  publisher TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Book keywords junction table
CREATE TABLE IF NOT EXISTS book_keywords (
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  keyword_id INTEGER NOT NULL REFERENCES keywords(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, keyword_id)
);

-- Book purchase links from your schema
CREATE TABLE IF NOT EXISTS book_purchase_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  platform_name TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced AI reviews with score breakdown from your schema
CREATE TABLE IF NOT EXISTS ai_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  prompt_version_id INTEGER REFERENCES prompts(id) ON DELETE SET NULL,
  status review_status DEFAULT 'pending',
  ai_quality_score INTEGER CHECK (ai_quality_score >= 0 AND ai_quality_score <= 100),
  -- Score breakdown from your schema
  plot_score INTEGER CHECK (plot_score >= 0 AND plot_score <= 100),
  character_score INTEGER CHECK (character_score >= 0 AND character_score <= 100),
  writing_style_score INTEGER CHECK (writing_style_score >= 0 AND writing_style_score <= 100),
  pacing_score INTEGER CHECK (pacing_score >= 0 AND pacing_score <= 100),
  world_building_score INTEGER CHECK (world_building_score >= 0 AND world_building_score <= 100),
  -- Summary fields from your schema
  summary_single_line TEXT,
  summary_100_word TEXT,
  promotional_blurb TEXT,
  ai_analysis JSONB DEFAULT '{}',
  author_response TEXT,
  view_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  review_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Author process checklists from your schema
CREATE TABLE IF NOT EXISTS author_process_checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  professional_services_used JSONB DEFAULT '{}',
  ai_tools_used JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reader reviews from your schema
CREATE TABLE IF NOT EXISTS reader_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0.5 AND rating <= 5.0),
  comment TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  review_date TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(book_id, user_id) -- One review per user per book
);

-- =================================================================
-- 3. Admin & System Configuration Tables
-- =================================================================

-- Enhanced prompts table with your structure
CREATE TABLE IF NOT EXISTS prompts (
  id SERIAL PRIMARY KEY,
  prompt_name TEXT NOT NULL,
  prompt_type prompt_type NOT NULL,
  prompt_text TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(prompt_name, version)
);

-- LLM Configurations table (keeping from original)
CREATE TABLE IF NOT EXISTS llm_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type llm_type NOT NULL,
  url TEXT NOT NULL,
  model TEXT NOT NULL,
  api_key TEXT NOT NULL,
  status llm_status DEFAULT 'active',
  last_tested TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(type) -- Only one config per type
);

-- Reading lists table (user saved books)
CREATE TABLE IF NOT EXISTS reading_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id) -- Prevent duplicate saves
);

-- =================================================================
-- 4. Indexes for Performance
-- =================================================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Book indexes
CREATE INDEX IF NOT EXISTS idx_books_author_id ON books(author_id);
CREATE INDEX IF NOT EXISTS idx_books_genre_id ON books(genre_id);
CREATE INDEX IF NOT EXISTS idx_books_visibility ON books(visibility);
CREATE INDEX IF NOT EXISTS idx_books_title ON books USING gin(to_tsvector('english', title));

-- Review indexes
CREATE INDEX IF NOT EXISTS idx_ai_reviews_book_id ON ai_reviews(book_id);
CREATE INDEX IF NOT EXISTS idx_reader_reviews_book_id ON reader_reviews(book_id);
CREATE INDEX IF NOT EXISTS idx_reader_reviews_user_id ON reader_reviews(user_id);

-- =================================================================
-- 5. Row Level Security
-- =================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sso_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_purchase_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE author_process_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE reader_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_lists ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Books policies
CREATE POLICY "Anyone can read public books"
  ON books FOR SELECT
  TO authenticated
  USING (visibility = 'public');

CREATE POLICY "Authors can read own books"
  ON books FOR SELECT
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Authors can create books"
  ON books FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update own books"
  ON books FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Authors can delete own books"
  ON books FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- AI Reviews policies
CREATE POLICY "Anyone can read reviews for public books"
  ON ai_reviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM books 
      WHERE books.id = ai_reviews.book_id AND books.visibility = 'public'
    )
  );

CREATE POLICY "Authors can read reviews for own books"
  ON ai_reviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM books 
      WHERE books.id = ai_reviews.book_id AND books.author_id = auth.uid()
    )
  );

CREATE POLICY "Authors can update reviews for own books"
  ON ai_reviews FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM books 
      WHERE books.id = ai_reviews.book_id AND books.author_id = auth.uid()
    )
  );

-- Reader reviews policies
CREATE POLICY "Anyone can read visible reader reviews for public books"
  ON reader_reviews FOR SELECT
  TO authenticated
  USING (
    is_visible = TRUE AND
    EXISTS (
      SELECT 1 FROM books 
      WHERE books.id = reader_reviews.book_id AND books.visibility = 'public'
    )
  );

CREATE POLICY "Users can create reader reviews"
  ON reader_reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reader reviews"
  ON reader_reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- LLM configs policies (admin only)
CREATE POLICY "Only admins can access LLM configs"
  ON llm_configs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Prompts policies (admin only)
CREATE POLICY "Only admins can access prompts"
  ON prompts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Reading lists policies
CREATE POLICY "Users can manage own reading list"
  ON reading_lists FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Book purchase links policies
CREATE POLICY "Anyone can read purchase links for public books"
  ON book_purchase_links FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM books 
      WHERE books.id = book_purchase_links.book_id AND books.visibility = 'public'
    )
  );

CREATE POLICY "Authors can manage purchase links for own books"
  ON book_purchase_links FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM books 
      WHERE books.id = book_purchase_links.book_id AND books.author_id = auth.uid()
    )
  );

-- =================================================================
-- 6. Functions and Triggers
-- =================================================================

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers for tables with updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_reviews_updated_at
  BEFORE UPDATE ON ai_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_llm_configs_updated_at
  BEFORE UPDATE ON llm_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =================================================================
-- 7. Initial Data
-- =================================================================

-- Insert default genres
INSERT INTO genres (name) VALUES
  ('Fiction'),
  ('Science Fiction'),
  ('Fantasy'),
  ('Romance'),
  ('Mystery'),
  ('Thriller'),
  ('Horror'),
  ('Historical Fiction'),
  ('Literary Fiction'),
  ('Non-Fiction'),
  ('Biography'),
  ('Self-Help'),
  ('Business'),
  ('Health'),
  ('Travel'),
  ('Cooking'),
  ('Technology'),
  ('Science'),
  ('Philosophy'),
  ('Religion')
ON CONFLICT (name) DO NOTHING;

-- Insert default keywords
INSERT INTO keywords (name) VALUES
  ('adventure'),
  ('artificial intelligence'),
  ('coming of age'),
  ('dystopian'),
  ('family'),
  ('friendship'),
  ('love'),
  ('magic'),
  ('mystery'),
  ('politics'),
  ('psychology'),
  ('redemption'),
  ('revenge'),
  ('space'),
  ('technology'),
  ('time travel'),
  ('war'),
  ('virtual reality'),
  ('consciousness'),
  ('future')
ON CONFLICT (name) DO NOTHING;

-- Insert default LLM configurations
INSERT INTO llm_configs (name, type, url, model, api_key, status) VALUES
  ('Gemini 2.5 Pro', 'primary', 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro', 'gemini-2.5pro', '', 'active'),
  ('Gemini Pro 1.5', 'backup', 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro', 'gemini-1.5-pro', '', 'standby'),
  ('Gemini Flash', 'metadata', 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash', 'gemini-2.5flash', '', 'active')
ON CONFLICT (type) DO NOTHING;

-- Insert default prompts
INSERT INTO prompts (prompt_name, prompt_type, prompt_text) VALUES
  ('Metadata Extraction', 'metadata_extraction', 'You are an expert book metadata extraction system. Your task is to analyze the provided manuscript text and extract comprehensive metadata about the book.

Please analyze the text and provide the following information in JSON format:

{
  "title": "The book''s title (if explicitly mentioned or can be inferred)",
  "genre": "Primary genre classification",
  "subgenres": ["Array of applicable subgenres"],
  "themes": ["Major themes present in the work"],
  "setting": {
    "time_period": "When the story takes place",
    "location": "Where the story is set",
    "world_type": "realistic/fantasy/sci-fi/historical/etc"
  },
  "characters": {
    "protagonist": "Main character description",
    "supporting_characters": ["Key supporting characters"],
    "character_count": "approximate number of significant characters"
  },
  "narrative_style": {
    "point_of_view": "first person/third person/omniscient/etc",
    "tense": "past/present/mixed",
    "narrative_technique": "linear/non-linear/multiple timelines/etc"
  },
  "content_warnings": ["Any potentially sensitive content"],
  "target_audience": "Primary intended readership",
  "estimated_word_count": "Approximate word count if determinable",
  "language_complexity": "elementary/intermediate/advanced/literary",
  "cultural_context": "Any specific cultural or historical context",
  "series_potential": "standalone/series potential/part of series"
}

Focus on accuracy and provide detailed, specific information where possible. If certain metadata cannot be determined from the provided text, indicate this clearly in your response.'),

  ('Fiction Review', 'fiction_review', 'You are a professional literary critic and book reviewer specializing in fiction. Your task is to provide a comprehensive, balanced, and insightful review of the submitted manuscript.

Please structure your review with the following sections:

## OVERALL ASSESSMENT
Provide a concise summary of your overall impression, including a rating out of 5 stars and a brief explanation of the rating.

## PLOT AND STRUCTURE
- Evaluate the story''s plot development, pacing, and structure
- Assess the effectiveness of the opening, middle, and conclusion
- Comment on plot originality and any plot holes or inconsistencies
- Analyze the use of conflict, tension, and resolution

## CHARACTER DEVELOPMENT
- Evaluate the depth and believability of main characters
- Assess character growth and development throughout the story
- Comment on dialogue quality and character voice distinctiveness
- Analyze relationships between characters and their dynamics

## WRITING STYLE AND CRAFT
- Evaluate prose quality, clarity, and readability
- Assess the author''s voice and narrative technique
- Comment on descriptive writing and scene-setting abilities
- Analyze use of literary devices and techniques

## THEMES AND DEPTH
- Identify and evaluate major themes explored in the work
- Assess the depth of thematic exploration
- Comment on the work''s emotional resonance and impact
- Evaluate any social, philosophical, or cultural commentary

## GENRE CONVENTIONS
- Assess how well the work fits within its genre
- Evaluate adherence to or creative departure from genre expectations
- Comment on originality within the genre context

## STRENGTHS
List the manuscript''s strongest elements and what works particularly well.

## AREAS FOR IMPROVEMENT
Provide constructive feedback on elements that could be strengthened, with specific suggestions where possible.

## TARGET AUDIENCE
Identify the ideal readership for this work and explain why.

## MARKETABILITY
Assess the commercial potential and compare to similar successful works in the market.

## FINAL RECOMMENDATION
Provide a clear recommendation regarding publication readiness and any next steps.

Maintain a professional, constructive tone throughout. Be honest but encouraging, focusing on helping the author improve their work while recognizing its strengths.'),

  ('Non-Fiction Review', 'nonfiction_review', 'You are an expert non-fiction book reviewer and editor with extensive experience across multiple non-fiction categories. Your task is to provide a comprehensive, professional review of the submitted non-fiction manuscript.

Please structure your review with the following sections:

## OVERALL ASSESSMENT
Provide a concise summary of your overall impression, including a rating out of 5 stars and brief explanation of the rating.

## CONTENT AND ACCURACY
- Evaluate the accuracy and reliability of information presented
- Assess the depth and breadth of research
- Comment on fact-checking and source credibility
- Identify any factual errors or questionable claims

## STRUCTURE AND ORGANIZATION
- Evaluate the logical flow and organization of content
- Assess chapter structure and information hierarchy
- Comment on the effectiveness of introductions and conclusions
- Analyze use of headings, subheadings, and navigation aids

## WRITING CLARITY AND ACCESSIBILITY
- Evaluate clarity of explanation for complex concepts
- Assess readability for the intended audience
- Comment on jargon usage and technical language appropriateness
- Analyze the author''s ability to make difficult topics accessible

## AUTHORITY AND EXPERTISE
- Evaluate the author''s demonstrated expertise in the subject matter
- Assess credibility and authority on the topic
- Comment on the author''s unique perspective or contribution
- Analyze use of personal experience vs. research-based content

## PRACTICAL VALUE AND APPLICATION
- Assess the practical utility of the information provided
- Evaluate actionable advice and implementation guidance
- Comment on real-world applicability of concepts
- Analyze tools, frameworks, or methodologies presented

## RESEARCH AND SOURCES
- Evaluate the quality and diversity of sources cited
- Assess bibliography and reference completeness
- Comment on balance between primary and secondary sources
- Analyze integration of research into the narrative

## ORIGINALITY AND CONTRIBUTION
- Assess what new insights or perspectives the work offers
- Evaluate originality of ideas or approach
- Comment on the work''s contribution to the field
- Analyze differentiation from existing works on the topic

## VISUAL ELEMENTS AND SUPPLEMENTS
- Evaluate use of charts, graphs, images, or diagrams
- Assess effectiveness of visual aids in supporting content
- Comment on appendices, glossaries, or additional resources
- Analyze overall design and layout considerations

## TARGET AUDIENCE ALIGNMENT
- Identify the intended audience and assess content appropriateness
- Evaluate whether the writing level matches the target readership
- Comment on assumptions about reader background knowledge
- Analyze market positioning within the category

## STRENGTHS
List the manuscript''s strongest elements and most valuable contributions.

## AREAS FOR IMPROVEMENT
Provide specific, constructive feedback on elements that need strengthening, with actionable suggestions.

## COMPETITIVE ANALYSIS
Compare to similar works in the market and assess competitive positioning.

## MARKETABILITY AND COMMERCIAL POTENTIAL
Evaluate commercial viability and potential market appeal.

## FINAL RECOMMENDATION
Provide clear guidance on publication readiness and recommended next steps.

Maintain objectivity while being constructive. Focus on helping the author strengthen their work while acknowledging its contributions to the field.')
ON CONFLICT (prompt_name, version) DO NOTHING;