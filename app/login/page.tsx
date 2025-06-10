"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { supabase } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get('redirectTo') || '/dashboard'
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // User is already logged in, redirect based on role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (profile?.role === 'admin') {
          router.push('/admin')
        } else if (profile?.role === 'author') {
          router.push('/author/dashboard')
        } else {
          router.push('/dashboard')
        }
      }
    }
    
    checkSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Sign in the user
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (signInError) {
        throw signInError
      }

      if (data.user && data.session) {
        // Get user profile to determine redirect
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          console.error('Profile fetch error:', profileError)
          // If we can't get the profile, default to dashboard
          router.push(redirectTo)
          return
        }

        // Redirect based on role or to the requested page
        if (redirectTo !== '/dashboard') {
          router.push(redirectTo)
        } else if (profile.role === 'admin') {
          router.push('/admin')
        } else if (profile.role === 'author') {
          router.push('/author/dashboard')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || 'Failed to sign in')
    } finally {
      setIsLoading(false)
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
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-amber-600 font-medium">
              Home
            </Link>
            <Link href="/discover" className="text-gray-700 hover:text-amber-600 font-medium">
              Discover Books
            </Link>
            <Link href="/authors" className="text-gray-700 hover:text-amber-600 font-medium">
              For Authors
            </Link>
          </nav>
          <div className="flex space-x-3">
            <Button className="bg-amber-600 hover:bg-amber-700" asChild>
              <Link href="/register">Join Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center py-20 px-4 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-amber-600" />
              <span className="text-2xl font-bold text-gray-900">AIbookReview</span>
            </div>
            <CardTitle className="text-2xl text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-lg text-gray-600">Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-900">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-3"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Separator className="my-6" />

              <div className="space-y-3">
                <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50" disabled>
                  Continue with Google
                </Button>
                <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50" disabled>
                  Continue with Microsoft
                </Button>
              </div>

              <div className="text-center space-y-3 pt-4">
                <Link href="/forgot-password" className="text-sm text-amber-600 hover:text-amber-700 font-medium block">
                  Forgot your password?
                </Link>
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-amber-600 hover:text-amber-700 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-amber-600" />
                <span className="text-xl font-bold">AIbookReview</span>
              </div>
              <p className="text-gray-600">
                Connecting readers with quality self-published books through AI-powered analysis.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Readers</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/discover" className="hover:text-amber-600">
                    Discover Books
                  </Link>
                </li>
                <li>
                  <Link href="/new-releases" className="hover:text-amber-600">
                    New Releases
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Authors</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/authors" className="hover:text-amber-600">
                    Author Portal
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-amber-600">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-amber-600">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/success-stories" className="hover:text-amber-600">
                    Success Stories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/help" className="hover:text-amber-600">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-amber-600">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-amber-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-amber-600">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 AIbookReview.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}