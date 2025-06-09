"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Settings, MessageSquare, Users, BarChart3, Shield } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold text-gray-900">AIbookReview</span>
            <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium ml-3">Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, Admin!</span>
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Back to Site</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Manage system settings, AI models, and platform configuration from this central admin panel.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">1,234</p>
                </div>
                <Users className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Books Analyzed</p>
                  <p className="text-3xl font-bold text-gray-900">2,847</p>
                </div>
                <BookOpen className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Authors</p>
                  <p className="text-3xl font-bold text-gray-900">456</p>
                </div>
                <BarChart3 className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Status</p>
                  <p className="text-lg font-semibold text-green-600">Operational</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Menu Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <Settings className="h-8 w-8 text-amber-600" />
                </div>
              </div>
              <CardTitle className="text-xl mb-3 text-gray-900">LLM Management</CardTitle>
              <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                Configure Gemini AI model settings, URLs, primary and backup model configurations for book analysis.
              </CardDescription>
              <Button className="w-full bg-amber-600 hover:bg-amber-700" asChild>
                <Link href="/admin/llm">Manage Models</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-xl mb-3 text-gray-900">Prompts Management</CardTitle>
              <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                Configure and manage AI prompts used for book analysis, review generation, and quality scoring.
              </CardDescription>
              <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50" asChild>
                <Link href="/admin/prompts">Manage Prompts</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-xl mb-3 text-gray-900">User Management</CardTitle>
              <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                View and manage user accounts, author profiles, and platform access permissions.
              </CardDescription>
              <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50" asChild>
                <Link href="/admin/users">Manage Users</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <CardTitle className="text-xl mb-3 text-gray-900">Analytics</CardTitle>
              <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                View platform analytics, usage statistics, and performance metrics across the system.
              </CardDescription>
              <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50" asChild>
                <Link href="/admin/analytics">View Analytics</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-xl mb-3 text-gray-900">System Settings</CardTitle>
              <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                Configure global system settings, security options, and platform-wide configurations.
              </CardDescription>
              <Button variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-50" asChild>
                <Link href="/admin/settings">System Settings</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <BookOpen className="h-8 w-8 text-gray-600" />
                </div>
              </div>
              <CardTitle className="text-xl mb-3 text-gray-900">Content Management</CardTitle>
              <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                Manage book reviews, moderate content, and oversee published reviews on the platform.
              </CardDescription>
              <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50" asChild>
                <Link href="/admin/content">Manage Content</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <div className="mt-12">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">System Status</CardTitle>
              <CardDescription>Current system health and operational status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-green-800">AI Analysis Service</p>
                    <p className="text-lg font-semibold text-green-900">Online</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-green-800">Database</p>
                    <p className="text-lg font-semibold text-green-900">Connected</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-green-800">File Storage</p>
                    <p className="text-lg font-semibold text-green-900">Available</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
