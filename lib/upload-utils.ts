// Utility functions for upload processing

export interface UploadMetadata {
  title: string
  author: string
  genre: string
  language: string
  description: string
  keywords: string[]
  publisher: string
  bookType: 'fiction' | 'nonfiction'
}

export interface FileProcessingResult {
  success: boolean
  fileName: string
  fileSize: number
  fileType: string
  extractedText: string
  wordCount: number
  characterCount: number
  error?: string
}

export interface UploadProgress {
  step: 'uploading' | 'extracting' | 'analyzing' | 'saving' | 'complete'
  progress: number
  message: string
}

export const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain'
]

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export function validateFileType(file: File): boolean {
  return SUPPORTED_FILE_TYPES.includes(file.type)
}

export function validateFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getFileTypeLabel(mimeType: string): string {
  switch (mimeType) {
    case 'application/pdf':
      return 'PDF Document'
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'Word Document (.docx)'
    case 'application/msword':
      return 'Word Document (.doc)'
    case 'text/plain':
      return 'Text File'
    default:
      return 'Unknown File Type'
  }
}

export function estimateReadingTime(wordCount: number): string {
  const wordsPerMinute = 200 // Average reading speed
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  
  if (minutes < 60) {
    return `${minutes} min read`
  } else {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m read`
  }
}

export function validateMetadata(metadata: Partial<UploadMetadata>): string[] {
  const errors: string[] = []
  
  if (!metadata.title?.trim()) {
    errors.push('Title is required')
  }
  
  if (!metadata.author?.trim()) {
    errors.push('Author name is required')
  }
  
  if (!metadata.genre?.trim()) {
    errors.push('Genre is required')
  }
  
  if (metadata.title && metadata.title.length > 200) {
    errors.push('Title must be less than 200 characters')
  }
  
  if (metadata.description && metadata.description.length > 2000) {
    errors.push('Description must be less than 2000 characters')
  }
  
  if (metadata.keywords && metadata.keywords.length > 10) {
    errors.push('Maximum 10 keywords allowed')
  }
  
  return errors
}

export function sanitizeMetadata(metadata: Partial<UploadMetadata>): UploadMetadata {
  return {
    title: metadata.title?.trim() || '',
    author: metadata.author?.trim() || '',
    genre: metadata.genre?.trim() || '',
    language: metadata.language?.trim() || 'english',
    description: metadata.description?.trim() || '',
    keywords: metadata.keywords?.filter(k => k.trim()).slice(0, 10) || [],
    publisher: metadata.publisher?.trim() || '',
    bookType: metadata.bookType === 'nonfiction' ? 'nonfiction' : 'fiction'
  }
}

// Mock AI analysis for development
export function generateMockAIAnalysis(text: string, metadata: UploadMetadata) {
  const wordCount = text.split(/\s+/).length
  
  // Generate a score based on text length and complexity
  const baseScore = Math.min(95, Math.max(60, 70 + (wordCount / 1000)))
  const randomVariation = (Math.random() - 0.5) * 10
  const finalScore = Math.round(Math.max(50, Math.min(100, baseScore + randomVariation)))
  
  return {
    ai_quality_score: finalScore,
    plot_score: Math.max(50, finalScore + Math.round((Math.random() - 0.5) * 20)),
    character_score: Math.max(50, finalScore + Math.round((Math.random() - 0.5) * 15)),
    writing_style_score: Math.max(50, finalScore + Math.round((Math.random() - 0.5) * 10)),
    pacing_score: Math.max(50, finalScore + Math.round((Math.random() - 0.5) * 25)),
    world_building_score: Math.max(50, finalScore + Math.round((Math.random() - 0.5) * 20)),
    summary_single_line: `A ${metadata.genre.toLowerCase()} work exploring themes of ${metadata.keywords.slice(0, 3).join(', ')}.`,
    summary_100_word: `This ${metadata.genre.toLowerCase()} manuscript demonstrates ${finalScore >= 80 ? 'strong' : finalScore >= 70 ? 'good' : 'developing'} writing craft. The narrative ${finalScore >= 85 ? 'effectively' : 'adequately'} explores its central themes while maintaining reader engagement. Character development shows ${finalScore >= 80 ? 'depth and nuance' : 'promise with room for growth'}. The pacing ${finalScore >= 75 ? 'keeps readers engaged throughout' : 'varies but generally maintains interest'}. Overall, this work ${finalScore >= 85 ? 'represents quality storytelling' : finalScore >= 70 ? 'shows solid potential' : 'demonstrates developing skills'} in the ${metadata.genre.toLowerCase()} genre.`,
    ai_analysis: {
      strengths: [
        finalScore >= 80 ? "Compelling narrative voice" : "Developing narrative voice",
        finalScore >= 85 ? "Well-developed characters" : "Interesting character concepts",
        finalScore >= 75 ? "Engaging plot structure" : "Clear story progression"
      ],
      improvements: [
        finalScore < 80 ? "Character development could be deeper" : "Minor pacing adjustments",
        finalScore < 75 ? "Plot structure needs refinement" : "Some dialogue could be tightened",
        finalScore < 85 ? "Descriptive passages could be enhanced" : "Consider expanding certain scenes"
      ],
      themes: metadata.keywords.slice(0, 5),
      target_audience: `${metadata.genre} enthusiasts`,
      marketability: finalScore >= 85 ? "Strong commercial potential" : finalScore >= 70 ? "Good market appeal" : "Niche market potential"
    }
  }
}