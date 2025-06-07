import { v4 as uuidv4 } from 'uuid';
import { run, get, all, AIReview, ReaderReview } from '../db';

// AI Reviews
export async function getAIReview(bookId: string) {
  try {
    const aiReview = await get(`
      SELECT *
      FROM ai_reviews
      WHERE book_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `, [bookId]);

    if (!aiReview) {
      return null;
    }

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

    return aiReview;
  } catch (error) {
    console.error(`Error fetching AI review for book ${bookId}:`, error);
    throw error;
  }
}

export async function updateAIReview(reviewId: string, reviewData: Partial<AIReview>) {
  try {
    const updateFields = [];
    const updateValues = [];

    // Build the update query dynamically based on provided fields
    if (reviewData.processing_status !== undefined) {
      updateFields.push('processing_status = ?');
      updateValues.push(reviewData.processing_status);
    }
    
    if (reviewData.error_message !== undefined) {
      updateFields.push('error_message = ?');
      updateValues.push(reviewData.error_message);
    }
    
    if (reviewData.ai_model_version !== undefined) {
      updateFields.push('ai_model_version = ?');
      updateValues.push(reviewData.ai_model_version);
    }
    
    if (reviewData.full_blurb !== undefined) {
      updateFields.push('full_blurb = ?');
      updateValues.push(reviewData.full_blurb);
    }
    
    if (reviewData.promotional_blurb !== undefined) {
      updateFields.push('promotional_blurb = ?');
      updateValues.push(reviewData.promotional_blurb);
    }
    
    if (reviewData.single_line_summary !== undefined) {
      updateFields.push('single_line_summary = ?');
      updateValues.push(reviewData.single_line_summary);
    }
    
    if (reviewData.detailed_summary !== undefined) {
      updateFields.push('detailed_summary = ?');
      updateValues.push(reviewData.detailed_summary);
    }
    
    if (reviewData.review_summary !== undefined) {
      updateFields.push('review_summary = ?');
      updateValues.push(reviewData.review_summary);
    }
    
    if (reviewData.full_review_content !== undefined) {
      updateFields.push('full_review_content = ?');
      updateValues.push(reviewData.full_review_content);
    }
    
    if (reviewData.author_response !== undefined) {
      updateFields.push('author_response = ?');
      updateValues.push(reviewData.author_response);
    }
    
    if (reviewData.service_needs !== undefined) {
      updateFields.push('service_needs = ?');
      updateValues.push(JSON.stringify(reviewData.service_needs));
    }
    
    if (reviewData.plagiarism_details !== undefined) {
      updateFields.push('plagiarism_details = ?');
      updateValues.push(JSON.stringify(reviewData.plagiarism_details));
    }
    
    // Always update the updated_at timestamp
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    
    // Add the review ID to the values array
    updateValues.push(reviewId);

    // Execute the update query
    if (updateFields.length > 0) {
      await run(
        `UPDATE ai_reviews SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    // Get the updated review
    const updatedReview = await get(
      'SELECT * FROM ai_reviews WHERE id = ?',
      [reviewId]
    );

    // Parse JSON fields
    if (updatedReview.service_needs) {
      try {
        updatedReview.service_needs = JSON.parse(updatedReview.service_needs);
      } catch (e) {
        updatedReview.service_needs = [];
      }
    }
    
    if (updatedReview.plagiarism_details) {
      try {
        updatedReview.plagiarism_details = JSON.parse(updatedReview.plagiarism_details);
      } catch (e) {
        updatedReview.plagiarism_details = {};
      }
    }

    return updatedReview;
  } catch (error) {
    console.error(`Error updating AI review ${reviewId}:`, error);
    throw error;
  }
}

export async function addAuthorResponseToAIReview(bookId: string, response: string) {
  try {
    // First, get the AI review ID
    const aiReview = await get(
      `SELECT id FROM ai_reviews WHERE book_id = ? ORDER BY created_at DESC LIMIT 1`,
      [bookId]
    );

    if (!aiReview) {
      throw new Error('AI review not found');
    }

    // Update the AI review with the author's response
    await run(
      `UPDATE ai_reviews SET 
        author_response = ?, 
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?`,
      [response, aiReview.id]
    );

    // Update the book to indicate the author has responded
    await run(
      `UPDATE books SET 
        has_author_responded_to_ai_review = 1, 
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?`,
      [bookId]
    );

    // Get the updated review
    const updatedReview = await getAIReview(bookId);
    return updatedReview;
  } catch (error) {
    console.error(`Error adding author response to AI review for book ${bookId}:`, error);
    throw error;
  }
}

// Reader Reviews
export async function getReaderReviews(bookId: string, page = 1, limit = 10) {
  try {
    // Get total count for pagination
    const countResult = await get(
      'SELECT COUNT(*) as total FROM reader_reviews WHERE book_id = ?',
      [bookId]
    );
    const total = countResult ? countResult.total : 0;

    // Get reviews with pagination
    const reviews = await all(`
      SELECT 
        r.*,
        u.first_name,
        u.last_name,
        u.profile_picture_url
      FROM reader_reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.book_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `, [bookId, limit, (page - 1) * limit]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error(`Error fetching reader reviews for book ${bookId}:`, error);
    throw error;
  }
}

export async function createReaderReview(reviewData: Partial<ReaderReview>) {
  try {
    const reviewId = uuidv4();
    const now = new Date().toISOString();
    
    await run(`
      INSERT INTO reader_reviews (
        id, book_id, user_id, rating, comment, review_date,
        verified_purchase, helpful_count, not_helpful_count, is_featured,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      reviewId,
      reviewData.book_id,
      reviewData.user_id,
      reviewData.rating,
      reviewData.comment || null,
      now,
      reviewData.verified_purchase ? 1 : 0,
      0, // helpful_count
      0, // not_helpful_count
      0, // is_featured
      now,
      now
    ]);

    // Update the book's average rating and review count
    await updateBookRatingStats(reviewData.book_id as string);

    // Get the created review
    const createdReview = await get(
      'SELECT * FROM reader_reviews WHERE id = ?',
      [reviewId]
    );

    return createdReview;
  } catch (error) {
    console.error('Error creating reader review:', error);
    throw error;
  }
}

export async function updateReaderReview(reviewId: string, reviewData: Partial<ReaderReview>) {
  try {
    // Get the book ID before updating
    const existingReview = await get(
      'SELECT book_id FROM reader_reviews WHERE id = ?',
      [reviewId]
    );

    if (!existingReview) {
      throw new Error('Review not found');
    }

    const updateFields = [];
    const updateValues = [];

    // Build the update query dynamically based on provided fields
    if (reviewData.rating !== undefined) {
      updateFields.push('rating = ?');
      updateValues.push(reviewData.rating);
    }
    
    if (reviewData.comment !== undefined) {
      updateFields.push('comment = ?');
      updateValues.push(reviewData.comment);
    }
    
    if (reviewData.verified_purchase !== undefined) {
      updateFields.push('verified_purchase = ?');
      updateValues.push(reviewData.verified_purchase ? 1 : 0);
    }
    
    if (reviewData.helpful_count !== undefined) {
      updateFields.push('helpful_count = ?');
      updateValues.push(reviewData.helpful_count);
    }
    
    if (reviewData.not_helpful_count !== undefined) {
      updateFields.push('not_helpful_count = ?');
      updateValues.push(reviewData.not_helpful_count);
    }
    
    if (reviewData.is_featured !== undefined) {
      updateFields.push('is_featured = ?');
      updateValues.push(reviewData.is_featured ? 1 : 0);
    }
    
    // Always update the updated_at timestamp
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    
    // Add the review ID to the values array
    updateValues.push(reviewId);

    // Execute the update query
    if (updateFields.length > 0) {
      await run(
        `UPDATE reader_reviews SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    // Update the book's average rating and review count
    await updateBookRatingStats(existingReview.book_id);

    // Get the updated review
    const updatedReview = await get(
      'SELECT * FROM reader_reviews WHERE id = ?',
      [reviewId]
    );

    return updatedReview;
  } catch (error) {
    console.error(`Error updating reader review ${reviewId}:`, error);
    throw error;
  }
}

export async function deleteReaderReview(reviewId: string) {
  try {
    // Get the book ID before deleting
    const existingReview = await get(
      'SELECT book_id FROM reader_reviews WHERE id = ?',
      [reviewId]
    );

    if (!existingReview) {
      throw new Error('Review not found');
    }

    // Delete the review
    await run(
      'DELETE FROM reader_reviews WHERE id = ?',
      [reviewId]
    );

    // Update the book's average rating and review count
    await updateBookRatingStats(existingReview.book_id);

    return { success: true };
  } catch (error) {
    console.error(`Error deleting reader review ${reviewId}:`, error);
    throw error;
  }
}

// Helper function to update a book's average rating and review count
async function updateBookRatingStats(bookId: string) {
  try {
    // Get all reviews for the book
    const reviews = await all(
      'SELECT rating FROM reader_reviews WHERE book_id = ?',
      [bookId]
    );

    // Calculate the new average rating
    const reviewCount = reviews.length;
    let averageRating = 0;

    if (reviewCount > 0) {
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      averageRating = parseFloat((sum / reviewCount).toFixed(2));
    }

    // Update the book
    await run(
      `UPDATE books SET 
        average_reader_rating = ?, 
        reader_review_count = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [averageRating, reviewCount, bookId]
    );
  } catch (error) {
    console.error(`Error updating book rating stats for book ${bookId}:`, error);
    throw error;
  }
}