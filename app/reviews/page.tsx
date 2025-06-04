/**
 * REQUIREMENTS REFERENCES:
 *
 * [REQ-UI-003] Book Browse/Discovery Page
 * - Grid layout displaying book covers, titles, authors, and AI scores
 * - Search functionality by title, author, keywords
 * - Filter options: genre, language, AI quality score, reader ratings
 * - Sort options: date added, AI score, reader rating, title, author
 * - Pagination for large result sets
 *
 * [REQ-FUNC-002] Search and Filter Functionality
 * - Advanced search with multiple criteria
 * - Real-time filtering without page reload
 * - Clear filter states and reset options
 *
 * [REQ-FUNC-003] Book Discovery Features
 * - Display AI quality scores prominently
 * - Show reader ratings and review counts
 * - Genre and language indicators
 * - Keyword tags for better discoverability
 *
 * [REQ-UI-002] Navigation Structure
 * - Consistent header navigation
 * - Clear breadcrumbs and navigation paths
 *
 * [REQ-CONTENT-004] Book Information Display
 * - Cover images, titles, authors, genres
 * - AI scores and reader ratings
 * - Publication dates and language indicators
 */

"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Search, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react"
import BookReviewCard from "@/components/book-review-card"
import FilterSidebar from "@/components/filter-sidebar"
import { mockReviews } from "@/lib/mock-data"

export default function ReviewsOverview() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    genres: [] as string[],
    languages: [] as string[],
    qualityScoreRange: [0, 100] as [number, number],
    readerRatingRange: [0, 5] as [number, number],
    keywords: [] as string[],
  })

  const itemsPerPage = 12

  // Filter and sort reviews
  const filteredReviews = mockReviews.filter((review) => {
    const matchesSearch =
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.blurb.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGenre = filters.genres.length === 0 || filters.genres.includes(review.genre)
    const matchesLanguage = filters.languages.length === 0 || filters.languages.includes(review.language)
    const matchesQualityScore =
      review.aiQualityScore >= filters.qualityScoreRange[0] && review.aiQualityScore <= filters.qualityScoreRange[1]
    const matchesReaderRating =
      review.averageReaderRating >= filters.readerRatingRange[0] &&
      review.averageReaderRating <= filters.readerRatingRange[1]
    const matchesKeywords =
      filters.keywords.length === 0 ||
      filters.keywords.some((keyword) =>
        review.keywords.some((reviewKeyword) => reviewKeyword.toLowerCase().includes(keyword.toLowerCase())),
      )

    return (
      matchesSearch && matchesGenre && matchesLanguage && matchesQualityScore && matchesReaderRating && matchesKeywords
    )
  })

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    let comparison = 0
    switch (sortBy) {
      case "title":
        comparison = a.title.localeCompare(b.title)
        break
      case "author":
        comparison = a.author.localeCompare(b.author)
        break
      case "aiScore":
        comparison = a.aiQualityScore - b.aiQualityScore
        break
      case "readerRating":
        comparison = a.averageReaderRating - b.averageReaderRating
        break
      case "date":
      default:
        comparison = new Date(a.reviewDate).getTime() - new Date(b.reviewDate).getTime()
        break
    }
    return sortOrder === "desc" ? -comparison : comparison
  })

  // Pagination
  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedReviews = sortedReviews.slice(startIndex, startIndex + itemsPerPage)

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <BookOpen className="h-8 w-8 text-[#2A4759]" />
            <span className="ml-2 text-2xl font-bold text-[#2A4759]">AIbookReview</span>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-[#F79B72]">
              Home
            </Link>
            <Link href="/reviews" className="text-[#F79B72] font-semibold">
              Browse Books
            </Link>
            <Link href="/authors" className="text-gray-600 hover:text-[#F79B72]">
              For Authors
            </Link>
            <Link href="/services" className="text-gray-600 hover:text-[#F79B72]">
              Services
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="hidden sm:inline-flex border-[#2A4759] text-[#2A4759] hover:bg-[#2A4759] hover:text-white"
            >
              Log In
            </Button>
            <Button className="bg-[#F79B72] hover:bg-[#e68a61] text-white">Register</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2A4759] mb-4">Uncover Your Next Literary Gem</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Dive into our AI-curated collection of self-published books and discover your next favorite read. We help
            you find quality, original stories with confidence.
          </p>
        </div>

        {/* Search and Controls */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search books, authors, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date Added</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="author">Author</SelectItem>
                    <SelectItem value="aiScore">AI Score</SelectItem>
                    <SelectItem value="readerRating">Reader Rating</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {paginatedReviews.length} of {filteredReviews.length} books
            {searchTerm && <span> for "{searchTerm}"</span>}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-80 flex-shrink-0`}>
            <FilterSidebar filters={filters} onFiltersChange={handleFilterChange} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Book Grid */}
            {paginatedReviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedReviews.map((review) => (
                  <BookReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No books found</h3>
                <p className="text-gray-500">Try adjusting your search terms or filters</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={currentPage === pageNum ? "bg-[#2A4759] hover:bg-[#1e3544]" : ""}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
