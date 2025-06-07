import { NextRequest, NextResponse } from "next/server";
import { all, run } from "@/lib/db";

export async function GET() {
  try {
    const languages = await all(
      'SELECT * FROM languages ORDER BY name ASC',
      []
    );
    
    return NextResponse.json(languages);
  } catch (error) {
    console.error('Error in GET /api/languages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch languages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, name } = await request.json();
    
    if (!code || !name) {
      return NextResponse.json(
        { error: 'Language code and name are required' },
        { status: 400 }
      );
    }
    
    // Check if language already exists
    const existingLanguage = await all(
      'SELECT * FROM languages WHERE code = ? OR name = ?',
      [code, name]
    );
    
    if (existingLanguage.length > 0) {
      return NextResponse.json(
        { error: 'Language already exists' },
        { status: 400 }
      );
    }
    
    // Insert new language
    const result = await run(
      'INSERT INTO languages (code, name) VALUES (?, ?)',
      [code, name]
    );
    
    // Get the created language
    const newLanguage = await all(
      'SELECT * FROM languages WHERE id = ?',
      [result.lastID]
    );
    
    return NextResponse.json(newLanguage[0], { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/languages:', error);
    return NextResponse.json(
      { error: 'Failed to create language' },
      { status: 500 }
    );
  }
}