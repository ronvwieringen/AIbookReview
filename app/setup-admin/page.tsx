"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Shield, CheckCircle, AlertCircle, Mail } from "lucide-react"
import { supabase } from '@/lib/supabase/client'

export default function SetupAdminPage() {
  const [formData, setFormData] = useState({
    email: 'admin@aibookreview.com',
    password: 'admin123',
    fullName: 'Admin User'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)
    setNeedsConfirmation(false)

    try {
      // First, sign up the user with email confirmation disabled for this session
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (authError) {
        throw authError
      }

      if (authData.user) {
        // Check if the user needs email confirmation
        if (!authData.session) {
          setNeedsConfirmation(true)
          setMessage({
            type: 'info',
            text: 'Please check your email and click the confirmation link, then try signing in.'
          })
        } else {
          // User is already confirmed, update role
          await updateUserRole(authData.user.id)
        }
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

  const updateUserRole = async (userId: string) => {
    try {
      // Wait a moment for the profile to be created by the trigger
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update the user's role to admin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userId)

      if (updateError) {
        throw updateError
      }

      setMessage({
        type: 'success',
        text: `Admin user created successfully! You can now sign in with ${formData.email}`
      })
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update user role'
      })
    }
  }

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (error) {
        throw error
      }

      if (data.user && data.session) {
        // If this is the first successful sign-in, update the role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (profile?.role !== 'admin') {
          await updateUserRole(data.user.id)
        }

        // Redirect to admin panel
        window.location.href = '/admin'
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to sign in. Make sure you have confirmed your email.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email
      })

      if (error) {
        throw error
      }

      setMessage({
        type: 'info',
        text: 'Confirmation email resent! Please check your inbox.'
      })
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to resend confirmation email'
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
                <Alert className={`mt-4 ${
                  message.type === 'success' ? 'border-green-200 bg-green-50' : 
                  message.type === 'info' ? 'border-blue-200 bg-blue-50' :
                  'border-red-200 bg-red-50'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : message.type === 'info' ? (
                    <Mail className="h-4 w-4 text-blue-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={
                    message.type === 'success' ? 'text-green-800' : 
                    message.type === 'info' ? 'text-blue-800' :
                    'text-red-800'
                  }>
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              {needsConfirmation && (
                <div className="mt-4 space-y-3">
                  <Button 
                    onClick={handleResendConfirmation}
                    variant="outline"
                    className="w-full"
                  >
                    Resend Confirmation Email
                  </Button>
                </div>
              )}

              {(message?.type === 'success' || !needsConfirmation) && (
                <div className="mt-4 space-y-3">
                  <Button 
                    onClick={handleSignIn}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In as Admin'}
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
                  <strong>Email Confirmation:</strong> If email confirmation is enabled in your Supabase project, 
                  you'll need to check your email and click the confirmation link before you can sign in.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="mt-8">
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-lg">Disable Email Confirmation (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-800 mb-3">
                  For easier testing, you can disable email confirmation in your Supabase project:
                </p>
                <ol className="text-sm text-amber-800 space-y-1 list-decimal list-inside">
                  <li>Go to your Supabase Dashboard</li>
                  <li>Navigate to Authentication → Settings</li>
                  <li>Turn off "Enable email confirmations"</li>
                  <li>Save the changes</li>
                </ol>
                <p className="text-xs text-amber-700 mt-3">
                  Remember to re-enable this in production for security.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 text-center">
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