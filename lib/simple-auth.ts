"use client"

export interface SimpleUser {
  id: string
  name: string
  email: string
  role: string
}

export interface SimpleSession {
  user: SimpleUser
  expires: string
}

export function getSimpleSession(): SimpleSession | null {
  if (typeof window === "undefined") return null
  
  try {
    const sessionData = localStorage.getItem("simple-session")
    if (!sessionData) return null
    
    const session: SimpleSession = JSON.parse(sessionData)
    
    // Check if session is expired
    if (new Date(session.expires) < new Date()) {
      localStorage.removeItem("simple-session")
      return null
    }
    
    return session
  } catch (error) {
    console.error("Error getting session:", error)
    localStorage.removeItem("simple-session")
    return null
  }
}

export function clearSimpleSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("simple-session")
  }
}

export function useSimpleAuth() {
  const session = getSimpleSession()
  
  return {
    user: session?.user || null,
    isAuthenticated: !!session,
    logout: () => {
      clearSimpleSession()
      window.location.href = "/"
    }
  }
}