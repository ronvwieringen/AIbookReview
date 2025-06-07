import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getBookById, updateBook, deleteBook } from "@/lib/api/books";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id;
    const book = await getBookById(bookId);
    
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(book);
  } catch (error) {
    console.error(`Error in GET /api/books/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch book' },
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

    const bookId = params.id;
    const bookData = await request.json();
    
    // Get the current book to check permissions
    const currentBook = await getBookById(bookId);
    
    if (!currentBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the author of the book or an admin
    if (currentBook.author_id !== session.user.id && session.user.role !== 'PlatformAdmin') {
      return NextResponse.json(
        { error: 'You do not have permission to update this book' },
        { status: 403 }
      );
    }
    
    // Don't allow changing the author
    delete bookData.author_id;
    
    const updatedBook = await updateBook(bookId, bookData);
    
    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error(`Error in PUT /api/books/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    
    // Get the current book to check permissions
    const currentBook = await getBookById(bookId);
    
    if (!currentBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the author of the book or an admin
    if (currentBook.author_id !== session.user.id && session.user.role !== 'PlatformAdmin') {
      return NextResponse.json(
        { error: 'You do not have permission to delete this book' },
        { status: 403 }
      );
    }
    
    await deleteBook(bookId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error in DELETE /api/books/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    );
  }
}