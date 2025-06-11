import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServer()
    
    // Check authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check user role (must be author or admin)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    if (profile.role !== 'author' && profile.role !== 'admin') {
      return NextResponse.json({ error: 'Author or admin role required' }, { status: 403 })
    }

    // Parse the request body
    const body = await request.json()
    const { 
      title, 
      author, 
      genre, 
      language = 'english',
      description, 
      keywords = [], 
      publisher,
      bookType = 'fiction',
      manuscriptText // This would be the extracted text from the uploaded file
    } = body

    // Validate required fields
    if (!title || !author || !genre || !manuscriptText) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, author, genre, and manuscript text are required' 
      }, { status: 400 })
    }

    // Find genre ID
    const { data: genreData, error: genreError } = await supabase
      .from('genres')
      .select('id')
      .eq('name', genre)
      .single()

    if (genreError || !genreData) {
      return NextResponse.json({ error: 'Invalid genre specified' }, { status: 400 })
    }

    // Create the book record
    const { data: book, error: bookError } = await supabase
      .from('books')
      .insert({
        title,
        author_id: session.user.id,
        genre_id: genreData.id,
        language,
        book_type: bookType,
        description,
        publisher,
        visibility: 'private', // Default to private until review is complete
        cover_image_url: `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(title)}`
      })
      .select('*')
      .single()

    if (bookError) {
      console.error('Book creation error:', bookError)
      return NextResponse.json({ error: 'Failed to create book record' }, { status: 500 })
    }

    // Handle keywords
    if (keywords.length > 0) {
      // Insert keywords that don't exist
      const keywordInserts = keywords.map((keyword: string) => ({ name: keyword.toLowerCase() }))
      await supabase
        .from('keywords')
        .upsert(keywordInserts, { onConflict: 'name' })

      // Get keyword IDs
      const { data: keywordData, error: keywordError } = await supabase
        .from('keywords')
        .select('id, name')
        .in('name', keywords.map((k: string) => k.toLowerCase()))

      if (!keywordError && keywordData) {
        // Link keywords to book
        const bookKeywordLinks = keywordData.map(kw => ({
          book_id: book.id,
          keyword_id: kw.id
        }))

        await supabase
          .from('book_keywords')
          .insert(bookKeywordLinks)
      }
    }

    // Create initial AI review record (status: processing)
    const { data: aiReview, error: reviewError } = await supabase
      .from('ai_reviews')
      .insert({
        book_id: book.id,
        status: 'processing',
        ai_analysis: {
          manuscriptText: manuscriptText.substring(0, 10000), // Store first 10k chars for reference
          processingStarted: new Date().toISOString()
        }
      })
      .select('*')
      .single()

    if (reviewError) {
      console.error('AI review creation error:', reviewError)
      // Don't fail the entire request, but log the error
    }

    // Return success response with book and review IDs
    return NextResponse.json({
      success: true,
      bookId: book.id,
      reviewId: aiReview?.id,
      message: 'Book uploaded successfully and queued for AI analysis',
      book: {
        id: book.id,
        title: book.title,
        status: 'processing'
      }
    })

  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error during upload' 
    }, { status: 500 })
  }
}