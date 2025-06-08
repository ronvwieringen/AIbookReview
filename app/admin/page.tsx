/**
 * Admin Dashboard Page
 *
 * Requirements References:
 * - FR800: Admin Dashboard: Overview of platform statistics (users, reviews, API usage, etc.)
 * - FR801: User Management: CRUD operations for all user roles
 * - FR802: LLM Configuration Management: Manage AI model configurations
 * - FR803: Prompt Management: Create, edit, and manage prompts used with LLMs
 * - FR804: Platform Partner (API Key) Management: Manage registered platform partners
 * - FR805: Content Moderation: Tools to review and moderate user-generated content
 * - FR806: Service Provider Account Management: Approve/manage service provider registrations
 * - FR807: Blogger/Reviewer Account Management
 * - FR808: Platform Settings: Manage site-wide settings, categories, featured content
 * - FR809: Community Management Tools: Moderate forums, manage Q&A sessions
 *
 * This page provides administrators with an overview of platform statistics and quick access
 * to all administrative functions including user management, AI configuration, content
 * moderation, and platform settings.
 */

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  BookOpen,
  Settings,
  Brain,
  FileText,
  Key,
  Shield,
  Store,
  UserCheck,
  BarChart3,
  Activity,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import { useSimpleAuth } from "@/lib/simple-auth"

export default function AdminDashboard() {
  const { user, isAuthenticated } = useSimpleAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user?.role !== "PlatformAdmin") {
      router.push("/")
      return
    }
  }, [user, isAuthenticated, router])

  if (!isAuthenticated || user?.role !== "PlatformAdmin") {
    return <div>Loading...</div>
  }

  // Mock data - in real implementation, this would come from API calls
  const stats = {
    totalUsers: 1247,
    totalAuthors: 523,
    totalReaders: 681,
    totalServiceProviders: 43,
    totalReviews: 892,
    publicReviews: 634,
    privateReviews: 258,
    apiCalls: 15420,
    activePartners: 8,
    pendingModeration: 12,
  }

  const recentActivity = [
    { type: "New User", description: "Author registration: Sarah Johnson", time: "2 minutes ago" },
    { type: "Review Published", description: "The Digital Nomad's Guide - made public", time: "15 minutes ago" },
    { type: "API Call", description: "Partner platform retrieved review data", time: "23 minutes ago" },
    { type: "Service Provider", description: "New editor profile pending approval", time: "1 hour ago" },
    { type: "Content Flag", description: "Reader review flagged for moderation", time: "2 hours ago" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2A4759] mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage and monitor the AIbookReview.com platform</p>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Reviews</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReviews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.publicReviews} public, {stats.privateReviews} private
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Calls</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.apiCalls.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From {stats.activePartners} active partners</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingModeration}</div>
              <p className="text-xs text-muted-foreground">Items requiring attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Administrative Functions
                </CardTitle>
                <CardDescription>Quick access to key administrative tools and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* User Management */}
                  <Link href="/admin/users">
                    <Button variant="outline" className="w-full justify-start h-auto p-4">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-[#2A4759]" />
                        <div className="text-left">
                          <div className="font-medium">User Management</div>
                          <div className="text-sm text-gray-500">Manage all user accounts</div>
                        </div>
                      </div>
                    </Button>
                  </Link>

                  {/* LLM Management */}
                  <Link href="/admin/llm-management">
                    <Button variant="outline" className="w-full justify-start h-auto p-4">
                      <div className="flex items-center gap-3">
                        <Brain className="h-5 w-5 text-[#2A4759]" />
                        <div className="text-left">
                          <div className="font-medium">LLM Configuration</div>
                          <div className="text-sm text-gray-500">Manage AI models</div>
                        </div>
                      </div>
                    </Button>
                  </Link>

                  {/* Prompts Management */}
                  <Link href="/admin/prompts-management">
                    <Button variant="outline" className="w-full justify-start h-auto p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-[#2A4759]" />
                        <div className="text-left">
                          <div className="font-medium">Prompts Management</div>
                          <div className="text-sm text-gray-500">Edit AI prompts</div>
                        </div>
                      </div>
                    </Button>
                  </Link>

                  {/* API Key Management */}
                  <Link href="/admin/api-keys">
                    <Button variant="outline" className="w-full justify-start h-auto p-4">
                      <div className="flex items-center gap-3">
                        <Key className="h-5 w-5 text-[#2A4759]" />
                        <div className="text-left">
                          <div className="font-medium">API Key Management</div>
                          <div className="text-sm text-gray-500">Manage partner access</div>
                        </div>
                      </div>
                    </Button>
                  </Link>

                  {/* Content Moderation */}
                  <Link href="/admin/moderation">
                    <Button variant="outline" className="w-full justify-start h-auto p-4">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-[#2A4759]" />
                        <div className="text-left">
                          <div className="font-medium">Content Moderation</div>
                          <div className="text-sm text-gray-500">Review flagged content</div>
                        </div>
                      </div>
                    </Button>
                  </Link>

                  {/* Service Provider Management */}
                  <Link href="/admin/service-providers">
                    <Button variant="outline" className="w-full justify-start h-auto p-4">
                      <div className="flex items-center gap-3">
                        <Store className="h-5 w-5 text-[#2A4759]" />
                        <div className="text-left">
                          <div className="font-medium">Service Providers</div>
                          <div className="text-sm text-gray-500">Approve SP accounts</div>
                        </div>
                      </div>
                    </Button>
                  </Link>

                  {/* Blogger/Reviewer Management */}
                  <Link href="/admin/bloggers">
                    <Button variant="outline" className="w-full justify-start h-auto p-4">
                      <div className="flex items-center gap-3">
                        <UserCheck className="h-5 w-5 text-[#2A4759]" />
                        <div className="text-left">
                          <div className="font-medium">Bloggers & Reviewers</div>
                          <div className="text-sm text-gray-500">Manage reviewer accounts</div>
                        </div>
                      </div>
                    </Button>
                  </Link>

                  {/* Platform Settings */}
                  <Link href="/admin/settings">
                    <Button variant="outline" className="w-full justify-start h-auto p-4">
                      <div className="flex items-center gap-3">
                        <Settings className="h-5 w-5 text-[#2A4759]" />
                        <div className="text-left">
                          <div className="font-medium">Platform Settings</div>
                          <div className="text-sm text-gray-500">Site-wide configuration</div>
                        </div>
                      </div>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest platform events and actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#F79B72] rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Breakdown */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  User Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Authors</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#2A4759] h-2 rounded-full"
                          style={{ width: `${(stats.totalAuthors / stats.totalUsers) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{stats.totalAuthors}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Readers</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#F79B72] h-2 rounded-full"
                          style={{ width: `${(stats.totalReaders / stats.totalUsers) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{stats.totalReaders}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Service Providers</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#90D1CA] h-2 rounded-full"
                          style={{ width: `${(stats.totalServiceProviders / stats.totalUsers) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{stats.totalServiceProviders}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}