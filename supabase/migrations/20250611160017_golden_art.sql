-- Add missing book_purchase_links table and fix API issues

-- Create book_purchase_links table if it doesn't exist
CREATE TABLE IF NOT EXISTS book_purchase_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  platform_name TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create book_keywords junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS book_keywords (
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  keyword_id INTEGER NOT NULL REFERENCES keywords(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, keyword_id)
);

-- Enable RLS on new tables
ALTER TABLE book_purchase_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_keywords ENABLE ROW LEVEL SECURITY;

-- Add policies for book_purchase_links
DROP POLICY IF EXISTS "Anyone can read purchase links for public books" ON book_purchase_links;
CREATE POLICY "Anyone can read purchase links for public books"
  ON book_purchase_links FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM books 
      WHERE books.id = book_purchase_links.book_id AND books.visibility = 'public'
    )
  );

DROP POLICY IF EXISTS "Authors can manage purchase links for own books" ON book_purchase_links;
CREATE POLICY "Authors can manage purchase links for own books"
  ON book_purchase_links FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM books 
      WHERE books.id = book_purchase_links.book_id AND books.author_id = auth.uid()
    )
  );

-- Add policies for book_keywords
DROP POLICY IF EXISTS "Anyone can read keywords for public books" ON book_keywords;
CREATE POLICY "Anyone can read keywords for public books"
  ON book_keywords FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM books 
      WHERE books.id = book_keywords.book_id AND books.visibility = 'public'
    )
  );

DROP POLICY IF EXISTS "Authors can manage keywords for own books" ON book_keywords;
CREATE POLICY "Authors can manage keywords for own books"
  ON book_keywords FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM books 
      WHERE books.id = book_keywords.book_id AND books.author_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_book_purchase_links_book_id ON book_purchase_links(book_id);
CREATE INDEX IF NOT EXISTS idx_book_keywords_book_id ON book_keywords(book_id);
CREATE INDEX IF NOT EXISTS idx_book_keywords_keyword_id ON book_keywords(keyword_id);

-- Insert some sample purchase links for existing books (if any exist)
INSERT INTO book_purchase_links (book_id, platform_name, url)
SELECT 
  b.id,
  'Amazon',
  'https://amazon.com/book/' || b.id
FROM books b
WHERE b.visibility = 'public'
AND NOT EXISTS (
  SELECT 1 FROM book_purchase_links bpl 
  WHERE bpl.book_id = b.id AND bpl.platform_name = 'Amazon'
)
LIMIT 10;

INSERT INTO book_purchase_links (book_id, platform_name, url)
SELECT 
  b.id,
  'Barnes & Noble',
  'https://barnesandnoble.com/book/' || b.id
FROM books b
WHERE b.visibility = 'public'
AND NOT EXISTS (
  SELECT 1 FROM book_purchase_links bpl 
  WHERE bpl.book_id = b.id AND bpl.platform_name = 'Barnes & Noble'
)
LIMIT 10;

-- Add some keywords to existing books
INSERT INTO book_keywords (book_id, keyword_id)
SELECT DISTINCT
  b.id,
  k.id
FROM books b
CROSS JOIN keywords k
WHERE b.visibility = 'public'
AND k.name IN ('adventure', 'love', 'mystery', 'technology', 'friendship')
AND NOT EXISTS (
  SELECT 1 FROM book_keywords bk 
  WHERE bk.book_id = b.id AND bk.keyword_id = k.id
)
LIMIT 50;