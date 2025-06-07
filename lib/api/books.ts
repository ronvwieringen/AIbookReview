import { v4 as uuidv4 } from 'uuid';
import { run, get, all, Book } from '../db';

export async function getBooks(
  page = 1,
  limit = 10,
  filters: {
    genres?: string[];
    languages?: string[];
    qualityScoreRange?: [number, number];
    readerRatingRange?: [number, number];
    keywords?: string[];
    searchTerm?: string;
  } = {},
  sortBy = 'created_at',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  try {
    let query = `
      SELECT 
        b.*,
        u.first_name as author_first_name,
        u.last_name as author_last_name,
        a.author_pseudonym,
        g.name as genre_name,
        l.name as language_name,
        l.code as language_code
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id
      LEFT JOIN users u ON a.id = u.id
      LEFT JOIN genres g ON b.genre_id = g.id
      LEFT JOIN languages l ON b.language_id = l.id
      WHERE b.status = 'Published'
    `;

    const queryParams: any[] = [];

    // Apply filters
    if (filters.genres && filters.genres.length > 0) {
      query += ' AND g.name IN (' + filters.genres.map(() => '?').join(',') + ')';
      queryParams.push(...filters.genres);
    }

    if (filters.languages && filters.languages.length > 0) {
      query += ' AND l.code IN (' + filters.languages.map(() => '?').join(',') + ')';
      queryParams.push(...filters.languages);
    }

    if (filters.qualityScoreRange) {
      const [min, max] = filters.qualityScoreRange;
      query += ' AND b.ai_quality_score >= ? AND b.ai_quality_score <= ?';
      queryParams.push(min, max);
    }

    if (filters.readerRatingRange) {
      const [min, max] = filters.readerRatingRange;
      query += ' AND b.average_reader_rating >= ? AND b.average_reader_rating <= ?';
      queryParams.push(min, max);
    }

    if (filters.searchTerm) {
      query += ' AND (b.title LIKE ? OR b.blurb LIKE ?)';
      const searchPattern = `%${filters.searchTerm}%`;
      queryParams.push(searchPattern, searchPattern);
    }

    // Apply sorting
    query += ` ORDER BY b.${sortBy} ${sortOrder === 'asc' ? 'ASC' : 'DESC'}`;

    // Get total count for pagination
    const countQuery = query.replace('b.*,\n        u.first_name as author_first_name,\n        u.last_name as author_last_name,\n        a.author_pseudonym,\n        g.name as genre_name,\n        l.name as language_name,\n        l.code as language_code', 'COUNT(*) as total');
    const countResult = await get(countQuery, queryParams);
    const total = countResult ? countResult.total : 0;

    // Apply pagination
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, (page - 1) * limit);

    // Execute the query
    const books = await all(query, queryParams);

    // For each book, get its keywords
    for (const book of books) {
      const keywords = await all(`
        SELECT k.id, k.name
        FROM book_keywords bk
        JOIN keywords k ON bk.keyword_id = k.id
        WHERE bk.book_id = ?
      `, [book.id]);
      
      book.keywords = keywords;
    }

    return {
      books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
}

export async function getBookById(id: string) {
  try {
    const book = await get(`
      SELECT 
        b.*,
        u.first_name as author_first_name,
        u.last_name as author_last_name,
        a.author_pseudonym,
        g.name as genre_name,
        l.name as language_name,
        l.code as language_code
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id
      LEFT JOIN users u ON a.id = u.id
      LEFT JOIN genres g ON b.genre_id = g.id
      LEFT JOIN languages l ON b.language_id = l.id
      WHERE b.id = ?
    `, [id]);

    if (!book) {
      return null;
    }

    // Get book keywords
    const keywords = await all(`
      SELECT k.id, k.name
      FROM book_keywords bk
      JOIN keywords k ON bk.keyword_id = k.id
      WHERE bk.book_id = ?
    `, [id]);
    
    book.keywords = keywords;

    // Get AI review if available
    const aiReview = await get(`
      SELECT *
      FROM ai_reviews
      WHERE book_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `, [id]);
    
    if (aiReview) {
      // Parse JSON fields
      if (aiReview.service_needs) {
        try {
          aiReview.service_needs = JSON.parse(aiReview.service_needs);
        } catch (e) {
          aiReview.service_needs = [];
        }
      }
      
      if (aiReview.plagiarism_details) {
        try {
          aiReview.plagiarism_details = JSON.parse(aiReview.plagiarism_details);
        } catch (e) {
          aiReview.plagiarism_details = {};
        }
      }
      
      book.ai_review = aiReview;
    }

    return book;
  } catch (error) {
    console.error(`Error fetching book with ID ${id}:`, error);
    throw error;
  }
}

export async function getAuthorBooks(authorId: string) {
  try {
    const books = await all(`
      SELECT 
        b.*,
        g.name as genre_name,
        l.name as language_name,
        l.code as language_code
      FROM books b
      LEFT JOIN genres g ON b.genre_id = g.id
      LEFT JOIN languages l ON b.language_id = l.id
      WHERE b.author_id = ?
      ORDER BY b.created_at DESC
    `, [authorId]);

    // For each book, get its keywords
    for (const book of books) {
      const keywords = await all(`
        SELECT k.id, k.name
        FROM book_keywords bk
        JOIN keywords k ON bk.keyword_id = k.id
        WHERE bk.book_id = ?
      `, [book.id]);
      
      book.keywords = keywords;
    }

    return books;
  } catch (error) {
    console.error(`Error fetching books for author ${authorId}:`, error);
    throw error;
  }
}

export async function createBook(bookData: Partial<Book>) {
  try {
    const bookId = uuidv4();
    const now = new Date().toISOString();
    
    await run(`
      INSERT INTO books (
        id, title, author_id, genre_id, language_id, status, 
        cover_image_url, blurb, isbn, publication_date, page_count, 
        target_audience, manuscript_url, average_reader_rating, 
        reader_review_count, ai_quality_score, plagiarism_score, 
        has_author_responded_to_ai_review, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      bookId,
      bookData.title,
      bookData.author_id,
      bookData.genre_id || null,
      bookData.language_id || null,
      bookData.status || 'Draft',
      bookData.cover_image_url || null,
      bookData.blurb || null,
      bookData.isbn || null,
      bookData.publication_date || null,
      bookData.page_count || null,
      bookData.target_audience || null,
      bookData.manuscript_url || null,
      bookData.average_reader_rating || 0,
      bookData.reader_review_count || 0,
      bookData.ai_quality_score || null,
      bookData.plagiarism_score || null,
      bookData.has_author_responded_to_ai_review ? 1 : 0,
      now,
      now
    ]);

    // Add keywords if provided
    if (bookData.keywords && Array.isArray(bookData.keywords)) {
      for (const keyword of bookData.keywords) {
        // First, ensure the keyword exists in the keywords table
        let keywordId;
        const existingKeyword = await get(
          'SELECT id FROM keywords WHERE name = ?',
          [keyword]
        );

        if (existingKeyword) {
          keywordId = existingKeyword.id;
        } else {
          const result = await run(
            'INSERT INTO keywords (name) VALUES (?)',
            [keyword]
          );
          keywordId = result.lastID;
        }

        // Then, add the book-keyword relationship
        await run(
          'INSERT INTO book_keywords (book_id, keyword_id) VALUES (?, ?)',
          [bookId, keywordId]
        );
      }
    }

    return await getBookById(bookId);
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
}

export async function updateBook(id: string, bookData: Partial<Book>) {
  try {
    const updateFields = [];
    const updateValues = [];

    // Build the update query dynamically based on provided fields
    if (bookData.title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(bookData.title);
    }
    
    if (bookData.genre_id !== undefined) {
      updateFields.push('genre_id = ?');
      updateValues.push(bookData.genre_id);
    }
    
    if (bookData.language_id !== undefined) {
      updateFields.push('language_id = ?');
      updateValues.push(bookData.language_id);
    }
    
    if (bookData.status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(bookData.status);
    }
    
    if (bookData.cover_image_url !== undefined) {
      updateFields.push('cover_image_url = ?');
      updateValues.push(bookData.cover_image_url);
    }
    
    if (bookData.blurb !== undefined) {
      updateFields.push('blurb = ?');
      updateValues.push(bookData.blurb);
    }
    
    if (bookData.isbn !== undefined) {
      updateFields.push('isbn = ?');
      updateValues.push(bookData.isbn);
    }
    
    if (bookData.publication_date !== undefined) {
      updateFields.push('publication_date = ?');
      updateValues.push(bookData.publication_date);
    }
    
    if (bookData.page_count !== undefined) {
      updateFields.push('page_count = ?');
      updateValues.push(bookData.page_count);
    }
    
    if (bookData.target_audience !== undefined) {
      updateFields.push('target_audience = ?');
      updateValues.push(bookData.target_audience);
    }
    
    if (bookData.manuscript_url !== undefined) {
      updateFields.push('manuscript_url = ?');
      updateValues.push(bookData.manuscript_url);
    }
    
    if (bookData.ai_quality_score !== undefined) {
      updateFields.push('ai_quality_score = ?');
      updateValues.push(bookData.ai_quality_score);
    }
    
    if (bookData.plagiarism_score !== undefined) {
      updateFields.push('plagiarism_score = ?');
      updateValues.push(bookData.plagiarism_score);
    }
    
    if (bookData.has_author_responded_to_ai_review !== undefined) {
      updateFields.push('has_author_responded_to_ai_review = ?');
      updateValues.push(bookData.has_author_responded_to_ai_review ? 1 : 0);
    }
    
    if (bookData.submitted_for_ai_review_at !== undefined) {
      updateFields.push('submitted_for_ai_review_at = ?');
      updateValues.push(bookData.submitted_for_ai_review_at);
    }
    
    if (bookData.ai_review_completed_at !== undefined) {
      updateFields.push('ai_review_completed_at = ?');
      updateValues.push(bookData.ai_review_completed_at);
    }
    
    if (bookData.published_at !== undefined) {
      updateFields.push('published_at = ?');
      updateValues.push(bookData.published_at);
    }
    
    // Always update the updated_at timestamp
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    
    // Add the book ID to the values array
    updateValues.push(id);

    // Execute the update query
    if (updateFields.length > 0) {
      await run(
        `UPDATE books SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    // Update keywords if provided
    if (bookData.keywords && Array.isArray(bookData.keywords)) {
      // First, remove all existing keywords for this book
      await run(
        'DELETE FROM book_keywords WHERE book_id = ?',
        [id]
      );

      // Then, add the new keywords
      for (const keyword of bookData.keywords) {
        // Ensure the keyword exists in the keywords table
        let keywordId;
        const existingKeyword = await get(
          'SELECT id FROM keywords WHERE name = ?',
          [keyword]
        );

        if (existingKeyword) {
          keywordId = existingKeyword.id;
        } else {
          const result = await run(
            'INSERT INTO keywords (name) VALUES (?)',
            [keyword]
          );
          keywordId = result.lastID;
        }

        // Add the book-keyword relationship
        await run(
          'INSERT INTO book_keywords (book_id, keyword_id) VALUES (?, ?)',
          [id, keywordId]
        );
      }
    }

    return await getBookById(id);
  } catch (error) {
    console.error(`Error updating book with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteBook(id: string) {
  try {
    // Delete the book (cascading deletes will handle related records)
    await run(
      'DELETE FROM books WHERE id = ?',
      [id]
    );

    return { success: true };
  } catch (error) {
    console.error(`Error deleting book with ID ${id}:`, error);
    throw error;
  }
}

export async function submitBookForAIReview(id: string) {
  try {
    const now = new Date().toISOString();
    
    // Update the book status
    await run(
      `UPDATE books SET 
        status = 'SubmittedForAIReview', 
        submitted_for_ai_review_at = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [now, id]
    );

    // Create an entry in the ai_reviews table
    const reviewId = uuidv4();
    await run(
      `INSERT INTO ai_reviews (
        id, book_id, processing_status, created_at, updated_at
      ) VALUES (?, ?, 'Pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [reviewId, id]
    );

    return await getBookById(id);
  } catch (error) {
    console.error(`Error submitting book ${id} for AI review:`, error);
    throw error;
  }
}

export async function publishBook(id: string) {
  try {
    const now = new Date().toISOString();
    
    await run(
      `UPDATE books SET 
        status = 'Published', 
        published_at = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [now, id]
    );

    return await getBookById(id);
  } catch (error) {
    console.error(`Error publishing book ${id}:`, error);
    throw error;
  }
}

export async function unpublishBook(id: string) {
  try {
    await run(
      `UPDATE books SET 
        status = 'Unpublished',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [id]
    );

    return await getBookById(id);
  } catch (error) {
    console.error(`Error unpublishing book ${id}:`, error);
    throw error;
  }
}