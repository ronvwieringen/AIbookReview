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
        // Extract text from DOCX with additional error handling
        try {
          console.log(`Processing DOCX file: ${file.name}, size: ${file.size} bytes`);
          const result = await mammoth.extractRawText({ buffer });
          text = result.value;
          extractionMethod = 'mammoth (DOCX)';
          console.log(`DOCX extraction successful, text length: ${text.length}`);
        } catch (mammothError) {
          console.error('Mammoth extraction failed:', mammothError);
          // Fallback to basic text extraction
          text = buffer.toString('utf-8');
          extractionMethod = 'fallback after mammoth error';
        }
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        // Extract text from PDF with additional error handling
        try {
          console.log(`Processing PDF file: ${file.name}, size: ${file.size} bytes`);
          
          // Add buffer size validation for PDF
          if (buffer.length > 50 * 1024 * 1024) { // 50MB limit
            throw new Error('PDF file too large for processing');
          }
          
          const pdfData = await pdfParse(buffer, {
            // Add options to prevent memory issues
            max: 0, // No page limit
            version: 'v1.10.100' // Specify version for stability
          });
          text = pdfData.text;
          extractionMethod = 'pdf-parse (PDF)';
          console.log(`PDF extraction successful, text length: ${text.length}`);
        } catch (pdfError) {
          console.error('PDF extraction failed:', pdfError);
          // Fallback to basic text extraction
          text = buffer.toString('utf-8');
          extractionMethod = 'fallback after pdf error';
        }
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
      
      // Enhanced error logging for memory access errors
      if (extractionError instanceof Error) {
        console.error('Error details:', {
          name: extractionError.name,
          message: extractionError.message,
          stack: extractionError.stack,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        });
        
        // Check for specific error types
        if (extractionError.message.includes('memory access out of bounds') || 
            extractionError.name === 'RuntimeError') {
          return NextResponse.json(
            { 
              error: 'File processing failed due to memory constraints',
              details: 'The file may be corrupted or too complex to process. Please try a different file format or a smaller file.',
              fileInfo: {
                name: file.name,
                size: file.size,
                type: file.type
              }
            },
            { status: 422 }
          );
        }
      }
      
      // Final fallback to basic text extraction
      try {
        text = buffer.toString('utf-8');
        extractionMethod = 'fallback (basic)';
      } catch (fallbackError) {
        console.error('Even fallback extraction failed:', fallbackError);
        return NextResponse.json(
          { 
            error: 'Unable to extract text from file',
            details: 'The file format is not supported or the file is corrupted.',
            fileInfo: {
              name: file.name,
              size: file.size,
              type: file.type
            }
          },
          { status: 422 }
        );
      }
    }

    // Validate extracted text
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { 
          error: 'No text content found in file',
          details: 'The file appears to be empty or contains no readable text.',
          extractionMethod
        },
        { status: 422 }
      );
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

    // Validate word count
    if (wordCount === 0) {
      return NextResponse.json(
        { 
          error: 'No readable words found in file',
          details: 'The file does not contain any recognizable text content.',
          extractionMethod
        },
        { status: 422 }
      );
    }

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

    console.log(`Analysis completed successfully for ${file.name}: ${wordCount} words, ${category}`);

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
    
    // Enhanced error response with more details
    const errorResponse = {
      error: 'Failed to analyze manuscript',
      details: error instanceof Error ? error.message : 'Unknown error occurred during file processing'
    };

    // Add specific error handling for different error types
    if (error instanceof Error) {
      if (error.message.includes('memory access out of bounds') || 
          error.name === 'RuntimeError') {
        errorResponse.details = 'Memory error during file processing. The file may be corrupted or too large.';
      } else if (error.message.includes('ENOMEM')) {
        errorResponse.details = 'Insufficient memory to process this file. Please try a smaller file.';
      }
    }

    return NextResponse.json(errorResponse, { status: 500 });
  }
}