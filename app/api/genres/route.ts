import { NextRequest, NextResponse } from "next/server";
import { all, run } from "@/lib/db";

export async function GET() {
  try {
    const genres = await all(
      'SELECT * FROM genres ORDER BY name ASC',
      []
    );
    
    return NextResponse.json(genres);
  } catch (error) {
    console.error('Error in GET /api/genres:', error);
    return NextResponse.json(
      { error: 'Failed to fetch genres' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Genre name is required' },
        { status: 400 }
      );
    }
    
    // Check if genre already exists
    const existingGenre = await all(
      'SELECT * FROM genres WHERE name = ?',
      [name]
    );
    
    if (existingGenre.length > 0) {
      return NextResponse.json(
        { error: 'Genre already exists' },
        { status: 400 }
      );
    }
    
    // Insert new genre
    const result = await run(
      'INSERT INTO genres (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    
    // Get the created genre
    const newGenre = await all(
      'SELECT * FROM genres WHERE id = ?',
      [result.lastID]
    );
    
    return NextResponse.json(newGenre[0], { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/genres:', error);
    return NextResponse.json(
      { error: 'Failed to create genre' },
      { status: 500 }
    );
  }
}