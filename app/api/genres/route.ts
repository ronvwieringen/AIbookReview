import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createSupabaseServer()
    
    const { data: genres, error } = await supabase
      .from('genres')
      .select('id, name')
      .order('name')
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch genres' }, { status: 500 })
    }
    
    return NextResponse.json(genres || [])
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}