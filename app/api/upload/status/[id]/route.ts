import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServer()
    const bookId = params.id
    
    // Check authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Get book and review status
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select(`
        id,
        title,
        author_id,
        created_at,
        ai_reviews(
          id,
          status,
          ai_quality_score,
          ai_analysis,
          created_at,
          updated_at
        )
      `)
      .eq('id', bookId)
      .single()

    if (bookError || !book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    // Check if user owns this book
    if (book.author_id !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const aiReview = book.ai_reviews?.[0]
    
    return NextResponse.json({
      bookId: book.id,
      title: book.title,
      status: aiReview?.status || 'pending',
      score: aiReview?.ai_quality_score,
      reviewId: aiReview?.id,
      createdAt: book.created_at,
      updatedAt: aiReview?.updated_at || book.created_at,
      processingTime: aiReview ? 
        Math.round((new Date(aiReview.updated_at).getTime() - new Date(aiReview.created_at).getTime()) / 1000) : 
        null
    })

  } catch (error) {
    console.error('Status API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}