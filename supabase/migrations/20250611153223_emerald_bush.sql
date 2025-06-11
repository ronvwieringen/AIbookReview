/*
  # Fix Database Schema and Role Column Issues

  This migration safely handles the database schema setup regardless of current state.
  It will:
  1. Safely create or update the profiles table with the role column
  2. Fix the is_admin() function to handle missing columns gracefully
  3. Ensure all necessary tables and policies exist
  4. Handle enum type conflicts safely
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- First, let's handle enum types safely
DO $$
BEGIN
  -- Create user_role enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('reader', 'author', 'admin');
  END IF;
  
  -- Create other enums if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'book_visibility') THEN
    CREATE TYPE book_visibility AS ENUM ('private', 'public');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'review_status') THEN
    CREATE TYPE review_status AS ENUM ('pending', 'processing', 'completed', 'failed');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'llm_status') THEN
    CREATE TYPE llm_status AS ENUM ('active', 'standby', 'inactive');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'llm_type') THEN
    CREATE TYPE llm_type AS ENUM ('primary', 'backup', 'metadata');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'prompt_type') THEN
    CREATE TYPE prompt_type AS ENUM ('metadata_extraction', 'fiction_review', 'nonfiction_review', 'summarization');
  END IF;
END $$;

-- Ensure profiles table exists with all necessary columns
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns to profiles table if they don't exist
DO $$
BEGIN
  -- Add role column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'reader';
  END IF;
  
  -- Add other missing columns
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'profile_picture_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profile_picture_url TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'bio'
  ) THEN
    ALTER TABLE profiles ADD COLUMN bio TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'website_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN website_url TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'social_media_links'
  ) THEN
    ALTER TABLE profiles ADD COLUMN social_media_links JSONB DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

-- Update any existing profiles to have the reader role if they don't have one
UPDATE profiles SET role = 'reader' WHERE role IS NULL;

-- Create other essential tables if they don't exist
CREATE TABLE IF NOT EXISTS genres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS keywords (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

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

CREATE TABLE IF NOT EXISTS ai_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  prompt_version_id INTEGER,
  status review_status DEFAULT 'pending',
  ai_quality_score INTEGER CHECK (ai_quality_score >= 0 AND ai_quality_score <= 100),
  plot_score INTEGER CHECK (plot_score >= 0 AND plot_score <= 100),
  character_score INTEGER CHECK (character_score >= 0 AND character_score <= 100),
  writing_style_score INTEGER CHECK (writing_style_score >= 0 AND writing_style_score <= 100),
  pacing_score INTEGER CHECK (pacing_score >= 0 AND pacing_score <= 100),
  world_building_score INTEGER CHECK (world_building_score >= 0 AND world_building_score <= 100),
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
  UNIQUE(type)
);

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

CREATE TABLE IF NOT EXISTS reading_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Create the is_admin function with proper error handling
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
  DECLARE
    user_id UUID := auth.uid();
    user_role user_role;
  BEGIN
    -- Return false if no user is authenticated
    IF user_id IS NULL THEN
      RETURN FALSE;
    END IF;

    -- Try to get the user's role with error handling
    BEGIN
      SELECT role INTO user_role 
      FROM public.profiles 
      WHERE id = user_id;
      
      -- If no profile found, return false
      IF user_role IS NULL THEN
        RETURN FALSE;
      END IF;
      
      -- Return true only if user is admin
      RETURN user_role = 'admin';
      
    EXCEPTION WHEN OTHERS THEN
      -- If any error occurs (like missing column), return false
      RETURN FALSE;
    END;
  END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- Create the handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name',
    'reader'::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
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

-- Create update triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_books_updated_at ON books;
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_reviews_updated_at ON ai_reviews;
CREATE TRIGGER update_ai_reviews_updated_at
  BEFORE UPDATE ON ai_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_llm_configs_updated_at ON llm_configs;
CREATE TRIGGER update_llm_configs_updated_at
  BEFORE UPDATE ON llm_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_lists ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can read public books" ON books;
DROP POLICY IF EXISTS "Authors can read own books" ON books;
DROP POLICY IF EXISTS "Authors can create books" ON books;
DROP POLICY IF EXISTS "Authors can update own books" ON books;
DROP POLICY IF EXISTS "Authors can delete own books" ON books;
DROP POLICY IF EXISTS "Anyone can read reviews for public books" ON ai_reviews;
DROP POLICY IF EXISTS "Authors can read reviews for own books" ON ai_reviews;
DROP POLICY IF EXISTS "Authors can create reviews for own books" ON ai_reviews;
DROP POLICY IF EXISTS "Authors can update reviews for own books" ON ai_reviews;
DROP POLICY IF EXISTS "Only admins can access LLM configs" ON llm_configs;
DROP POLICY IF EXISTS "Only admins can access prompts" ON prompts;
DROP POLICY IF EXISTS "Users can manage own reading list" ON reading_lists;

-- Create RLS policies
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
  USING (is_admin());

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

CREATE POLICY "Authors can create reviews for own books"
  ON ai_reviews FOR INSERT
  TO authenticated
  WITH CHECK (
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

CREATE POLICY "Only admins can access LLM configs"
  ON llm_configs FOR ALL
  TO authenticated
  USING (is_admin());

CREATE POLICY "Only admins can access prompts"
  ON prompts FOR ALL
  TO authenticated
  USING (is_admin());

CREATE POLICY "Users can manage own reading list"
  ON reading_lists FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Insert default data
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

INSERT INTO llm_configs (name, type, url, model, api_key, status) VALUES
  ('Gemini 2.5 Pro', 'primary', 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro', 'gemini-2.5pro', '', 'active'),
  ('Gemini Pro 1.5', 'backup', 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro', 'gemini-1.5-pro', '', 'standby'),
  ('Gemini Flash', 'metadata', 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash', 'gemini-2.5flash', '', 'active')
ON CONFLICT (type) DO NOTHING;

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

-- Test the setup
DO $$
BEGIN
  -- Test if the is_admin function works
  PERFORM is_admin();
  RAISE NOTICE 'Database schema setup completed successfully!';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Setup completed with warnings: %', SQLERRM;
END $$;