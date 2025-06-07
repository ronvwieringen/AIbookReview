/**
 * Word counting utilities for manuscript files
 * Supports PDF, DOCX, TXT, and MD files with proper text extraction
 */

// Simple word counting for text content
export function countWords(text: string): number {
  if (!text || text.trim().length === 0) {
    return 0;
  }
  
  // Remove extra whitespace, newlines, and split by whitespace
  const words = text
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces/newlines with single space
    .replace(/[^\w\s'-]/g, ' ') // Replace punctuation with spaces (keep apostrophes and hyphens)
    .split(' ')
    .filter(word => word.trim().length > 0 && /\w/.test(word)); // Filter out empty strings and non-word characters
  
  return words.length;
}

// Extract text content from different file types
export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  
  try {
    if (fileType === 'text/plain' || fileName.endsWith('.txt') || fileName.endsWith('.md')) {
      // Handle plain text and markdown files
      return await file.text();
    } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      // For PDF files, use pdf-parse library
      const arrayBuffer = await file.arrayBuffer();
      const text = await extractTextFromPDF(arrayBuffer);
      return text;
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      // For DOCX files, use mammoth library
      const arrayBuffer = await file.arrayBuffer();
      const text = await extractTextFromDOCX(arrayBuffer);
      return text;
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error('Failed to extract text from file');
  }
}

// PDF text extraction using pdf-parse
async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    // Dynamic import to avoid SSR issues
    const pdfParse = (await import('pdf-parse')).default;
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdfParse(buffer);
    return data.text || '';
  } catch (error) {
    console.error('Error parsing PDF:', error);
    // Fallback to basic extraction if pdf-parse fails
    return extractTextFromPDFBasic(arrayBuffer);
  }
}

// Basic PDF text extraction fallback
function extractTextFromPDFBasic(arrayBuffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(arrayBuffer);
  const text = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
  
  // Look for text patterns in PDF
  const textMatches = text.match(/\((.*?)\)/g) || [];
  const extractedText = textMatches
    .map(match => match.slice(1, -1))
    .filter(text => text.length > 0 && /[a-zA-Z]/.test(text))
    .join(' ');
  
  if (extractedText.length < 50) {
    // Try to extract readable ASCII characters
    const readableText = text
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return readableText.length > extractedText.length ? readableText : extractedText;
  }
  
  return extractedText;
}

// DOCX text extraction using mammoth
async function extractTextFromDOCX(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    // Dynamic import to avoid SSR issues
    const mammoth = await import('mammoth');
    const buffer = Buffer.from(arrayBuffer);
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    // Fallback to basic extraction if mammoth fails
    return extractTextFromDOCXBasic(arrayBuffer);
  }
}

// Basic DOCX text extraction fallback
function extractTextFromDOCXBasic(arrayBuffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(arrayBuffer);
  const text = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
  
  // Look for XML text content patterns in DOCX
  const xmlTextMatches = text.match(/>([^<]+)</g) || [];
  const extractedText = xmlTextMatches
    .map(match => match.slice(1, -1))
    .filter(text => {
      const trimmed = text.trim();
      return trimmed.length > 2 && 
             /[a-zA-Z]/.test(trimmed) && 
             !trimmed.match(/^[0-9\s\-_\.]+$/) &&
             !trimmed.includes('xml') &&
             !trimmed.includes('http');
    })
    .join(' ');
  
  return extractedText;
}

// Get estimated reading time based on word count
export function getEstimatedReadingTime(wordCount: number): string {
  const wordsPerMinute = 250; // Average reading speed
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  if (minutes < 60) {
    return `${minutes} min read`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hr read`;
    } else {
      return `${hours}h ${remainingMinutes}m read`;
    }
  }
}

// Categorize manuscript length
export function getManuscriptCategory(wordCount: number): string {
  if (wordCount < 1000) {
    return "Short piece";
  } else if (wordCount < 7500) {
    return "Short story";
  } else if (wordCount < 20000) {
    return "Novelette";
  } else if (wordCount < 50000) {
    return "Novella";
  } else if (wordCount < 110000) {
    return "Novel";
  } else {
    return "Epic novel";
  }
}