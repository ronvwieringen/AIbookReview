import { Database, open } from 'sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'aibookreview.db');

// Create a database connection with proper configuration
let db: Database | null = null;
let initPromise: Promise<void> | null = null;

export async function getDb(): Promise<Database> {
  if (!db) {
    return new Promise((resolve, reject) => {
      db = new Database(dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(err);
        } else {
          console.log('Database connected successfully');
          
          // Configure database for better concurrency handling
          db!.configure('busyTimeout', 5000); // Wait up to 5 seconds for locks
          db!.run('PRAGMA journal_mode = WAL'); // Enable WAL mode for better concurrency
          db!.run('PRAGMA synchronous = NORMAL'); // Balance between safety and performance
          db!.run('PRAGMA cache_size = 1000'); // Increase cache size
          db!.run('PRAGMA temp_store = memory'); // Store temp tables in memory
          
          resolve(db!);
        }
      });
    });
  }
  return db;
}

// Database methods with retry logic for busy errors
export async function run(sql: string, params: any[] = []): Promise<any> {
  const database = await getDb();
  return new Promise((resolve, reject) => {
    const executeWithRetry = (attempt: number = 0) => {
      database.run(sql, params, function(err) {
        if (err) {
          // Retry on busy errors up to 3 times with exponential backoff
          if (err.code === 'SQLITE_BUSY' && attempt < 3) {
            const delay = Math.pow(2, attempt) * 100; // 100ms, 200ms, 400ms
            setTimeout(() => executeWithRetry(attempt + 1), delay);
            return;
          }
          console.error('Database run error:', err);
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    };
    executeWithRetry();
  });
}

export async function get(sql: string, params: any[] = []): Promise<any> {
  const database = await getDb();
  return new Promise((resolve, reject) => {
    const executeWithRetry = (attempt: number = 0) => {
      database.get(sql, params, (err, row) => {
        if (err) {
          // Retry on busy errors up to 3 times with exponential backoff
          if (err.code === 'SQLITE_BUSY' && attempt < 3) {
            const delay = Math.pow(2, attempt) * 100; // 100ms, 200ms, 400ms
            setTimeout(() => executeWithRetry(attempt + 1), delay);
            return;
          }
          console.error('Database get error:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    };
    executeWithRetry();
  });
}

export async function all(sql: string, params: any[] = []): Promise<any[]> {
  const database = await getDb();
  return new Promise((resolve, reject) => {
    const executeWithRetry = (attempt: number = 0) => {
      database.all(sql, params, (err, rows) => {
        if (err) {
          // Retry on busy errors up to 3 times with exponential backoff
          if (err.code === 'SQLITE_BUSY' && attempt < 3) {
            const delay = Math.pow(2, attempt) * 100; // 100ms, 200ms, 400ms
            setTimeout(() => executeWithRetry(attempt + 1), delay);
            return;
          }
          console.error('Database all error:', err);
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    };
    executeWithRetry();
  });
}

// Initialize database schema - singleton pattern
export async function initDb() {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      console.log('Initializing database...');
      
      await run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          first_name TEXT,
          last_name TEXT,
          role TEXT NOT NULL CHECK (role IN ('Author', 'Reader', 'ServiceProvider', 'PublisherAdmin', 'PlatformAdmin')),
          profile_picture_url TEXT,
          bio TEXT,
          preferred_language TEXT DEFAULT 'en',
          is_active INTEGER DEFAULT 1,
          is_verified INTEGER DEFAULT 0,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS authors (
          id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
          website_url TEXT,
          social_media_links TEXT DEFAULT '{}',
          author_pseudonym TEXT
        )
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS genres (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          description TEXT
        )
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS languages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT UNIQUE NOT NULL,
          name TEXT UNIQUE NOT NULL
        )
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS books (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          author_id TEXT REFERENCES authors(id) ON DELETE CASCADE,
          genre_id INTEGER REFERENCES genres(id) ON DELETE SET NULL,
          language_id INTEGER REFERENCES languages(id) ON DELETE SET NULL,
          status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'SubmittedForAIReview', 'AIReviewInProgress', 'AIReviewCompleted', 'Published', 'Unpublished', 'Rejected', 'AnonymousProcessing')),
          cover_image_url TEXT,
          blurb TEXT,
          isbn TEXT UNIQUE,
          publication_date TEXT,
          page_count INTEGER,
          target_audience TEXT,
          manuscript_url TEXT,
          average_reader_rating REAL DEFAULT 0.00,
          reader_review_count INTEGER DEFAULT 0,
          ai_quality_score REAL,
          plagiarism_score REAL,
          has_author_responded_to_ai_review INTEGER DEFAULT 0,
          submitted_for_ai_review_at TEXT,
          ai_review_completed_at TEXT,
          published_at TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS keywords (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL
        )
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS book_keywords (
          book_id TEXT REFERENCES books(id) ON DELETE CASCADE,
          keyword_id INTEGER REFERENCES keywords(id) ON DELETE CASCADE,
          PRIMARY KEY (book_id, keyword_id)
        )
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS ai_reviews (
          id TEXT PRIMARY KEY,
          book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
          review_date TEXT DEFAULT CURRENT_TIMESTAMP,
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
          service_needs TEXT DEFAULT '[]',
          plagiarism_details TEXT DEFAULT '{}',
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS reader_reviews (
          id TEXT PRIMARY KEY,
          book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          rating REAL NOT NULL CHECK (rating >= 0.5 AND rating <= 5.0),
          comment TEXT,
          review_date TEXT DEFAULT CURRENT_TIMESTAMP,
          verified_purchase INTEGER DEFAULT 0,
          helpful_count INTEGER DEFAULT 0,
          not_helpful_count INTEGER DEFAULT 0,
          is_featured INTEGER DEFAULT 0,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Add prompts table
      await run(`
        CREATE TABLE IF NOT EXISTS prompts (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('metadata_extraction', 'initial_review', 'detailed_review')),
          book_type TEXT,
          prompt_text TEXT NOT NULL,
          variables TEXT DEFAULT '[]',
          is_active INTEGER DEFAULT 1,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Insert initial data for genres
      const genres = [
        ['Fiction', 'Narrative works created from the imagination'],
        ['Non-Fiction', 'Informative or factual works based on real events, people, or information'],
        ['Mystery', 'Fiction dealing with the solution of a crime or puzzle'],
        ['Romance', 'Fiction focused on the romantic relationship between characters'],
        ['Science Fiction', 'Fiction based on imagined future scientific or technological advances'],
        ['Fantasy', 'Fiction involving magical or supernatural elements'],
        ['Thriller', 'Fiction characterized by suspense, excitement, and high stakes'],
        ['Biography', 'Non-fiction account of a person\'s life written by someone else'],
        ['Self-Help', 'Books aimed at guiding readers to solve personal problems'],
        ['History', 'Non-fiction focused on past events'],
        ['Poetry', 'Literary work in which special intensity is given to the expression of feelings and ideas'],
        ['Young Adult', 'Fiction marketed to adolescents and young adults'],
        ['Children\'s', 'Books written for children'],
        ['Horror', 'Fiction intended to scare, unsettle, or horrify the audience'],
        ['Literary Fiction', 'Fiction considered to have literary merit']
      ];

      for (const [name, description] of genres) {
        await run(
          'INSERT OR IGNORE INTO genres (name, description) VALUES (?, ?)',
          [name, description]
        );
      }

      // Insert initial data for languages
      const languages = [
        ['en', 'English'],
        ['nl', 'Dutch'],
        ['de', 'German'],
        ['fr', 'French'],
        ['es', 'Spanish'],
        ['it', 'Italian'],
        ['pt', 'Portuguese']
      ];

      for (const [code, name] of languages) {
        await run(
          'INSERT OR IGNORE INTO languages (code, name) VALUES (?, ?)',
          [code, name]
        );
      }

      // Insert default prompts if they don't exist
      await insertDefaultPrompts();

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      initPromise = null; // Reset promise on error so it can be retried
      throw error;
    }
  })();

  return initPromise;
}

async function insertDefaultPrompts() {
  const defaultPrompts = [
    {
      id: 'metadata-extraction-1',
      name: 'Metadata Extraction',
      type: 'metadata_extraction',
      book_type: null,
      prompt_text: `Analyze this manuscript and provide the following information in JSON format:
{
    "author": "Name of the primary author (if mentioned, otherwise 'Not specified')",
    "co_authors": ["List of co-authors"] or [],
    "booktype": "fiction or non-fiction or poetry or screenplay or essay or blog or scientific",
    "language": "primary language of the text, in the correct language so for example French is Français and German is Deutsch ist Deutsch und Spanish is Español",
    "ISBN":"ISBN-number",
    "Publisher":"the publisher or uitgever",
    "Wordcount":"the number of words in the manuscript",
    "Topic":"The main topic in maximum 10 words, in the language as identified for the document",
    "Characters":["in the case of fiction, a list of maximum five names of main characters that appear in the story, sorted from most important to least important"],
    "Location":["a list of maximum three main geographical locations where the story is situated"]
}
Base your analysis ONLY on the actual content of the manuscript. If any information is not available, use 'Not specified'.`,
      variables: '[]',
      is_active: 1
    },
    {
      id: 'fiction-review-1',
      name: 'Fiction Review',
      type: 'initial_review',
      book_type: 'fiction',
      prompt_text: `You are a professional literary critic reviewing a {type} manuscript titled "{topic}". 

Analyze this {language} fiction work and provide a comprehensive review covering:

1. **Language & Style** (25 points)
   - Grammar, spelling, and punctuation accuracy
   - Word choice and vocabulary effectiveness
   - Clarity and accessibility of prose
   - Character voice differentiation
   - Use of literary devices

2. **Sensory Experience & Immersion** (20 points)
   - Integration of sensory details
   - Emotional portrayal through physical reactions
   - Exploration of characters' inner worlds

3. **Scene Construction & Dynamics** (25 points)
   - Setting and atmosphere creation
   - Scene structure and pacing
   - Movement and environmental interaction

4. **Plot, Structure & Meaning** (30 points)
   - Logic and believability
   - Character motivation
   - Tension building and conflict
   - Plot structure and climax effectiveness

Provide a score out of 100 and detailed feedback for each section. End with a brief summary of strengths and areas for improvement.`,
      variables: '["type", "topic", "language"]',
      is_active: 1
    },
    {
      id: 'non-fiction-review-1',
      name: 'Non-Fiction Review',
      type: 'initial_review',
      book_type: 'non-fiction',
      prompt_text: `You are a professional editor reviewing a {type} manuscript about "{topic}". 

Analyze this {language} non-fiction work and provide a comprehensive review covering:

1. **Substantiation of Claims** (30 points)
   - Quality of supporting evidence
   - Appropriateness for target audience
   - Persuasiveness of arguments
   - Source citation and originality

2. **Completeness** (25 points)
   - Coverage of core topic aspects
   - Depth of insight beyond common knowledge

3. **Structure & Clarity** (25 points)
   - Logical organization
   - Clear presentation of ideas
   - Accessibility to intended readers

4. **Originality & Value** (20 points)
   - Unique perspective or contribution
   - Practical applicability
   - Innovation in approach

Provide a score out of 100 and detailed feedback for each section. Identify any weaknesses such as oversimplification, bias, or outdated information.`,
      variables: '["type", "topic", "language"]',
      is_active: 1
    },
    {
      id: 'poetry-review-1',
      name: 'Poetry Review',
      type: 'initial_review',
      book_type: 'poetry',
      prompt_text: `You are a poetry critic reviewing a {type} collection titled "{topic}".

Analyze this {language} poetry work and provide a comprehensive review covering:

1. **Language & Craft** (35 points)
   - Word choice and precision
   - Rhythm and meter
   - Use of poetic devices
   - Voice and tone consistency

2. **Imagery & Emotion** (30 points)
   - Vivid and original imagery
   - Emotional resonance
   - Sensory engagement

3. **Structure & Form** (20 points)
   - Poem structure and organization
   - Collection coherence
   - Form innovation or mastery

4. **Meaning & Impact** (15 points)
   - Thematic depth
   - Cultural or universal relevance
   - Reader engagement

Provide a score out of 100 and detailed feedback for each section. Comment on the collection's overall unity and individual poem strengths.`,
      variables: '["type", "topic", "language"]',
      is_active: 1
    }
  ];

  for (const prompt of defaultPrompts) {
    await run(
      'INSERT OR IGNORE INTO prompts (id, name, type, book_type, prompt_text, variables, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))',
      [prompt.id, prompt.name, prompt.type, prompt.book_type, prompt.prompt_text, prompt.variables, prompt.is_active]
    );
  }
}

// Initialize database on module load
initDb().catch(console.error);

// Type definitions for database tables
export type User = {
  id: string;
  email: string;
  password_hash: string;
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
  ai_quality_score?: number;
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

export type Prompt = {
  id: string;
  name: string;
  type: 'metadata_extraction' | 'initial_review' | 'detailed_review';
  book_type?: string;
  prompt_text: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};