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

    const body = await request.json()
    const { bookId, isPublic } = body

    if (!bookId || typeof isPublic !== 'boolean') {
      return NextResponse.json({ 
        error: 'Book ID and visibility status are required' 
      }, { status: 400 })
    }

    // Verify user owns the book
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('author_id, ai_reviews(status, ai_quality_score)')
      .eq('id', bookId)
      .single()

    if (bookError || !book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    if (book.author_id !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Check if book has completed AI review before making it public
    if (isPublic) {
      const aiReview = book.ai_reviews?.[0]
      if (!aiReview || aiReview.status !== 'completed') {
        return NextResponse.json({ 
          error: 'Book must have a completed AI review before it can be made public' 
        }, { status: 400 })
      }
    }

    // Update book visibility
    const { error: updateError } = await supabase
      .from('books')
      .update({ visibility: isPublic ? 'public' : 'private' })
      .eq('id', bookId)

    if (updateError) {
      console.error('Visibility update error:', updateError)
      return NextResponse.json({ 
        error: 'Failed to update book visibility' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Book ${isPublic ? 'published' : 'made private'} successfully`,
      visibility: isPublic ? 'public' : 'private'
    })

  } catch (error) {
    console.error('Visibility API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}