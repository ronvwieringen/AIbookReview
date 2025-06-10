"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Database, Copy, CheckCircle } from "lucide-react"

export default function SQLHelperPage() {
  const [email, setEmail] = useState('admin@aibookreview.com')
  const [copied, setCopied] = useState(false)

  const sqlQuery = `-- Run this in your Supabase SQL Editor to make a user admin
-- Replace 'your-email@example.com' with the actual email address

UPDATE profiles 
SET role = 'admin' 
WHERE email = '${email}';

-- Verify the update worked
SELECT id, email, role, full_name, created_at 
FROM profiles 
WHERE email = '${email}';`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlQuery)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
              <Database className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">SQL Helper</h1>
            <p className="text-gray-600">
              Generate SQL to make a user admin
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Make User Admin</CardTitle>
              <CardDescription>
                Generate SQL to run in your Supabase SQL Editor to grant admin access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">User Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter the email of the user to make admin"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Generated SQL</Label>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy SQL
                      </>
                    )}
                  </Button>
                </div>
                
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto border">
                  <code>{sqlQuery}</code>
                </pre>
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <Database className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Instructions:</strong>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Copy the SQL above</li>
                    <li>Go to your Supabase Dashboard</li>
                    <li>Navigate to SQL Editor</li>
                    <li>Paste and run the SQL</li>
                    <li>The user will now have admin access</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">Alternative: Create Admin User</h3>
                <p className="text-sm text-gray-600 mb-3">
                  If you need to create a new admin user from scratch, you can also:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button variant="outline" onClick={() => window.location.href = '/setup-admin'}>
                    Setup Admin Tool
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/debug-admin'}>
                    Debug Admin Access
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/register'}>
                    Register New User
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-800">Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-amber-800 space-y-2">
                <p><strong>If the SQL doesn't work:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Make sure the user has already registered an account</li>
                  <li>Check that the email address is exactly correct</li>
                  <li>Verify the profiles table exists and has a role column</li>
                  <li>Try running the verification query to see if the user exists</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}