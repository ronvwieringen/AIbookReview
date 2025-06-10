"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Upload, Eye, EyeOff, Star, TrendingUp, Calendar, ExternalLink, LogOut } from "lucide-react"
import Link from "next/link"
import { supabase } from '@/lib/supabase/client'

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

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        router.push('/login')
        return
      }

      setUser(session.user)

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profileError) {
        console.error('Profile error:', profileError)
      } else {
        setProfile(profileData)
      }
    } catch (error) {
      console.error('Auth error:', error)
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

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
            <BookOpen className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold">AIbookReview</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome back, {profile?.full_name || user?.email}!</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">
            {profile?.role === 'author' ? 'Author Dashboard' : 'Reader Dashboard'}
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            {profile?.role === 'author' ? (
              <>
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
              </>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link href="/discover">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Discover Books
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/authors">
                    <Upload className="mr-2 h-5 w-5" />
                    Become an Author
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">
              {profile?.role === 'author' ? 'My Reviews' : 'Reading List'}
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {profile?.role === 'author' ? 'Total Reviews' : 'Books Saved'}
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalReviews}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {profile?.role === 'author' ? 'Public Reviews' : 'Books Read'}
                  </CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{publicReviews}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {profile?.role === 'author' ? 'Average Score' : 'Avg Rating Given'}
                  </CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageScore}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {profile?.role === 'author' ? 'Total Views' : 'Reviews Written'}
                  </CardTitle>
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
                <CardTitle>
                  {profile?.role === 'author' ? 'Recent Reviews' : 'Recently Saved Books'}
                </CardTitle>
                <CardDescription>
                  {profile?.role === 'author' 
                    ? 'Your latest manuscript analyses' 
                    : 'Books you\'ve recently added to your reading list'
                  }
                </CardDescription>
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
                          <div className="text-2xl font-bold text-amber-600">{review.score}</div>
                          <div className="text-xs text-gray-500">
                            {profile?.role === 'author' ? 'AI Score' : 'Your Rating'}
                          </div>
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

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {profile?.role === 'author' ? 'All My Reviews' : 'My Reading List'}
                </CardTitle>
                <CardDescription>
                  {profile?.role === 'author' 
                    ? 'Manage your manuscript reviews and visibility' 
                    : 'Books you\'ve saved and want to read'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{review.title}</h3>
                        <p className="text-sm text-gray-600">
                          {profile?.role === 'author' ? `Reviewed on ${review.date}` : `Added on ${review.date}`}
                        </p>
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
                        {profile?.role === 'author' && (
                          <Button variant="outline" size="sm">
                            {review.status === "public" ? "Make Private" : "Make Public"}
                          </Button>
                        )}
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
                  <CardTitle>
                    {profile?.role === 'author' ? 'Public Review Performance' : 'Reading Statistics'}
                  </CardTitle>
                  <CardDescription>
                    {profile?.role === 'author' 
                      ? 'Views and engagement for your public reviews' 
                      : 'Your reading habits and preferences'
                    }
                  </CardDescription>
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
                  <CardTitle>
                    {profile?.role === 'author' ? 'Score Distribution' : 'Genre Preferences'}
                  </CardTitle>
                  <CardDescription>
                    {profile?.role === 'author' 
                      ? 'Your AI quality scores over time' 
                      : 'Your favorite book genres'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>{profile?.role === 'author' ? '90-100 (Excellent)' : 'Science Fiction'}</span>
                      <div className="flex items-center">
                        <Progress value={33} className="w-20 mr-2" />
                        <span className="text-sm">
                          {profile?.role === 'author' ? '1 book' : '8 books'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{profile?.role === 'author' ? '80-89 (Very Good)' : 'Fantasy'}</span>
                      <div className="flex items-center">
                        <Progress value={33} className="w-20 mr-2" />
                        <span className="text-sm">
                          {profile?.role === 'author' ? '1 book' : '5 books'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{profile?.role === 'author' ? '70-79 (Good)' : 'Mystery'}</span>
                      <div className="flex items-center">
                        <Progress value={33} className="w-20 mr-2" />
                        <span className="text-sm">
                          {profile?.role === 'author' ? '1 book' : '3 books'}
                        </span>
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