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
        book_purchase_links(platform_name, url),
        book_keywords(
          keywords(name)
        )
      `)
      .eq('id', bookId)
      .eq('visibility', 'public')
      .single()
    
    if (error) {
      console.error('Database error:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Book not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 })
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
        strengths: aiReview?.ai_analysis?.strengths || [
          'Engaging narrative structure',
          'Well-developed characters',
          'Compelling themes'
        ],
        improvements: aiReview?.ai_analysis?.improvements || [
          'Some areas could benefit from further development',
          'Pacing could be refined in certain sections'
        ],
        writingStyle: aiReview?.ai_analysis?.writingStyle || 'The writing demonstrates solid craft with clear prose and engaging storytelling techniques.',
        characterAnalysis: aiReview?.ai_analysis?.characterAnalysis || 'Characters are well-conceived with distinct voices and believable motivations.',
        thematicElements: aiReview?.ai_analysis?.thematicElements || 'The work explores meaningful themes that resonate with readers.',
        conclusion: aiReview?.ai_analysis?.conclusion || 'This is a well-crafted work that demonstrates strong storytelling abilities.',
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
      keywords: book.book_keywords?.map(bk => bk.keywords?.name).filter(Boolean) || []
    }
    
    return NextResponse.json(transformedBook)
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}