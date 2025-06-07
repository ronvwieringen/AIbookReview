import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getAuthorProfile, updateAuthorProfile } from "@/lib/api/users";
import { getAuthorBooks } from "@/lib/api/books";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authorId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const includeBooks = searchParams.get('includeBooks') === 'true';
    
    const authorProfile = await getAuthorProfile(authorId);
    
    if (!authorProfile) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }
    
    let result = { ...authorProfile };
    
    if (includeBooks) {
      const books = await getAuthorBooks(authorId);
      result.books = books;
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error in GET /api/authors/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch author profile' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const authorId = params.id;
    
    // Check if user is updating their own profile or is an admin
    if (authorId !== session.user.id && session.user.role !== 'PlatformAdmin') {
      return NextResponse.json(
        { error: 'You do not have permission to update this profile' },
        { status: 403 }
      );
    }
    
    const authorData = await request.json();
    const updatedProfile = await updateAuthorProfile(authorId, authorData);
    
    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error(`Error in PUT /api/authors/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update author profile' },
      { status: 500 }
    );
  }
}