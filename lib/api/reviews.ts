import { supabase, AIReview, ReaderReview } from '../db';

// AI Reviews
export async function getAIReview(bookId: string) {
  try {
    const { data, error } = await supabase
      .from('ai_reviews')
      .select('*')
      .eq('book_id', bookId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching AI review for book ${bookId}:`, error);
    throw error;
  }
}

export async function updateAIReview(reviewId: string, reviewData: Partial<AIReview>) {
  try {
    const { data, error } = await supabase
      .from('ai_reviews')
      .update(reviewData)
      .eq('id', reviewId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error updating AI review ${reviewId}:`, error);
    throw error;
  }
}

export async function addAuthorResponseToAIReview(bookId: string, response: string) {
  try {
    // First, get the AI review ID
    const { data: aiReview, error: fetchError } = await supabase
      .from('ai_reviews')
      .select('id')
      .eq('book_id', bookId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Update the AI review with the author's response
    const { data, error } = await supabase
      .from('ai_reviews')
      .update({ author_response: response })
      .eq('id', aiReview.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update the book to indicate the author has responded
    const { error: bookError } = await supabase
      .from('books')
      .update({ has_author_responded_to_ai_review: true })
      .eq('id', bookId);

    if (bookError) {
      throw bookError;
    }

    return data;
  } catch (error) {
    console.error(`Error adding author response to AI review for book ${bookId}:`, error);
    throw error;
  }
}

// Reader Reviews
export async function getReaderReviews(bookId: string, page = 1, limit = 10) {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('reader_reviews')
      .select(`
        *,
        users:user_id(id, first_name, last_name, profile_picture_url)
      `, { count: 'exact' })
      .eq('book_id', bookId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }

    return {
      reviews: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  } catch (error) {
    console.error(`Error fetching reader reviews for book ${bookId}:`, error);
    throw error;
  }
}

export async function createReaderReview(reviewData: Partial<ReaderReview>) {
  try {
    const { data, error } = await supabase
      .from('reader_reviews')
      .insert(reviewData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update the book's average rating and review count
    await updateBookRatingStats(reviewData.book_id as string);

    return data;
  } catch (error) {
    console.error('Error creating reader review:', error);
    throw error;
  }
}

export async function updateReaderReview(reviewId: string, reviewData: Partial<ReaderReview>) {
  try {
    // Get the book ID before updating
    const { data: existingReview, error: fetchError } = await supabase
      .from('reader_reviews')
      .select('book_id')
      .eq('id', reviewId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    const { data, error } = await supabase
      .from('reader_reviews')
      .update(reviewData)
      .eq('id', reviewId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update the book's average rating and review count
    await updateBookRatingStats(existingReview.book_id);

    return data;
  } catch (error) {
    console.error(`Error updating reader review ${reviewId}:`, error);
    throw error;
  }
}

export async function deleteReaderReview(reviewId: string) {
  try {
    // Get the book ID before deleting
    const { data: existingReview, error: fetchError } = await supabase
      .from('reader_reviews')
      .select('book_id')
      .eq('id', reviewId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    const { error } = await supabase
      .from('reader_reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      throw error;
    }

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
    const { data: reviews, error: fetchError } = await supabase
      .from('reader_reviews')
      .select('rating')
      .eq('book_id', bookId);

    if (fetchError) {
      throw fetchError;
    }

    // Calculate the new average rating
    const reviewCount = reviews?.length || 0;
    let averageRating = 0;

    if (reviewCount > 0) {
      const sum = reviews!.reduce((acc, review) => acc + review.rating, 0);
      averageRating = parseFloat((sum / reviewCount).toFixed(2));
    }

    // Update the book
    const { error: updateError } = await supabase
      .from('books')
      .update({
        average_reader_rating: averageRating,
        reader_review_count: reviewCount,
      })
      .eq('id', bookId);

    if (updateError) {
      throw updateError;
    }
  } catch (error) {
    console.error(`Error updating book rating stats for book ${bookId}:`, error);
    throw error;
  }
}