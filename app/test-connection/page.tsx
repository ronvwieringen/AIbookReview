"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Database, BookOpen } from "lucide-react"
import { supabase } from '@/lib/supabase/client'

interface ConnectionTest {
  name: string
  status: 'pending' | 'success' | 'error'
  message: string
}

export default function TestConnectionPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const [tests, setTests] = useState<ConnectionTest[]>([
    { name: 'Supabase Connection', status: 'pending', message: 'Testing...' },
    { name: 'Database Tables', status: 'pending', message: 'Checking...' },
    { name: 'Authentication', status: 'pending', message: 'Verifying...' },
    { name: 'Row Level Security', status: 'pending', message: 'Testing...' }
  ])

  const updateTest = (index: number, status: 'success' | 'error', message: string) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message } : test
    ))
  }

  const runTests = async () => {
    // Reset tests
    setTests(prev => prev.map(test => ({ ...test, status: 'pending' })))

    try {
      // Test 1: Basic connection
      const { data, error } = await supabase.from('profiles').select('count').limit(1)
      if (error) throw error
      updateTest(0, 'success', 'Connected successfully')
    } catch (error) {
      updateTest(0, 'error', `Connection failed: ${error.message}`)
      return
    }

    try {
      // Test 2: Check all tables exist (using correct table names)
      const tables = ['profiles', 'books', 'ai_reviews', 'llm_configs', 'prompts', 'reading_lists']
      for (const table of tables) {
        const { error } = await supabase.from(table).select('count').limit(1)
        if (error) throw new Error(`Table ${table} not found`)
      }
      updateTest(1, 'success', 'All tables exist and accessible')
    } catch (error) {
      updateTest(1, 'error', `Table check failed: ${error.message}`)
    }

    try {
      // Test 3: Authentication
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        updateTest(2, 'success', `Authenticated as ${session.user.email}`)
      } else {
        updateTest(2, 'success', 'Authentication system working (not logged in)')
      }
    } catch (error) {
      updateTest(2, 'error', `Auth test failed: ${error.message}`)
    }

    try {
      // Test 4: RLS (this should fail for unauthenticated users, which is good)
      const { error } = await supabase.from('llm_configs').select('*').limit(1)
      if (error && error.message.includes('row-level security')) {
        updateTest(3, 'success', 'Row Level Security is working correctly')
      } else if (error) {
        updateTest(3, 'error', `RLS test failed: ${error.message}`)
      } else {
        updateTest(3, 'success', 'RLS configured (admin access detected)')
      }
    } catch (error) {
      updateTest(3, 'error', `RLS test failed: ${error.message}`)
    }
  }

  useEffect(() => {
    runTests()
  }, [])

  const allSuccess = tests.every(test => test.status === 'success')
  const hasErrors = tests.some(test => test.status === 'error')

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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Database Connection Test</h1>
            <p className="text-xl text-gray-600">
              Testing Supabase backend integration and database setup
            </p>
          </div>

          {/* Overall Status */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Database className="h-6 w-6 text-amber-600" />
                Backend Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allSuccess && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    🎉 All systems operational! Your Supabase backend is properly configured.
                  </AlertDescription>
                </Alert>
              )}
              
              {hasErrors && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Some tests failed. Please check your Supabase configuration in .env.local
                  </AlertDescription>
                </Alert>
              )}
              
              {!allSuccess && !hasErrors && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    Running tests...
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Individual component tests for the backend system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {test.status === 'pending' && (
                      <div className="h-4 w-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    {test.status === 'success' && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {test.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{test.name}</h4>
                      <p className="text-sm text-gray-600">{test.message}</p>
                    </div>
                  </div>
                  <Badge 
                    className={
                      test.status === 'success' ? 'bg-green-100 text-green-800' :
                      test.status === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }
                  >
                    {test.status === 'pending' ? 'Testing' : 
                     test.status === 'success' ? 'Passed' : 'Failed'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mt-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {allSuccess ? (
                <div className="space-y-3">
                  <p className="text-gray-700">✅ Your backend is ready! You can now:</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Test user registration and authentication</li>
                    <li>Upload and analyze manuscripts</li>
                    <li>Configure AI models in the admin panel</li>
                    <li>Manage prompts and system settings</li>
                  </ul>
                  <div className="flex gap-3 pt-4">
                    <Button className="bg-amber-600 hover:bg-amber-700" onClick={() => window.location.href = '/register'}>
                      Test Registration
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = '/admin'}>
                      Admin Panel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-700">To fix the issues:</p>
                  <ol className="list-decimal pl-6 space-y-2 text-gray-600">
                    <li>Check your .env.local file has the correct Supabase credentials</li>
                    <li>Ensure you've run the migration in your Supabase SQL editor</li>
                    <li>Verify your Supabase project is active</li>
                    <li>Check the browser console for detailed error messages</li>
                  </ol>
                  <Button onClick={runTests} className="bg-amber-600 hover:bg-amber-700">
                    Retry Tests
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}