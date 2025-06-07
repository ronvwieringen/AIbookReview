/**
 * Word counting utilities for manuscript files
 * Supports PDF, DOCX, TXT, and MD files
 */

// Simple word counting for text content
export function countWords(text: string): number {
  if (!text || text.trim().length === 0) {
    return 0;
  }
  
  // Remove extra whitespace and split by whitespace
  const words = text
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .split(' ')
    .filter(word => word.length > 0);
  
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
      // For PDF files, we'll need a simple text extraction
      // Note: This is a basic implementation. For production, consider using pdf-parse or similar
      const arrayBuffer = await file.arrayBuffer();
      const text = await extractTextFromPDF(arrayBuffer);
      return text;
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      // For DOCX files, we'll extract text content
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

// Basic PDF text extraction (simplified)
async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  // This is a very basic PDF text extraction
  // In a real application, you'd want to use a proper PDF parsing library
  const uint8Array = new Uint8Array(arrayBuffer);
  const text = new TextDecoder('utf-8').decode(uint8Array);
  
  // Very basic text extraction - look for text between parentheses and brackets
  // This is not comprehensive but will work for simple PDFs
  const textMatches = text.match(/\((.*?)\)/g) || [];
  const extractedText = textMatches
    .map(match => match.slice(1, -1)) // Remove parentheses
    .join(' ');
  
  // If no text found with basic method, try to extract readable characters
  if (extractedText.length < 50) {
    const readableText = text.replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim();
    return readableText.length > extractedText.length ? readableText : extractedText;
  }
  
  return extractedText;
}

// Basic DOCX text extraction (simplified)
async function extractTextFromDOCX(arrayBuffer: ArrayBuffer): Promise<string> {
  // This is a very basic DOCX text extraction
  // In a real application, you'd want to use a proper DOCX parsing library like mammoth.js
  const uint8Array = new Uint8Array(arrayBuffer);
  const text = new TextDecoder('utf-8').decode(uint8Array);
  
  // Look for XML text content patterns common in DOCX files
  const xmlTextMatches = text.match(/>([^<]+)</g) || [];
  const extractedText = xmlTextMatches
    .map(match => match.slice(1, -1)) // Remove > and <
    .filter(text => text.trim().length > 0 && !text.match(/^[0-9\s]*$/)) // Filter out numbers and whitespace
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