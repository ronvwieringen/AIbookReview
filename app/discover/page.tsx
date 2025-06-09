"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Star, BookOpen, ExternalLink, Heart, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data for books
const mockBooks = [
  {
    id: 1,
    title: "The Digital Frontier",
    author: "Sarah Johnson",
    genre: "Science Fiction",
    score: 87,
    language: "English",
    reviewDate: "2024-01-15",
    views: 234,
    cover: "/placeholder.svg?height=300&width=200",
    summary: "A thrilling journey through virtual worlds where reality and digital existence blur.",
    buyLinks: ["Amazon", "Barnes & Noble"],
  },
  {
    id: 2,
    title: "Love in the Time of AI",
    author: "Michael Chen",
    genre: "Romance",
    score: 92,
    language: "English",
    reviewDate: "2024-01-10",
    views: 456,
    cover: "/placeholder.svg?height=300&width=200",
    summary: "A heartwarming story about finding love in an increasingly digital world.",
    buyLinks: ["Amazon", "Apple Books"],
  },
  {
    id: 3,
    title: "Shadows of Tomorrow",
    author: "Emma Rodriguez",
    genre: "Mystery",
    score: 78,
    language: "English",
    reviewDate: "2024-01-05",
    views: 189,
    cover: "/placeholder.svg?height=300&width=200",
    summary: "A gripping mystery that keeps readers guessing until the very last page.",
    buyLinks: ["Amazon", "Kobo"],
  },
  {
    id: 4,
    title: "The Quantum Garden",
    author: "David Park",
    genre: "Science Fiction",
    score: 95,
    language: "English",
    reviewDate: "2024-01-01",
    views: 678,
    cover: "/placeholder.svg?height=300&width=200",
    summary: "An epic tale of quantum physics and parallel universes colliding.",
    buyLinks: ["Amazon", "Google Books"],
  },
]

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [minScore, setMinScore] = useState("0")
  const [sortBy, setSortBy] = useState("score")

  const filteredBooks = mockBooks
    .filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((book) => selectedGenre === "all" || book.genre.toLowerCase() === selectedGenre)
    .filter((book) => selectedLanguage === "all" || book.language.toLowerCase() === selectedLanguage)
    .filter((book) => book.score >= Number.parseInt(minScore))
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.score - a.score
        case "title":
          return a.title.localeCompare(b.title)
        case "author":
          return a.author.localeCompare(b.author)
        case "date":
          return new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime()
        default:
          return 0
      }
    })

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
            <Link href="/discover" className="text-amber-600 font-medium">
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
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Discover Quality Books</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore self-published books vetted by AI analysis. Find your next great read with confidence.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 mr-2 text-amber-600" />
              <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search books or authors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
              </div>

              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="border-gray-200 focus:border-amber-500 focus:ring-amber-500">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  <SelectItem value="science fiction">Science Fiction</SelectItem>
                  <SelectItem value="romance">Romance</SelectItem>
                  <SelectItem value="mystery">Mystery</SelectItem>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                  <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="border-gray-200 focus:border-amber-500 focus:ring-amber-500">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                </SelectContent>
              </Select>

              <Select value={minScore} onValueChange={setMinScore}>
                <SelectTrigger className="border-gray-200 focus:border-amber-500 focus:ring-amber-500">
                  <SelectValue placeholder="Min Score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any Score</SelectItem>
                  <SelectItem value="70">70+ Good</SelectItem>
                  <SelectItem value="80">80+ Very Good</SelectItem>
                  <SelectItem value="90">90+ Excellent</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-gray-200 focus:border-amber-500 focus:ring-amber-500">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">AI Score</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="author">Author</SelectItem>
                  <SelectItem value="date">Review Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600 text-lg">
            Showing <span className="font-semibold text-gray-900">{filteredBooks.length}</span> quality books
          </p>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={book.cover || "/placeholder.svg"}
                    alt={book.title}
                    width={200}
                    height={300}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-amber-600 hover:bg-amber-700 text-white font-bold">
                      <Star className="h-3 w-3 mr-1" />
                      {book.score}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 line-clamp-2 text-gray-900">{book.title}</h3>
                  <p className="text-gray-600 mb-3">by {book.author}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="border-amber-200 text-amber-700">
                      {book.genre}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="h-3 w-3 mr-1" />
                      {book.views}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed">{book.summary}</p>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {book.buyLinks.map((link) => (
                        <Button
                          key={link}
                          variant="outline"
                          size="sm"
                          className="text-xs border-amber-200 text-amber-700 hover:bg-amber-50"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {link}
                        </Button>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700" asChild>
                        <Link href={`/book/${book.id}`}>View Review</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <Card className="text-center py-16 border-0 shadow-lg">
            <CardContent>
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2 text-gray-900">No books found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all books.</p>
              <Button variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-50">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t mt-16">
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
