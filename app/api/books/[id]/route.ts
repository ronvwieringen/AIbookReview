import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServer()
    const bookId = params.id
    
    // Fetch book with all related data
    const { data: book, error } = await supabase
      .from('books')
      .select(`
        id,
        title,
        description,
        language,
        cover_image_url,
        publisher,
        created_at,
        profiles!books_author_id_fkey(full_name),
        genres(name),
        ai_reviews(
          ai_quality_score,
          plot_score,
          character_score,
          writing_style_score,
          pacing_score,
          world_building_score,
          ai_analysis,
          author_response,
          view_count,
          click_count,
          review_date
        ),
        book_purchase_links(platform_name, url)
      `)
      .eq('id', bookId)
      .eq('visibility', 'public')
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }
    
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }
    
    // Increment view count
    if (book.ai_reviews?.[0]) {
      await supabase
        .from('ai_reviews')
        .update({ 
          view_count: (book.ai_reviews[0].view_count || 0) + 1 
        })
        .eq('book_id', bookId)
    }
    
    // Transform the data to match the expected format
    const aiReview = book.ai_reviews?.[0]
    const transformedBook = {
      id: book.id,
      title: book.title,
      author: book.profiles?.full_name || 'Unknown Author',
      genre: book.genres?.name || 'Unknown',
      score: aiReview?.ai_quality_score || 0,
      language: book.language,
      reviewDate: new Date(book.created_at).toLocaleDateString(),
      publisher: book.publisher || 'Independent',
      views: (aiReview?.view_count || 0) + 1, // Include the increment
      cover: book.cover_image_url || '/placeholder.svg?height=500&width=300&text=Book+Cover',
      summary: book.description || 'No description available.',
      description: book.description || 'No description available.',
      aiReview: {
        plotSummary: aiReview?.ai_analysis?.plotSummary || 'AI analysis not available.',
        strengths: aiReview?.ai_analysis?.strengths || [],
        improvements: aiReview?.ai_analysis?.improvements || [],
        writingStyle: aiReview?.ai_analysis?.writingStyle || 'Writing style analysis not available.',
        characterAnalysis: aiReview?.ai_analysis?.characterAnalysis || 'Character analysis not available.',
        thematicElements: aiReview?.ai_analysis?.thematicElements || 'Thematic analysis not available.',
        conclusion: aiReview?.ai_analysis?.conclusion || 'Conclusion not available.',
        scoreBreakdown: {
          plot: aiReview?.plot_score || 0,
          characters: aiReview?.character_score || 0,
          pacing: aiReview?.pacing_score || 0,
          writingStyle: aiReview?.writing_style_score || 0,
          worldBuilding: aiReview?.world_building_score || 0,
          themes: Math.round(((aiReview?.plot_score || 0) + (aiReview?.character_score || 0)) / 2),
          overall: aiReview?.ai_quality_score || 0
        }
      },
      buyLinks: book.book_purchase_links?.map(link => ({
        name: link.platform_name,
        url: link.url
      })) || [],
      authorResponse: aiReview?.author_response || '',
      keywords: [] // TODO: Add keywords when implemented
    }
    
    return NextResponse.json(transformedBook)
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}