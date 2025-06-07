import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = '';
    let extractionMethod = '';

    try {
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        // Extract text from DOCX
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
        extractionMethod = 'mammoth (DOCX)';
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        // Extract text from PDF
        const pdfData = await pdfParse(buffer);
        text = pdfData.text;
        extractionMethod = 'pdf-parse (PDF)';
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        // Plain text file
        text = buffer.toString('utf-8');
        extractionMethod = 'direct (TXT)';
      } else if (file.type === 'text/markdown' || file.name.endsWith('.md')) {
        // Markdown file
        text = buffer.toString('utf-8');
        extractionMethod = 'direct (MD)';
      } else {
        // Fallback: try to read as text
        text = buffer.toString('utf-8');
        extractionMethod = 'fallback (text)';
      }
    } catch (extractionError) {
      console.error('Text extraction failed:', extractionError);
      // Fallback to basic text extraction
      text = buffer.toString('utf-8');
      extractionMethod = 'fallback (basic)';
    }

    // Clean and count words
    const cleanText = text
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/[^\w\s'-]/g, ' ') // Remove punctuation except apostrophes and hyphens
      .trim();

    const words = cleanText
      .split(/\s+/)
      .filter(word => word.length > 0 && /[a-zA-Z]/.test(word));

    const wordCount = words.length;

    // Calculate reading time (average 200 words per minute)
    const readingTimeMinutes = Math.ceil(wordCount / 200);

    // Determine manuscript category based on word count
    let category = '';
    if (wordCount < 1000) {
      category = 'Short piece';
    } else if (wordCount < 7500) {
      category = 'Short story';
    } else if (wordCount < 20000) {
      category = 'Novelette';
    } else if (wordCount < 50000) {
      category = 'Novella';
    } else if (wordCount < 120000) {
      category = 'Novel';
    } else {
      category = 'Epic novel';
    }

    return NextResponse.json({
      success: true,
      analysis: {
        wordCount,
        readingTimeMinutes,
        category,
        extractionMethod,
        fileSize: file.size,
        fileName: file.name,
        fileType: file.type
      }
    });

  } catch (error) {
    console.error('Manuscript analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze manuscript',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}