import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { run, all, get, initDb } from "@/lib/db";

export async function GET() {
  try {
    // Initialize database if needed
    await initDb();

    const prompts = await all(`
      SELECT * FROM prompts 
      ORDER BY type, book_type, name
    `);

    // Parse variables JSON for each prompt
    const parsedPrompts = prompts.map(prompt => ({
      ...prompt,
      variables: prompt.variables ? JSON.parse(prompt.variables) : [],
      lastModified: new Date(prompt.updated_at).toLocaleDateString()
    }));

    return NextResponse.json(parsedPrompts);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const promptData = await request.json();
    
    // Validate required fields
    if (!promptData.name || !promptData.type || !promptData.prompt_text) {
      return NextResponse.json(
        { error: 'Name, type, and prompt text are required' },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ['metadata_extraction', 'initial_review', 'detailed_review'];
    if (!validTypes.includes(promptData.type)) {
      return NextResponse.json(
        { error: 'Invalid prompt type' },
        { status: 400 }
      );
    }

    const promptId = uuidv4();
    const now = new Date().toISOString();

    await run(`
      INSERT INTO prompts (
        id, name, type, book_type, prompt_text, variables, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      promptId,
      promptData.name,
      promptData.type,
      promptData.book_type || null,
      promptData.prompt_text,
      JSON.stringify(promptData.variables || []),
      promptData.is_active ? 1 : 0,
      now,
      now
    ]);

    // Get the created prompt
    const newPrompt = await get(
      'SELECT * FROM prompts WHERE id = ?',
      [promptId]
    );

    if (newPrompt) {
      newPrompt.variables = JSON.parse(newPrompt.variables || '[]');
      newPrompt.lastModified = new Date(newPrompt.updated_at).toLocaleDateString();
    }

    return NextResponse.json(newPrompt, { status: 201 });
  } catch (error) {
    console.error('Error creating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to create prompt' },
      { status: 500 }
    );
  }
}