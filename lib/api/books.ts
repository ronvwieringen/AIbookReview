import { supabase, Book } from '../db';

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
    let query = supabase
      .from('books')
      .select(`
        *,
        authors:author_id(id, first_name, last_name, author_pseudonym),
        genres:genre_id(id, name),
        languages:language_id(id, name, code),
        book_keywords!inner(
          keywords(id, name)
        )
      `)
      .eq('status', 'Published');

    // Apply filters
    if (filters.genres && filters.genres.length > 0) {
      query = query.in('genre_id', filters.genres);
    }

    if (filters.languages && filters.languages.length > 0) {
      query = query.in('language_id', filters.languages);
    }

    if (filters.qualityScoreRange) {
      const [min, max] = filters.qualityScoreRange;
      query = query.gte('ai_quality_score', min).lte('ai_quality_score', max);
    }

    if (filters.readerRatingRange) {
      const [min, max] = filters.readerRatingRange;
      query = query.gte('average_reader_rating', min).lte('average_reader_rating', max);
    }

    if (filters.searchTerm) {
      query = query.or(`title.ilike.%${filters.searchTerm}%,blurb.ilike.%${filters.searchTerm}%`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from('books')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'Published');

    if (countError) {
      throw countError;
    }

    return {
      books: data || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
}

export async function getBookById(id: string) {
  try {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        authors:author_id(id, first_name, last_name, author_pseudonym),
        genres:genre_id(id, name),
        languages:language_id(id, name, code),
        book_keywords(
          keywords(id, name)
        ),
        ai_reviews(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching book with ID ${id}:`, error);
    throw error;
  }
}

export async function getAuthorBooks(authorId: string) {
  try {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        genres:genre_id(id, name),
        languages:language_id(id, name, code)
      `)
      .eq('author_id', authorId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error(`Error fetching books for author ${authorId}:`, error);
    throw error;
  }
}

export async function createBook(bookData: Partial<Book>) {
  try {
    const { data, error } = await supabase
      .from('books')
      .insert(bookData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
}

export async function updateBook(id: string, bookData: Partial<Book>) {
  try {
    const { data, error } = await supabase
      .from('books')
      .update(bookData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error updating book with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteBook(id: string) {
  try {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error(`Error deleting book with ID ${id}:`, error);
    throw error;
  }
}

export async function submitBookForAIReview(id: string) {
  try {
    const { data, error } = await supabase
      .from('books')
      .update({
        status: 'SubmittedForAIReview',
        submitted_for_ai_review_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Create an entry in the ai_reviews table
    const { error: aiReviewError } = await supabase
      .from('ai_reviews')
      .insert({
        book_id: id,
        processing_status: 'Pending',
      });

    if (aiReviewError) {
      throw aiReviewError;
    }

    return data;
  } catch (error) {
    console.error(`Error submitting book ${id} for AI review:`, error);
    throw error;
  }
}

export async function publishBook(id: string) {
  try {
    const { data, error } = await supabase
      .from('books')
      .update({
        status: 'Published',
        published_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error publishing book ${id}:`, error);
    throw error;
  }
}

export async function unpublishBook(id: string) {
  try {
    const { data, error } = await supabase
      .from('books')
      .update({
        status: 'Unpublished',
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error unpublishing book ${id}:`, error);
    throw error;
  }
}