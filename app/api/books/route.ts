import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServer()
    const { searchParams } = new URL(request.url)
    
    // Get query parameters
    const search = searchParams.get('search') || ''
    const genre = searchParams.get('genre') || 'all'
    const language = searchParams.get('language') || 'all'
    const minScore = parseInt(searchParams.get('minScore') || '0')
    const sortBy = searchParams.get('sortBy') || 'score'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit
    
    // Build the query
    let query = supabase
      .from('books')
      .select(`
        id,
        title,
        description,
        language,
        cover_image_url,
        created_at,
        profiles!books_author_id_fkey(full_name),
        genres(name),
        ai_reviews(ai_quality_score, view_count),
        book_purchase_links(platform_name, url)
      `)
      .eq('visibility', 'public')
    
    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,profiles.full_name.ilike.%${search}%`)
    }
    
    // Apply genre filter
    if (genre !== 'all') {
      query = query.eq('genres.name', genre)
    }
    
    // Apply language filter
    if (language !== 'all') {
      query = query.eq('language', language)
    }
    
    // Apply minimum score filter
    if (minScore > 0) {
      query = query.gte('ai_reviews.ai_quality_score', minScore)
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'title':
        query = query.order('title')
        break
      case 'author':
        query = query.order('profiles(full_name)')
        break
      case 'date':
        query = query.order('created_at', { ascending: false })
        break
      case 'score':
      default:
        query = query.order('ai_reviews(ai_quality_score)', { ascending: false })
        break
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1)
    
    const { data: books, error } = await query
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 })
    }
    
    // Transform the data to match the expected format
    const transformedBooks = books?.map(book => ({
      id: book.id,
      title: book.title,
      author: book.profiles?.full_name || 'Unknown Author',
      genre: book.genres?.name || 'Unknown',
      score: book.ai_reviews?.[0]?.ai_quality_score || 0,
      language: book.language,
      reviewDate: new Date(book.created_at).toLocaleDateString(),
      views: book.ai_reviews?.[0]?.view_count || 0,
      cover: book.cover_image_url || '/placeholder.svg?height=300&width=200&text=Book+Cover',
      summary: book.description || 'No description available.',
      buyLinks: book.book_purchase_links?.map(link => link.platform_name) || []
    })) || []
    
    // Get total count for pagination
    const { count } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true })
      .eq('visibility', 'public')
    
    return NextResponse.json({
      books: transformedBooks,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}