-- SQL script to add UNIQUE constraint to ai_reviews.book_id
-- This fixes the PGRST118 error by ensuring one-to-one relationship between books and AI reviews

-- Add UNIQUE constraint to book_id column
ALTER TABLE ai_reviews 
ADD CONSTRAINT ai_reviews_book_id_unique UNIQUE (book_id);

-- Verify the constraint was added
SELECT 
    conname as constraint_name,
    contype as constraint_type
FROM pg_constraint 
WHERE conrelid = 'ai_reviews'::regclass 
AND conname = 'ai_reviews_book_id_unique';