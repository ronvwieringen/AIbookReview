"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Star, Calendar, Clock, ExternalLink, Heart, Share2, ChevronLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface BookData {
  id: string
  title: string
  author: string
  genre: string
  score: number
  language: string
  reviewDate: string
  publisher: string
  views: number
  cover: string
  summary: string
  description: string
  aiReview: {
    plotSummary: string
    strengths: string[]
    improvements: string[]
    writingStyle: string
    characterAnalysis: string
    thematicElements: string
    conclusion: string
    scoreBreakdown: {
      plot: number
      characters: number
      pacing: number
      writingStyle: number
      worldBuilding: number
      themes: number
      overall: number
    }
  }
  buyLinks: Array<{ name: string; url: string }>
  authorResponse: string
  keywords: string[]
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [book, setBook] = useState<BookData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("summary")
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  useEffect(() => {
    fetchBook()
  }, [params.id])

  const fetchBook = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/books/${params.id}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Book not found')
        }
        throw new Error('Failed to fetch book details')
      }

      const bookData = await response.json()
      setBook(bookData)
    } catch (error) {
      console.error('Error fetching book:', error)
      setError(error instanceof Error ? error.message : 'Failed to load book details')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveClick = () => {
    setShowLoginPrompt(true)
  }

  if (loading) {
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
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button className="bg-amber-600 hover:bg-amber-700" asChild>
                <Link href="/register">Join Free</Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-1">
                <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !book) {
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
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button className="bg-amber-600 hover:bg-amber-700" asChild>
                <Link href="/register">Join Free</Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {error === 'Book not found' ? 'Book Not Found' : 'Error Loading Book'}
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-x-4">
              <Button onClick={() => router.back()} variant="outline">
                Go Back
              </Button>
              <Button onClick={() => router.push('/discover')} className="bg-amber-600 hover:bg-amber-700">
                Browse Books
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
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
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700" asChild>
              <Link href="/register">Join Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button variant="ghost" className="mb-6 text-gray-600 hover:text-amber-600 pl-0" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Discover
        </Button>

        {/* Book Header */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="relative">
              <Image
                src={book.cover}
                alt={book.title}
                width={300}
                height={450}
                className="w-full rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=450&width=300&text=Book+Cover"
                }}
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-amber-600 text-white px-3 py-1 text-lg font-bold">
                  <Star className="h-4 w-4 mr-1" />
                  {book.score}
                </Badge>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  className="flex-1 mr-2 border-amber-200 text-amber-700 hover:bg-amber-50"
                  onClick={handleSaveClick}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" className="flex-1 ml-2 border-amber-200 text-amber-700 hover:bg-amber-50">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              <div className="bg-amber-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-gray-900">Where to Buy</h3>
                <div className="space-y-2">
                  {book.buyLinks.map((link) => (
                    <Button
                      key={link.name}
                      variant="outline"
                      className="w-full justify-start border-amber-200 text-amber-700 hover:bg-amber-100"
                      asChild
                    >
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {link.name}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="mb-4">
              <Badge variant="outline" className="mb-3 text-amber-700 border-amber-200">
                {book.genre}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
              <div className="flex items-center text-gray-500 text-sm space-x-4 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Reviewed {book.reviewDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{book.views} views</span>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="review">AI Review</TabsTrigger>
                <TabsTrigger value="author">Author's Note</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <p className="text-lg font-medium text-gray-900">{book.summary}</p>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
              </TabsContent>

              <TabsContent value="review" className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="text-5xl font-bold text-amber-600 mb-3">{book.score}</div>
                  <div className="text-xl font-semibold text-gray-900 mb-2">AI Quality Score</div>
                  <Badge className="bg-amber-600 text-white px-4 py-1">
                    <Star className="h-4 w-4 mr-1" />
                    {book.score >= 90 ? 'Excellent' : book.score >= 80 ? 'Very Good' : book.score >= 70 ? 'Good' : 'Fair'}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Plot Summary</h3>
                  <p className="text-gray-700 leading-relaxed">{book.aiReview.plotSummary}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Key Strengths</h3>
                    <ul className="space-y-2">
                      {book.aiReview.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Areas for Improvement</h3>
                    <ul className="space-y-2">
                      {book.aiReview.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Writing Style</h3>
                  <p className="text-gray-700 leading-relaxed">{book.aiReview.writingStyle}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Character Analysis</h3>
                  <p className="text-gray-700 leading-relaxed">{book.aiReview.characterAnalysis}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Thematic Elements</h3>
                  <p className="text-gray-700 leading-relaxed">{book.aiReview.thematicElements}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Conclusion</h3>
                  <p className="text-gray-700 leading-relaxed">{book.aiReview.conclusion}</p>
                </div>
              </TabsContent>

              <TabsContent value="author" className="space-y-4">
                <div className="bg-amber-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">From the Author</h3>
                  {book.authorResponse ? (
                    <p className="text-gray-700 leading-relaxed italic">{book.authorResponse}</p>
                  ) : (
                    <p className="text-gray-500 italic">The author hasn't provided a response to this review yet.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Login Prompt Dialog */}
        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Save this book?</h3>
                <p className="text-gray-600 mb-6">
                  Create a free account to save books to your reading list and get personalized recommendations.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="bg-amber-600 hover:bg-amber-700 flex-1" asChild>
                    <Link href="/register">Create Account</Link>
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowLoginPrompt(false)}>
                    Maybe Later
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t mt-8">
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