import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { getBooks, createBook } from "@/lib/api/books";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    
    // Parse filters
    const genres = searchParams.get('genres')?.split(',') || [];
    const languages = searchParams.get('languages')?.split(',') || [];
    const keywords = searchParams.get('keywords')?.split(',') || [];
    const searchTerm = searchParams.get('search') || undefined;
    
    const qualityScoreMin = parseInt(searchParams.get('qualityScoreMin') || '0');
    const qualityScoreMax = parseInt(searchParams.get('qualityScoreMax') || '100');
    const qualityScoreRange: [number, number] = [qualityScoreMin, qualityScoreMax];
    
    const ratingMin = parseFloat(searchParams.get('ratingMin') || '0');
    const ratingMax = parseFloat(searchParams.get('ratingMax') || '5');
    const readerRatingRange: [number, number] = [ratingMin, ratingMax];

    const filters = {
      genres: genres.length > 0 ? genres : undefined,
      languages: languages.length > 0 ? languages : undefined,
      qualityScoreRange,
      readerRatingRange,
      keywords: keywords.length > 0 ? keywords : undefined,
      searchTerm,
    };

    const result = await getBooks(page, limit, filters, sortBy, sortOrder);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is an author
    if (session.user.role !== 'Author') {
      return NextResponse.json(
        { error: 'Only authors can create books' },
        { status: 403 }
      );
    }

    const bookData = await request.json();
    
    // Set the author ID to the current user
    bookData.author_id = session.user.id;
    
    // Set default values
    bookData.status = 'Draft';
    bookData.average_reader_rating = 0;
    bookData.reader_review_count = 0;
    bookData.has_author_responded_to_ai_review = false;

    const newBook = await createBook(bookData);
    
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/books:', error);
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    );
  }
}