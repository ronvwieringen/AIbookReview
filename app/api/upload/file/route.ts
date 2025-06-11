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

    // Check user role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profileError || !profile || (profile.role !== 'author' && profile.role !== 'admin')) {
      return NextResponse.json({ error: 'Author or admin role required' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'text/plain' // .txt
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload a PDF, Word document, or text file.' 
      }, { status: 400 })
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 50MB.' 
      }, { status: 400 })
    }

    // Extract text from file
    let extractedText: string
    try {
      extractedText = await extractTextFromFile(file)
    } catch (error) {
      console.error('Text extraction error:', error)
      return NextResponse.json({ 
        error: 'Failed to extract text from file. Please ensure the file is not corrupted.' 
      }, { status: 400 })
    }

    // Validate extracted text
    if (!extractedText || extractedText.trim().length < 100) {
      return NextResponse.json({ 
        error: 'Insufficient text content. Please ensure your manuscript has at least 100 characters.' 
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      extractedText: extractedText,
      wordCount: extractedText.split(/\s+/).length,
      characterCount: extractedText.length
    })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json({ 
      error: 'Internal server error during file processing' 
    }, { status: 500 })
  }
}

async function extractTextFromFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  
  switch (file.type) {
    case 'text/plain':
      return new TextDecoder().decode(buffer)
    
    case 'application/pdf':
      // For now, return a placeholder. In production, you'd use a PDF parsing library
      return `[PDF content extracted from ${file.name}]\n\nThis is a placeholder for PDF text extraction. In production, this would contain the actual extracted text from the PDF file.`
    
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/msword':
      // For now, return a placeholder. In production, you'd use a Word document parsing library
      return `[Word document content extracted from ${file.name}]\n\nThis is a placeholder for Word document text extraction. In production, this would contain the actual extracted text from the Word document.`
    
    default:
      throw new Error('Unsupported file type')
  }
}