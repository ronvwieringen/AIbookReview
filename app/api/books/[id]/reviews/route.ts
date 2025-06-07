import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { getReaderReviews, createReaderReview } from "@/lib/api/reviews";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const result = await getReaderReviews(bookId, page, limit);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error in GET /api/books/${params.id}/reviews:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const bookId = params.id;
    const reviewData = await request.json();
    
    // Set the user ID and book ID
    reviewData.user_id = session.user.id;
    reviewData.book_id = bookId;
    
    // Validate rating
    if (!reviewData.rating || reviewData.rating < 0.5 || reviewData.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 0.5 and 5' },
        { status: 400 }
      );
    }
    
    const newReview = await createReaderReview(reviewData);
    
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error(`Error in POST /api/books/${params.id}/reviews:`, error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}