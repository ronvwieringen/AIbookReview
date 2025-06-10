"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Database, BookOpen } from "lucide-react"
import { supabase } from '@/lib/supabase/client'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error'
  message: string
  details?: any
}

export default function TestDatabasePage() {
  const [tests, setTests] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const updateTest = (index: number, status: 'success' | 'error', message: string, details?: any) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message, details } : test
    ))
  }

  const runTests = async () => {
    setIsRunning(true)
    const testList = [
      { name: 'Database Connection', status: 'pending' as const, message: 'Testing...' },
      { name: 'Profiles Table', status: 'pending' as const, message: 'Checking...' },
      { name: 'Role Column', status: 'pending' as const, message: 'Verifying...' },
      { name: 'Admin Function', status: 'pending' as const, message: 'Testing...' },
      { name: 'LLM Configs', status: 'pending' as const, message: 'Checking...' },
      { name: 'Prompts', status: 'pending' as const, message: 'Verifying...' }
    ]
    setTests(testList)

    try {
      // Test 1: Basic connection
      const { data, error } = await supabase.from('profiles').select('count').limit(1)
      if (error) throw error
      updateTest(0, 'success', 'Connected successfully')
    } catch (error: any) {
      updateTest(0, 'error', `Connection failed: ${error.message}`)
      setIsRunning(false)
      return
    }

    try {
      // Test 2: Check profiles table structure
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, created_at')
        .limit(1)
      
      if (error) throw error
      updateTest(1, 'success', `Profiles table OK (${data?.length || 0} records accessible)`, data)
    } catch (error: any) {
      updateTest(1, 'error', `Profiles table error: ${error.message}`)
    }

    try {
      // Test 3: Check role column specifically
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .limit(5)
      
      if (error) throw error
      const roles = data?.map(p => p.role).filter(Boolean)
      updateTest(2, 'success', `Role column working (found roles: ${roles?.join(', ') || 'none'})`, roles)
    } catch (error: any) {
      updateTest(2, 'error', `Role column error: ${error.message}`)
    }

    try {
      // Test 4: Test admin function (this might fail if not admin, which is expected)
      const { data, error } = await supabase.rpc('is_admin')
      updateTest(3, 'success', `Admin function working (result: ${data})`, { isAdmin: data })
    } catch (error: any) {
      updateTest(3, 'error', `Admin function error: ${error.message}`)
    }

    try {
      // Test 5: Check LLM configs (admin only, might fail)
      const { data, error } = await supabase
        .from('llm_configs')
        .select('name, type, status')
        .limit(5)
      
      if (error && error.message.includes('row-level security')) {
        updateTest(4, 'success', 'LLM configs protected by RLS (good!)')
      } else if (error) {
        updateTest(4, 'error', `LLM configs error: ${error.message}`)
      } else {
        updateTest(4, 'success', `LLM configs accessible (${data?.length || 0} configs)`, data)
      }
    } catch (error: any) {
      updateTest(4, 'error', `LLM configs error: ${error.message}`)
    }

    try {
      // Test 6: Check prompts (admin only, might fail)
      const { data, error } = await supabase
        .from('prompts')
        .select('prompt_name, prompt_type, version')
        .limit(5)
      
      if (error && error.message.includes('row-level security')) {
        updateTest(5, 'success', 'Prompts protected by RLS (good!)')
      } else if (error) {
        updateTest(5, 'error', `Prompts error: ${error.message}`)
      } else {
        updateTest(5, 'success', `Prompts accessible (${data?.length || 0} prompts)`, data)
      }
    } catch (error: any) {
      updateTest(5, 'error', `Prompts error: ${error.message}`)
    }

    setIsRunning(false)
  }

  const successCount = tests.filter(t => t.status === 'success').length
  const errorCount = tests.filter(t => t.status === 'error').length

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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Database Schema Test</h1>
            <p className="text-xl text-gray-600">
              Testing the database setup after migration
            </p>
          </div>

          {/* Overall Status */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Database className="h-6 w-6 text-amber-600" />
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tests.length === 0 ? (
                <div className="text-center py-8">
                  <Button onClick={runTests} disabled={isRunning} className="bg-amber-600 hover:bg-amber-700">
                    {isRunning ? 'Running Tests...' : 'Run Database Tests'}
                  </Button>
                </div>
              ) : (
                <>
                  {successCount > 0 && errorCount === 0 && (
                    <Alert className="mb-4 border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        🎉 All tests passed! Database is properly configured.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {errorCount > 0 && (
                    <Alert className="mb-4 border-amber-200 bg-amber-50">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        {successCount} passed, {errorCount} failed. Some issues detected.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    {tests.map((test, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{test.name}</h4>
                          <div className="flex items-center gap-2">
                            {test.status === 'pending' && (
                              <div className="h-4 w-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                            )}
                            {test.status === 'success' && (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                            {test.status === 'error' && (
                              <AlertCircle className="h-5 w-5 text-red-600" />
                            )}
                            <span className={`text-sm font-medium ${
                              test.status === 'success' ? 'text-green-600' :
                              test.status === 'error' ? 'text-red-600' :
                              'text-amber-600'
                            }`}>
                              {test.status === 'pending' ? 'Testing' : 
                               test.status === 'success' ? 'Passed' : 'Failed'}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{test.message}</p>
                        {test.details && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                              View Details
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
                              {JSON.stringify(test.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <Button onClick={runTests} disabled={isRunning} variant="outline">
                      {isRunning ? 'Running Tests...' : 'Run Tests Again'}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">Now that the database is set up, you can:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Test user registration at <code>/register</code></li>
                  <li>Test login functionality at <code>/login</code></li>
                  <li>Create an admin user at <code>/setup-admin</code></li>
                  <li>Access the admin panel at <code>/admin</code> (admin only)</li>
                  <li>Test the debug login tool at <code>/debug-login</code></li>
                </ul>
                <div className="flex gap-3 pt-4">
                  <Button className="bg-amber-600 hover:bg-amber-700" onClick={() => window.location.href = '/register'}>
                    Test Registration
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/setup-admin'}>
                    Setup Admin
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/debug-login'}>
                    Debug Login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}