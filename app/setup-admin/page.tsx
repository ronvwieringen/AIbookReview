"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Shield, CheckCircle, AlertCircle } from "lucide-react"
import { supabase } from '@/lib/supabase/client'

export default function SetupAdminPage() {
  const [formData, setFormData] = useState({
    email: 'admin@aibookreview.com',
    password: 'admin123',
    fullName: 'Admin User'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // First, sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName
          }
        }
      })

      if (authError) {
        throw authError
      }

      if (authData.user) {
        // Wait a moment for the profile to be created by the trigger
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Update the user's role to admin
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', authData.user.id)

        if (updateError) {
          throw updateError
        }

        setMessage({
          type: 'success',
          text: `Admin user created successfully! You can now sign in with ${formData.email} and password ${formData.password}`
        })
      }
    } catch (error: any) {
      console.error('Error creating admin user:', error)
      setMessage({
        type: 'error',
        text: error.message || 'Failed to create admin user'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (error) {
        throw error
      }

      // Redirect to admin panel
      window.location.href = '/admin'
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to sign in'
      })
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
        <div className="max-w-md mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Admin User</h1>
            <p className="text-gray-600">
              Create an admin account for testing the admin panel
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Create Admin Account</CardTitle>
              <CardDescription>
                This will create a user with admin privileges for testing purposes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Admin User...' : 'Create Admin User'}
                </Button>
              </form>

              {message && (
                <Alert className={`mt-4 ${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              {message?.type === 'success' && (
                <div className="mt-4 space-y-3">
                  <Button 
                    onClick={handleSignIn}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                  >
                    Sign In as Admin
                  </Button>
                  <div className="text-center">
                    <Button variant="link" onClick={() => window.location.href = '/admin'}>
                      Go to Admin Panel
                    </Button>
                  </div>
                </div>
              )}

              <Alert className="mt-6 border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <strong>For Testing Only:</strong> This creates a real admin user in your database. 
                  In production, you would manage admin users through your Supabase dashboard or a more secure process.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold mb-3">Default Admin Credentials</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <p><strong>Email:</strong> admin@aibookreview.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              You can change these credentials above before creating the admin user
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}