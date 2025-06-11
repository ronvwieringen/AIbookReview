import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServer()
    
    // Check authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { manuscriptText, language = 'english' } = body

    if (!manuscriptText) {
      return NextResponse.json({ error: 'Manuscript text is required' }, { status: 400 })
    }

    // For now, we'll simulate metadata extraction
    // In the future, this would call the actual AI service
    const extractedMetadata = await simulateMetadataExtraction(manuscriptText)

    return NextResponse.json({
      success: true,
      metadata: extractedMetadata
    })

  } catch (error) {
    console.error('Metadata extraction error:', error)
    return NextResponse.json({ 
      error: 'Failed to extract metadata' 
    }, { status: 500 })
  }
}

// Simulate metadata extraction (replace with actual AI call later)
async function simulateMetadataExtraction(text: string) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Extract some basic info from the text
  const wordCount = text.split(/\s+/).length
  const firstSentence = text.split('.')[0]?.substring(0, 100) + '...'
  
  // Determine likely genre based on keywords
  const genres = {
    'science fiction': ['space', 'robot', 'future', 'technology', 'alien', 'quantum'],
    'fantasy': ['magic', 'dragon', 'wizard', 'kingdom', 'sword', 'spell'],
    'romance': ['love', 'heart', 'kiss', 'relationship', 'wedding', 'passion'],
    'mystery': ['murder', 'detective', 'clue', 'investigation', 'suspect', 'crime'],
    'thriller': ['danger', 'chase', 'escape', 'threat', 'suspense', 'action']
  }

  let detectedGenre = 'Fiction'
  let maxMatches = 0

  for (const [genre, keywords] of Object.entries(genres)) {
    const matches = keywords.filter(keyword => 
      text.toLowerCase().includes(keyword)
    ).length
    
    if (matches > maxMatches) {
      maxMatches = matches
      detectedGenre = genre.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    }
  }

  return {
    title: extractTitleFromText(text),
    genre: detectedGenre,
    estimatedWordCount: wordCount,
    summary: firstSentence,
    themes: extractThemes(text),
    language: 'english',
    complexity: wordCount > 50000 ? 'advanced' : wordCount > 20000 ? 'intermediate' : 'elementary'
  }
}

function extractTitleFromText(text: string): string {
  // Try to extract title from first line or chapter heading
  const lines = text.split('\n').filter(line => line.trim())
  const firstLine = lines[0]?.trim()
  
  if (firstLine && firstLine.length < 100 && !firstLine.includes('.')) {
    return firstLine
  }
  
  // Look for "Chapter 1" or similar and use the line before it
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().includes('chapter 1') && i > 0) {
      return lines[i - 1].trim()
    }
  }
  
  return 'Untitled Manuscript'
}

function extractThemes(text: string): string[] {
  const themeKeywords = {
    'love': ['love', 'romance', 'relationship', 'heart'],
    'adventure': ['journey', 'quest', 'adventure', 'travel'],
    'family': ['family', 'mother', 'father', 'parent', 'child'],
    'friendship': ['friend', 'friendship', 'companion', 'ally'],
    'betrayal': ['betray', 'deceive', 'lie', 'cheat'],
    'redemption': ['redeem', 'forgive', 'second chance', 'atone'],
    'power': ['power', 'control', 'authority', 'rule'],
    'identity': ['identity', 'self', 'who am i', 'discover']
  }

  const themes: string[] = []
  const lowerText = text.toLowerCase()

  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    const matches = keywords.filter(keyword => lowerText.includes(keyword)).length
    if (matches >= 2) {
      themes.push(theme)
    }
  }

  return themes.slice(0, 5) // Return max 5 themes
}