"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Shield, CheckCircle, AlertCircle, Database, User } from "lucide-react"
import { supabase } from '@/lib/supabase/client'

interface DebugInfo {
  step: string
  status: 'pending' | 'success' | 'error'
  message: string
  data?: any
}

export default function DebugLoginPage() {
  const [email, setEmail] = useState('admin@aibookreview.com')
  const [password, setPassword] = useState('admin123')
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<DebugInfo[]>([])

  const addDebugInfo = (step: string, status: 'pending' | 'success' | 'error', message: string, data?: any) => {
    setDebugInfo(prev => [...prev, { step, status, message, data }])
  }

  const clearDebugInfo = () => {
    setDebugInfo([])
  }

  const checkUserExists = async () => {
    try {
      addDebugInfo('User Check', 'pending', 'Checking if user exists in auth.users...')
      
      // We can't directly query auth.users, but we can try to sign in and see what happens
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'wrong-password' // Intentionally wrong to see the error
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          addDebugInfo('User Check', 'success', 'User exists (got invalid credentials error, which means user was found)')
        } else if (error.message.includes('Email not confirmed')) {
          addDebugInfo('User Check', 'error', 'User exists but email not confirmed', { error: error.message })
        } else {
          addDebugInfo('User Check', 'error', `Unexpected error: ${error.message}`, { error })
        }
      } else {
        addDebugInfo('User Check', 'error', 'Unexpected: Login succeeded with wrong password', { data })
      }
    } catch (error: any) {
      addDebugInfo('User Check', 'error', `Exception: ${error.message}`, { error })
    }
  }

  const checkProfile = async () => {
    try {
      addDebugInfo('Profile Check', 'pending', 'Checking if profile exists...')
      
      // Try to get profile (this will fail if not authenticated, but that's expected)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          addDebugInfo('Profile Check', 'error', 'No profile found with this email')
        } else {
          addDebugInfo('Profile Check', 'error', `Profile query error: ${error.message}`, { error })
        }
      } else {
        addDebugInfo('Profile Check', 'success', 'Profile found', { profile: data })
      }
    } catch (error: any) {
      addDebugInfo('Profile Check', 'error', `Exception: ${error.message}`, { error })
    }
  }

  const attemptLogin = async () => {
    try {
      addDebugInfo('Login Attempt', 'pending', 'Attempting to sign in...')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })

      if (error) {
        addDebugInfo('Login Attempt', 'error', `Login failed: ${error.message}`, { error })
      } else {
        addDebugInfo('Login Attempt', 'success', 'Login successful!', { 
          user: data.user,
          session: data.session ? 'Session created' : 'No session'
        })

        // If login successful, check the user's role
        if (data.session) {
          await checkUserRole(data.user.id)
        }
      }
    } catch (error: any) {
      addDebugInfo('Login Attempt', 'error', `Exception: ${error.message}`, { error })
    }
  }

  const checkUserRole = async (userId: string) => {
    try {
      addDebugInfo('Role Check', 'pending', 'Checking user role...')
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role, email, full_name')
        .eq('id', userId)
        .single()

      if (error) {
        addDebugInfo('Role Check', 'error', `Role check failed: ${error.message}`, { error })
      } else {
        addDebugInfo('Role Check', 'success', `User role: ${data.role}`, { profile: data })
      }
    } catch (error: any) {
      addDebugInfo('Role Check', 'error', `Exception: ${error.message}`, { error })
    }
  }

  const runFullDiagnostic = async () => {
    setIsLoading(true)
    clearDebugInfo()

    await checkUserExists()
    await new Promise(resolve => setTimeout(resolve, 500)) // Small delay for readability
    
    await checkProfile()
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await attemptLogin()
    
    setIsLoading(false)
  }

  const createUserManually = async () => {
    try {
      setIsLoading(true)
      addDebugInfo('Manual Creation', 'pending', 'Creating user manually...')

      // First, try to sign up
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: 'Admin User'
          }
        }
      })

      if (signUpError) {
        addDebugInfo('Manual Creation', 'error', `Signup failed: ${signUpError.message}`, { error: signUpError })
        return
      }

      addDebugInfo('Manual Creation', 'success', 'User created successfully', { user: signUpData.user })

      // Wait a moment for the profile trigger to run
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update role to admin
      if (signUpData.user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', signUpData.user.id)

        if (updateError) {
          addDebugInfo('Role Update', 'error', `Role update failed: ${updateError.message}`, { error: updateError })
        } else {
          addDebugInfo('Role Update', 'success', 'Role updated to admin')
        }
      }

    } catch (error: any) {
      addDebugInfo('Manual Creation', 'error', `Exception: ${error.message}`, { error })
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentSession = async () => {
    try {
      addDebugInfo('Session Check', 'pending', 'Checking current session...')
      
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        addDebugInfo('Session Check', 'error', `Session check failed: ${error.message}`, { error })
      } else if (session) {
        addDebugInfo('Session Check', 'success', 'Active session found', { 
          user: session.user.email,
          expires: session.expires_at
        })
      } else {
        addDebugInfo('Session Check', 'success', 'No active session')
      }
    } catch (error: any) {
      addDebugInfo('Session Check', 'error', `Exception: ${error.message}`, { error })
    }
  }

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
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Login Debug Tool</h1>
            <p className="text-gray-600">
              Diagnose authentication issues and test login functionality
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Test Credentials</CardTitle>
                  <CardDescription>
                    Enter the credentials you want to test
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Diagnostic Actions</CardTitle>
                  <CardDescription>
                    Run tests to identify the issue
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={runFullDiagnostic}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Running Diagnostics...' : 'Run Full Diagnostic'}
                  </Button>

                  <Button 
                    onClick={getCurrentSession}
                    variant="outline"
                    className="w-full"
                  >
                    Check Current Session
                  </Button>

                  <Button 
                    onClick={createUserManually}
                    variant="outline"
                    className="w-full border-green-200 text-green-700 hover:bg-green-50"
                    disabled={isLoading}
                  >
                    Create User Manually
                  </Button>

                  <Button 
                    onClick={clearDebugInfo}
                    variant="outline"
                    className="w-full"
                  >
                    Clear Results
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Diagnostic Results</CardTitle>
                  <CardDescription>
                    Step-by-step analysis of the authentication process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {debugInfo.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
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
            </div>
          </div>

          {/* Common Issues */}
          <Card className="mt-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Common Issues & Solutions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Email Not Confirmed</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Even after running the SQL update, Supabase might still require email confirmation.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Disable email confirmation in Supabase Auth settings</li>
                    <li>Or manually set email_confirmed_at in auth.users</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Profile Not Created</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    The profile trigger might not have run properly.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Check if the trigger exists in your database</li>
                    <li>Manually create the profile record</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Wrong Password</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    The password might not match what was set.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Try creating a new user with known credentials</li>
                    <li>Use the password reset flow</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">RLS Policies</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Row Level Security might be blocking access.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Check if policies allow the user to read their profile</li>
                    <li>Temporarily disable RLS for testing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}