/**
 * REQUIREMENTS REFERENCES:
 *
 * [REQ-UI-007] Author Dashboard Navigation
 * - Consistent navigation for author-specific pages
 * - Quick access to key author functions
 * - Integration with main author dashboard
 *
 * [REQ-UI-002] Navigation Structure
 * - Consistent navigation across all pages
 * - Clear user flow from landing to key actions
 *
 * [REQ-FUNC-017] Quick Actions and Shortcuts
 * - Direct links to key author functions
 * - Quick access to notifications and messages
 * - User profile and settings access
 *
 * [REQ-FUNC-001] User Registration/Login
 * - User authentication state management
 * - Profile access and management
 */

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, User, MessageSquare, Bell } from "lucide-react"
import { useSession } from "next-auth/react"

export default function AuthorDashboardNav() {
  const { data: session } = useSession()

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <BookOpen className="h-8 w-8 text-[#2A4759]" />
          <span className="ml-2 text-2xl font-bold text-[#2A4759]">AIbookReview</span>
        </Link>

        <nav className="hidden md:flex space-x-8">
          <Link href="/author/dashboard" className="text-gray-600 hover:text-[#F79B72]">
            Dashboard
          </Link>
          <Link href="/author/upload" className="text-gray-600 hover:text-[#F79B72]">
            Upload
          </Link>
          <Link href="/author/profile" className="text-gray-600 hover:text-[#F79B72]">
            Profile
          </Link>
          <Link href="/reviews" className="text-gray-600 hover:text-[#F79B72]">
            Browse Books
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" className="border-[#2A4759] text-[#2A4759] hover:bg-[#2A4759] hover:text-white">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#F79B72] hover:bg-[#e68a61] text-white">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}