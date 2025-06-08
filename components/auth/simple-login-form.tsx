"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen } from "lucide-react"
import Link from "next/link"

export function SimpleLoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Simple username-based role assignment
      let role = "Reader" // default
      let name = username

      if (username.toLowerCase().includes("admin")) {
        role = "PlatformAdmin"
        name = "Admin User"
      } else if (username.toLowerCase().includes("author")) {
        role = "Author"
        name = "Author User"
      } else if (username.toLowerCase().includes("service")) {
        role = "ServiceProvider"
        name = "Service Provider"
      }

      // Store simple session data in localStorage (temporary solution)
      const sessionData = {
        user: {
          id: `user-${Date.now()}`,
          name: name,
          email: `${username}@example.com`,
          role: role,
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      }

      localStorage.setItem("simple-session", JSON.stringify(sessionData))

      // Redirect based on role
      if (role === "PlatformAdmin") {
        router.push("/admin")
      } else if (role === "Author") {
        router.push("/author/dashboard")
      } else {
        router.push("/")
      }
      
      router.refresh()
    } catch (error) {
      setError("Login failed. Please try again.")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <BookOpen className="h-12 w-12 text-[#2A4759]" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your AIbookReview account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter username (admin, author, or reader)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <div className="text-xs text-gray-500">
              Use "admin" for admin access, "author" for author features, or any other name for reader access
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Any password (not checked)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-xs text-gray-500">
              Password is not validated in development mode
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#F79B72] hover:bg-[#e68a61]"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm text-gray-500">
          Development mode - no real authentication required
        </div>
      </CardFooter>
    </Card>
  )
}