import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { getAIReview, addAuthorResponseToAIReview } from "@/lib/api/reviews";
import { submitBookForAIReview } from "@/lib/api/books";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id;
    const aiReview = await getAIReview(bookId);
    
    if (!aiReview) {
      return NextResponse.json(
        { error: 'AI review not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(aiReview);
  } catch (error) {
    console.error(`Error in GET /api/books/${params.id}/ai-review:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch AI review' },
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
    const requestData = await request.json();
    
    // Check if this is a request to submit for AI review
    if (requestData.action === 'submit') {
      // Check if user is the author of the book or an admin
      // This check would be more robust in a real implementation
      if (session.user.role !== 'Author' && session.user.role !== 'PlatformAdmin') {
        return NextResponse.json(
          { error: 'Only authors can submit books for AI review' },
          { status: 403 }
        );
      }
      
      const result = await submitBookForAIReview(bookId);
      return NextResponse.json(result);
    }
    
    // Check if this is a request to add author response
    if (requestData.action === 'respond' && requestData.response) {
      // Check if user is the author of the book or an admin
      // This check would be more robust in a real implementation
      if (session.user.role !== 'Author' && session.user.role !== 'PlatformAdmin') {
        return NextResponse.json(
          { error: 'Only authors can respond to AI reviews' },
          { status: 403 }
        );
      }
      
      const result = await addAuthorResponseToAIReview(bookId, requestData.response);
      return NextResponse.json(result);
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error(`Error in POST /api/books/${params.id}/ai-review:`, error);
    return NextResponse.json(
      { error: 'Failed to process AI review request' },
      { status: 500 }
    );
  }
}