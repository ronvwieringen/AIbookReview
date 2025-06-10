import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getUser() {
  const supabase = createSupabaseServer()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

export async function getUserProfile() {
  const supabase = createSupabaseServer()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return null
  }
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (profileError) {
    return null
  }
  
  return { user, profile }
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function requireRole(role: 'reader' | 'author' | 'admin') {
  const userProfile = await getUserProfile()
  if (!userProfile || userProfile.profile.role !== role) {
    redirect('/unauthorized')
  }
  return userProfile
}

export async function requireAdmin() {
  return requireRole('admin')
}