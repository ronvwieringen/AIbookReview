import { NextRequest, NextResponse } from "next/server";
import { run, get } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check if prompt exists
    const existingPrompt = await get(
      'SELECT id FROM prompts WHERE id = ?',
      [id]
    );

    if (!existingPrompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }

    // Update the prompt
    await run(`
      UPDATE prompts SET 
        name = ?, 
        type = ?, 
        book_type = ?, 
        prompt_text = ?, 
        variables = ?, 
        is_active = ?, 
        updated_at = datetime('now')
      WHERE id = ?
    `, [
      promptData.name,
      promptData.type,
      promptData.book_type || null,
      promptData.prompt_text,
      JSON.stringify(promptData.variables || []),
      promptData.is_active ? 1 : 0,
      id
    ]);

    // Get the updated prompt
    const updatedPrompt = await get(
      'SELECT * FROM prompts WHERE id = ?',
      [id]
    );

    if (updatedPrompt) {
      updatedPrompt.variables = JSON.parse(updatedPrompt.variables || '[]');
      updatedPrompt.lastModified = new Date(updatedPrompt.updated_at).toLocaleDateString();
    }

    return NextResponse.json(updatedPrompt);
  } catch (error) {
    console.error('Error updating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to update prompt' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if prompt exists
    const existingPrompt = await get(
      'SELECT id FROM prompts WHERE id = ?',
      [id]
    );

    if (!existingPrompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }

    // Delete the prompt
    await run(
      'DELETE FROM prompts WHERE id = ?',
      [id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    return NextResponse.json(
      { error: 'Failed to delete prompt' },
      { status: 500 }
    );
  }
}