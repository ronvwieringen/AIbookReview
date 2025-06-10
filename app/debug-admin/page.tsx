"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Shield, BookOpen, User } from "lucide-react"
import { supabase } from '@/lib/supabase/client'

interface DebugInfo {
  step: string
  status: 'pending' | 'success' | 'error'
  message: string
  data?: any
}

export default function DebugAdminPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const addDebugInfo = (step: string, status: 'pending' | 'success' | 'error', message: string, data?: any) => {
    setDebugInfo(prev => [...prev, { step, status, message, data }])
  }

  const clearDebugInfo = () => {
    setDebugInfo([])
  }

  const runDiagnostics = async () => {
    setIsLoading(true)
    clearDebugInfo()

    try {
      // Step 1: Check current session
      addDebugInfo('Session Check', 'pending', 'Checking current session...')
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        addDebugInfo('Session Check', 'error', `Session error: ${sessionError.message}`)
        setIsLoading(false)
        return
      }

      if (!session) {
        addDebugInfo('Session Check', 'error', 'No active session found')
        setIsLoading(false)
        return
      }

      addDebugInfo('Session Check', 'success', `Session found for user: ${session.user.email}`, {
        userId: session.user.id,
        email: session.user.email,
        expires: session.expires_at
      })
      setCurrentUser(session.user)

      // Step 2: Check user profile
      addDebugInfo('Profile Check', 'pending', 'Checking user profile...')
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profileError) {
        addDebugInfo('Profile Check', 'error', `Profile error: ${profileError.message}`, profileError)
      } else {
        addDebugInfo('Profile Check', 'success', `Profile found with role: ${profile.role}`, profile)
      }

      // Step 3: Test is_admin function
      addDebugInfo('Admin Function', 'pending', 'Testing is_admin() function...')
      try {
        const { data: isAdminResult, error: adminError } = await supabase.rpc('is_admin')
        
        if (adminError) {
          addDebugInfo('Admin Function', 'error', `Admin function error: ${adminError.message}`, adminError)
        } else {
          addDebugInfo('Admin Function', 'success', `is_admin() returned: ${isAdminResult}`, { isAdmin: isAdminResult })
        }
      } catch (error: any) {
        addDebugInfo('Admin Function', 'error', `Admin function exception: ${error.message}`)
      }

      // Step 4: Test LLM configs access
      addDebugInfo('LLM Access', 'pending', 'Testing LLM configs access...')
      const { data: llmData, error: llmError } = await supabase
        .from('llm_configs')
        .select('name, type, status')
        .limit(1)

      if (llmError) {
        if (llmError.message.includes('row-level security')) {
          addDebugInfo('LLM Access', 'error', 'Access denied by RLS (user is not admin)', llmError)
        } else {
          addDebugInfo('LLM Access', 'error', `LLM access error: ${llmError.message}`, llmError)
        }
      } else {
        addDebugInfo('LLM Access', 'success', 'LLM configs accessible (user has admin access)', llmData)
      }

      // Step 5: Test prompts access
      addDebugInfo('Prompts Access', 'pending', 'Testing prompts access...')
      const { data: promptsData, error: promptsError } = await supabase
        .from('prompts')
        .select('prompt_name, prompt_type')
        .limit(1)

      if (promptsError) {
        if (promptsError.message.includes('row-level security')) {
          addDebugInfo('Prompts Access', 'error', 'Access denied by RLS (user is not admin)', promptsError)
        } else {
          addDebugInfo('Prompts Access', 'error', `Prompts access error: ${promptsError.message}`, promptsError)
        }
      } else {
        addDebugInfo('Prompts Access', 'success', 'Prompts accessible (user has admin access)', promptsData)
      }

    } catch (error: any) {
      addDebugInfo('General Error', 'error', `Unexpected error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const makeUserAdmin = async () => {
    if (!currentUser) {
      alert('No user logged in')
      return
    }

    try {
      setIsLoading(true)
      addDebugInfo('Make Admin', 'pending', 'Attempting to update user role to admin...')

      // Try to update the user's role directly
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', currentUser.id)

      if (error) {
        addDebugInfo('Make Admin', 'error', `Failed to update role: ${error.message}`, error)
      } else {
        addDebugInfo('Make Admin', 'success', 'User role updated to admin successfully!')
        // Re-run diagnostics to see the change
        setTimeout(() => runDiagnostics(), 1000)
      }
    } catch (error: any) {
      addDebugInfo('Make Admin', 'error', `Exception: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold text-gray-900">AIbookReview</span>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Access Debug</h1>
            <p className="text-gray-600">
              Diagnose why admin access is not working
            </p>
          </div>

          {/* Current User Info */}
          {currentUser && (
            <Card className="mb-6 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Current User
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{currentUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">User ID</p>
                    <p className="font-mono text-sm">{currentUser.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Controls */}
          <Card className="mb-6 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Diagnostic Actions</CardTitle>
              <CardDescription>
                Run tests to identify admin access issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={runDiagnostics}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Running Diagnostics...' : 'Run Admin Diagnostics'}
              </Button>

              {currentUser && (
                <Button 
                  onClick={makeUserAdmin}
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={isLoading}
                >
                  Make Current User Admin
                </Button>
              )}

              <Button 
                onClick={clearDebugInfo}
                variant="outline"
                className="w-full"
              >
                Clear Results
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Diagnostic Results</CardTitle>
              <CardDescription>
                Step-by-step analysis of admin access
              </CardDescription>
            </CardHeader>
            <CardContent>
              {debugInfo.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Run diagnostics to see results here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {debugInfo.map((info, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{info.step}</h4>
                        <Badge className={
                          info.status === 'success' ? 'bg-green-100 text-green-800' :
                          info.status === 'error' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }>
                          {info.status === 'pending' && (
                            <div className="h-3 w-3 border border-amber-600 border-t-transparent rounded-full animate-spin mr-1" />
                          )}
                          {info.status === 'success' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {info.status === 'error' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {info.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{info.message}</p>
                      {info.data && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                            View Details
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
                            {JSON.stringify(info.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="mt-6 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" onClick={() => window.location.href = '/login'}>
                  Login Page
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/register'}>
                  Register
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/setup-admin'}>
                  Setup Admin
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/admin'}>
                  Try Admin Panel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}