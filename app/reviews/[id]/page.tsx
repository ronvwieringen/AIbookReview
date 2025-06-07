/**
 * REQUIREMENTS REFERENCES:
 *
 * [REQ-UI-004] Individual Book Review Page
 * - Comprehensive display of AI review results
 * - Book cover, title, author, and metadata
 * - AI quality score and detailed analysis
 * - Reader reviews and ratings section
 * - Purchase links and availability information
 *
 * [REQ-FUNC-004] AI Review Display
 * - Complete AI analysis with quality scores
 * - Plagiarism detection results
 * - AI-generated promotional blurb
 * - Detailed feedback and suggestions
 *
 * [REQ-FUNC-005] Reader Review System
 * - Display reader reviews and ratings
 * - Average rating calculation and display
 * - Review submission interface
 * - Verified purchase indicators
 *
 * [REQ-FUNC-006] Author Process Transparency
 * - Display author's process checklist
 * - Professional services used
 * - AI tools usage disclosure
 * - Author response to AI review
 *
 * [REQ-FUNC-007] Service Provider Integration
 * - AI-suggested service needs
 * - Links to relevant service providers
 * - Service recommendation based on AI analysis
 *
 * [REQ-CONTENT-005] Book Information Display
 * - Complete book metadata
 * - Genre, language, publication info
 * - Keywords and tags
 * - Purchase availability
 */

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BookOpen, ArrowLeft, Star, Shield, Calendar, User, CheckCircle, AlertTriangle } from "lucide-react"
import { mockReviews, getFullReviewData } from "@/lib/mock-data"
import AuthorProcessChecklist from "@/components/author-process-checklist"
import PurchaseLinks from "@/components/purchase-links"
import ReaderReviews from "@/components/reader-reviews"
import AuthorResponse from "@/components/author-response"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ReviewPresentationPage({ params }: PageProps) {
  const { id } = await params
  const review = mockReviews.find((r) => r.id === id)

  if (!review) {
    notFound()
  }

  const fullReviewData = getFullReviewData(id)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating)
            ? "text-[#F79B72] fill-[#F79B72]"
            : i < rating
              ? "text-[#F79B72] fill-[#F79B72] opacity-50"
              : "text-gray-300"
        }`}
      />
    ))
  }

  const getPlagiarismStatus = (score: number) => {
    if (score === 0) return { text: "No plagiarism detected", color: "text-green-600", icon: CheckCircle }
    if (score <= 5) return { text: "Minimal similarity found", color: "text-yellow-600", icon: AlertTriangle }
    return { text: "Potential plagiarism detected", color: "text-red-600", icon: AlertTriangle }
  }

  const plagiarismStatus = getPlagiarismStatus(review.plagiarismScore)
  const PlagiarismIcon = plagiarismStatus.icon

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
              Authors
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
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            href="/reviews"
            className="inline-flex items-center text-[#2A4759] hover:text-[#F79B72] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse Books
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Book Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative w-48 h-64 mx-auto md:mx-0">
                      <Image
                        src={review.coverImage || "/placeholder.svg"}
                        alt={`Cover of ${review.title}`}
                        fill
                        className="object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="mb-4">
                      <Badge variant="outline" className="mb-2">
                        {review.genre}
                      </Badge>
                      <Badge variant="secondary" className="ml-2">
                        {review.language.toUpperCase()}
                      </Badge>
                    </div>

                    <h1 className="text-3xl font-bold text-[#2A4759] mb-3">{review.title}</h1>

                    <div className="flex items-center mb-4">
                      <User className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-lg">
                        by{" "}
                        <Link
                          href={`/authors/${review.authorId}`}
                          className="text-[#2A4759] hover:text-[#F79B72] font-semibold"
                        >
                          {review.author}
                        </Link>
                      </span>
                    </div>

                    <div className="flex items-center mb-4">
                      <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-gray-600">
                        Reviewed on {new Date(review.reviewDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {review.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-gray-700 text-lg leading-relaxed">{fullReviewData.fullBlurb}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Quality Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-[#2A4759]">
                  <Shield className="h-6 w-6 mr-2" />
                  AI Quality Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-[#F2F2F2] rounded-lg">
                    <div className="text-3xl font-bold text-[#2A4759] mb-2">{review.aiQualityScore}/100</div>
                    <div className="text-sm text-gray-600">AI Quality Score</div>
                  </div>

                  <div className="text-center p-4 bg-[#F2F2F2] rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <PlagiarismIcon className={`h-6 w-6 ${plagiarismStatus.color}`} />
                    </div>
                    <div className={`text-sm font-medium ${plagiarismStatus.color}`}>{plagiarismStatus.text}</div>
                    <div className="text-xs text-gray-500 mt-1">{review.plagiarismScore}% similarity detected</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-[#2A4759] mb-3">AI-Generated Promotional Blurb</h3>
                  <div className="bg-[#F2F2F2] p-4 rounded-lg italic text-gray-700">
                    "{fullReviewData.promotionalBlurb}"
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-[#2A4759] mb-3">Book Summary</h3>
                  <p className="text-gray-700 mb-4">{fullReviewData.singleLineSummary}</p>
                  <p className="text-gray-700">{fullReviewData.detailedSummary}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-[#2A4759] mb-3">AI Review Summary</h3>
                  <p className="text-gray-700">{fullReviewData.reviewSummary}</p>
                </div>
              </CardContent>
            </Card>

            {/* Full AI Review */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2A4759]">Detailed AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: fullReviewData.fullReviewContent }} />
                </div>
              </CardContent>
            </Card>

            {/* Author Response */}
            {review.hasAuthorResponse && (
              <AuthorResponse authorName={review.author} response={fullReviewData.authorResponse} />
            )}

            {/* Reader Reviews */}
            <ReaderReviews
              bookId={review.id}
              averageRating={review.averageReaderRating}
              totalReviews={review.readerReviewCount}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reader Rating */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2A4759]">Reader Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#2A4759] mb-2">{review.averageReaderRating.toFixed(1)}</div>
                  <div className="flex justify-center mb-2">{renderStars(review.averageReaderRating)}</div>
                  <div className="text-sm text-gray-600">Based on {review.readerReviewCount} reviews</div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Links */}
            <PurchaseLinks bookId={review.id} />

            {/* Author Process Checklist */}
            <AuthorProcessChecklist bookId={review.id} />

            {/* AI-Signaled Service Needs */}
            {fullReviewData.serviceNeeds.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#2A4759]">AI-Suggested Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {fullReviewData.serviceNeeds.map((service, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-[#F2F2F2] rounded-lg">
                        <div className="h-2 w-2 rounded-full bg-[#F79B72] mt-2 flex-shrink-0"></div>
                        <div>
                          <div className="font-medium text-[#2A4759]">{service.category}</div>
                          <div className="text-sm text-gray-600">{service.suggestion}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-[#F79B72] hover:bg-[#e68a61]">Find Service Providers</Button>
                </CardContent>
              </Card>
            )}

            {/* Book Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2A4759]">Book Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span className="font-medium">{review.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Genre:</span>
                  <span className="font-medium">{review.genre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Review Date:</span>
                  <span className="font-medium">{new Date(review.reviewDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AI Score:</span>
                  <span className="font-medium">{review.aiQualityScore}/100</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}