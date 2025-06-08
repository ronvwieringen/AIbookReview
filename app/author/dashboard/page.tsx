/**
 * REQUIREMENTS REFERENCES:
 *
 * [REQ-UI-008] Author Dashboard Overview
 * - Comprehensive dashboard showing author's publishing journey
 * - Statistics and performance metrics
 * - Quick access to key functions and recent activity
 * - Goal tracking and progress indicators
 *
 * [REQ-FUNC-015] Author Analytics and Insights
 * - Performance charts and metrics over time
 * - Reader engagement statistics
 * - Review performance tracking
 * - Goal progress monitoring
 *
 * [REQ-FUNC-016] Review Management Interface
 * - Overview of all author's reviews
 * - Status tracking (draft, published, private)
 * - Quick actions for review management
 * - Search and filter capabilities
 *
 * [REQ-FUNC-017] Quick Actions and Shortcuts
 * - Upload new manuscript functionality
 * - Access to settings and profile management
 * - Direct links to key author functions
 * - Recent activity and notifications
 *
 * [REQ-FUNC-018] Reader Feedback Management
 * - Latest reader reviews and ratings
 * - Feedback summary and trends
 * - Response management capabilities
 * - Engagement metrics
 *
 * [REQ-FUNC-019] Service Provider Recommendations
 * - AI-suggested services based on review analysis
 * - Recommended service providers
 * - Service engagement tracking
 * - Provider marketplace integration
 */

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  Upload,
  BarChart3,
  Users,
  TrendingUp,
  Calendar,
  Star,
  MessageSquare,
  Settings,
  Filter,
  Search,
} from "lucide-react"
import AuthorDashboardNav from "@/components/author-dashboard-nav"
import DashboardStats from "@/components/dashboard/dashboard-stats"
import RecentActivity from "@/components/dashboard/recent-activity"
import ReviewsOverview from "@/components/dashboard/reviews-overview"
import QuickActions from "@/components/dashboard/quick-actions"
import PerformanceChart from "@/components/dashboard/performance-chart"
import { getAuthorDashboardData } from "@/lib/author-dashboard-data"
import { useSimpleAuth } from "@/lib/simple-auth"

export default function AuthorDashboard() {
  const { user, isAuthenticated } = useSimpleAuth()
  const router = useRouter()
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d")
  const dashboardData = getAuthorDashboardData()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user?.role !== "Author" && user?.role !== "PlatformAdmin") {
      router.push("/")
      return
    }
  }, [user, isAuthenticated, router])

  if (!isAuthenticated || (user?.role !== "Author" && user?.role !== "PlatformAdmin")) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthorDashboardNav />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#2A4759] mb-2">Welcome back, {user?.name || 'Author'}!</h1>
            <p className="text-gray-600">Here's an overview of your publishing journey with AIbookReview.</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Link href="/author/upload">
              <Button className="bg-[#F79B72] hover:bg-[#e68a61] text-white">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Manuscript
              </Button>
            </Link>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <DashboardStats stats={dashboardData.stats} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-[#2A4759]">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Performance Overview
                  </CardTitle>
                  <div className="flex gap-2">
                    {["7d", "30d", "90d", "1y"].map((period) => (
                      <Button
                        key={period}
                        variant={selectedTimeframe === period ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTimeframe(period)}
                        className={selectedTimeframe === period ? "bg-[#2A4759] hover:bg-[#1e3544]" : ""}
                      >
                        {period}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <PerformanceChart timeframe={selectedTimeframe} data={dashboardData.performanceData} />
              </CardContent>
            </Card>

            {/* Reviews Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-[#2A4759]">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Your Reviews
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ReviewsOverview reviews={dashboardData.reviews} />
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-[#2A4759]">
                  <Calendar className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RecentActivity activities={dashboardData.recentActivity} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions />

            {/* Goals & Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-[#2A4759]">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Goals & Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Monthly Reviews</span>
                    <span className="text-sm text-gray-500">3/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#F79B72] h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Public Reviews</span>
                    <span className="text-sm text-gray-500">2/3</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#90D1CA] h-2 rounded-full" style={{ width: "67%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Reader Engagement</span>
                    <span className="text-sm text-gray-500">89/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#2A4759] h-2 rounded-full" style={{ width: "89%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Latest Reader Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-[#2A4759]">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Latest Reader Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.latestFeedback.map((feedback, index) => (
                  <div key={index} className="border-b last:border-b-0 pb-3 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#90D1CA] flex items-center justify-center text-white text-sm font-semibold">
                        {feedback.readerName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-[#2A4759]">{feedback.readerName}</span>
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < feedback.rating ? "text-[#F79B72] fill-[#F79B72]" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">{feedback.comment}</p>
                        <div className="text-xs text-gray-500 mt-1">{feedback.bookTitle}</div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View All Feedback
                </Button>
              </CardContent>
            </Card>

            {/* Recommended Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-[#2A4759]">
                  <Users className="h-5 w-5 mr-2" />
                  Recommended Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboardData.recommendedServices.map((service, index) => (
                  <div key={index} className="p-3 bg-[#F2F2F2] rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-[#2A4759] text-sm">{service.category}</div>
                        <div className="text-xs text-gray-600 mt-1">{service.reason}</div>
                        <div className="text-xs text-[#F79B72] mt-1">{service.providers} providers available</div>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        Browse
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View All Services
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}