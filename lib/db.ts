import { Database, open } from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'aibookreview.db');

// Create a database connection
let db: Database;

export async function getDb(): Promise<Database> {
  if (!db) {
    db = await promisify(open)(dbPath, { verbose: true });
  }
  return db;
}

// Promisify database methods
export async function run(sql: string, params: any[] = []): Promise<any> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
}

export async function get(sql: string, params: any[] = []): Promise<any> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

export async function all(sql: string, params: any[] = []): Promise<any[]> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Initialize database schema
export async function initDb() {
  try {
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

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

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

// Initialize the database when this module is imported
initDb().catch(console.error);