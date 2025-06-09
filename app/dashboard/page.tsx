"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Upload, Eye, EyeOff, Star, TrendingUp, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockReviews = [
  {
    id: 1,
    title: "The Digital Frontier",
    date: "2024-01-15",
    score: 87,
    status: "public",
    views: 234,
    clicks: 12,
  },
  {
    id: 2,
    title: "Shadows of Tomorrow",
    date: "2024-01-10",
    score: 92,
    status: "private",
    views: 0,
    clicks: 0,
  },
  {
    id: 3,
    title: "Love in the Time of AI",
    date: "2024-01-05",
    score: 78,
    status: "public",
    views: 156,
    clicks: 8,
  },
]

export default function AuthorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const totalReviews = mockReviews.length
  const publicReviews = mockReviews.filter((r) => r.status === "public").length
  const averageScore = Math.round(mockReviews.reduce((acc, r) => acc + r.score, 0) / totalReviews)
  const totalViews = mockReviews.reduce((acc, r) => acc + r.views, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">AIbookReview</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome back, Sarah!</span>
            <Button variant="outline" size="sm">
              Settings
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Author Dashboard</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/upload">
                <Upload className="mr-2 h-5 w-5" />
                Start New Review
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/discover">
                <Eye className="mr-2 h-5 w-5" />
                View My Public Reviews
              </Link>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalReviews}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Public Reviews</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{publicReviews}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageScore}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalViews}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>Your latest manuscript analyses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{review.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {review.date}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{review.score}</div>
                          <div className="text-xs text-gray-500">AI Score</div>
                        </div>
                        <Badge variant={review.status === "public" ? "default" : "secondary"}>
                          {review.status === "public" ? (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Public
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              Private
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All My Reviews</CardTitle>
                <CardDescription>Manage your manuscript reviews and visibility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{review.title}</h3>
                        <p className="text-sm text-gray-600">Reviewed on {review.date}</p>
                        <div className="flex items-center mt-2">
                          <Progress value={review.score} className="w-32 mr-4" />
                          <span className="text-sm font-medium">{review.score}/100</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={review.status === "public" ? "default" : "secondary"}>
                          {review.status === "public" ? "Public" : "Private"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          {review.status === "public" ? "Make Private" : "Make Public"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Public Review Performance</CardTitle>
                  <CardDescription>Views and engagement for your public reviews</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockReviews
                      .filter((r) => r.status === "public")
                      .map((review) => (
                        <div key={review.id} className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{review.title}</h4>
                            <p className="text-sm text-gray-600">Score: {review.score}/100</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-sm">
                              <Eye className="h-4 w-4 mr-1" />
                              {review.views} views
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              {review.clicks} clicks
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                  <CardDescription>Your AI quality scores over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>90-100 (Excellent)</span>
                      <div className="flex items-center">
                        <Progress value={33} className="w-20 mr-2" />
                        <span className="text-sm">1 book</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>80-89 (Very Good)</span>
                      <div className="flex items-center">
                        <Progress value={33} className="w-20 mr-2" />
                        <span className="text-sm">1 book</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>70-79 (Good)</span>
                      <div className="flex items-center">
                        <Progress value={33} className="w-20 mr-2" />
                        <span className="text-sm">1 book</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
