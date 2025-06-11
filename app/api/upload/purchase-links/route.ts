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
    const { bookId, purchaseLinks } = body

    if (!bookId || !Array.isArray(purchaseLinks)) {
      return NextResponse.json({ 
        error: 'Book ID and purchase links array are required' 
      }, { status: 400 })
    }

    // Verify user owns the book
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('author_id')
      .eq('id', bookId)
      .single()

    if (bookError || !book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    if (book.author_id !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Delete existing purchase links for this book
    await supabase
      .from('book_purchase_links')
      .delete()
      .eq('book_id', bookId)

    // Insert new purchase links
    if (purchaseLinks.length > 0) {
      const linksToInsert = purchaseLinks
        .filter((link: any) => link.name && link.url)
        .map((link: any) => ({
          book_id: bookId,
          platform_name: link.name,
          url: link.url
        }))

      if (linksToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('book_purchase_links')
          .insert(linksToInsert)

        if (insertError) {
          console.error('Purchase links insert error:', insertError)
          return NextResponse.json({ 
            error: 'Failed to save purchase links' 
          }, { status: 500 })
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Purchase links updated successfully',
      linksCount: purchaseLinks.length
    })

  } catch (error) {
    console.error('Purchase links API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServer()
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get('bookId')

    if (!bookId) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 })
    }

    // Check authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Verify user owns the book
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('author_id')
      .eq('id', bookId)
      .single()

    if (bookError || !book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    if (book.author_id !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get purchase links
    const { data: links, error: linksError } = await supabase
      .from('book_purchase_links')
      .select('platform_name, url')
      .eq('book_id', bookId)
      .order('platform_name')

    if (linksError) {
      console.error('Purchase links fetch error:', linksError)
      return NextResponse.json({ 
        error: 'Failed to fetch purchase links' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      purchaseLinks: links?.map(link => ({
        name: link.platform_name,
        url: link.url
      })) || []
    })

  } catch (error) {
    console.error('Purchase links GET error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}