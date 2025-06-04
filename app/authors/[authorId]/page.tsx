/**
 * REQUIREMENTS REFERENCES:
 *
 * [REQ-UI-006] Public Author Profile Page
 * - Display author information and biography
 * - List of published books with reviews
 * - Author statistics and achievements
 * - Contact and social media information
 * - Reader reviews about the author
 *
 * [REQ-FUNC-008] Author Discovery
 * - Allow readers to discover authors
 * - Browse author portfolios
 * - Connect with favorite authors
 * - Follow author updates
 *
 * [REQ-CONTENT-006] Author Information Display
 * - Complete author profile
 * - Professional background
 * - Published works catalog
 * - Social media integration
 */

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MapPin, Globe, Twitter, Instagram, Star, Users, BookMarked, Heart } from "lucide-react"
import { mockReviews } from "@/lib/mock-data"

interface PageProps {
  params: {
    authorId: string
  }
}

// Mock author data - in a real app, this would come from a database
const getAuthorData = (authorId: string) => {
  const authorProfiles = {
    "author-1": {
      id: "author-1",
      name: "Sarah Chen",
      bio: "Sarah Chen is a digital nomad, entrepreneur, and bestselling author who has been living location-independently for over 8 years. She has built multiple successful online businesses while traveling to over 50 countries.",
      fullBio:
        "Sarah Chen began her journey as a traditional corporate consultant before discovering the freedom of digital nomadism in 2016. Since then, she has built three successful online businesses, spoken at numerous conferences about remote work and entrepreneurship, and helped thousands of people transition to location-independent lifestyles. Her practical approach to business building and authentic storytelling have made her a trusted voice in the digital nomad community.",
      avatar: "/placeholder.svg?height=200&width=200&text=Sarah+Chen",
      location: "Currently in Lisbon, Portugal",
      website: "https://sarahchen.com",
      twitter: "@sarahchen",
      instagram: "@sarahchen_nomad",
      totalBooks: 3,
      totalReviews: 156,
      averageRating: 4.6,
      followers: 12500,
      joinedDate: "2020-03-15",
      achievements: ["Bestselling Author", "Digital Nomad Expert", "TEDx Speaker", "Forbes Contributor"],
    },
    "author-2": {
      id: "author-2",
      name: "Marcus Rodriguez",
      bio: "Marcus Rodriguez is a science fiction author specializing in cyberpunk and near-future narratives. His work explores the intersection of technology, consciousness, and human identity.",
      fullBio:
        "Marcus Rodriguez has been writing science fiction for over a decade, with a particular focus on cyberpunk and technological thrillers. His background in computer science and philosophy informs his writing, creating stories that are both technically grounded and philosophically rich. He has been nominated for several genre awards and his work has been translated into multiple languages.",
      avatar: "/placeholder.svg?height=200&width=200&text=Marcus+R",
      location: "San Francisco, CA",
      website: "https://marcusrodriguez.net",
      twitter: "@marcusrodriguezSF",
      instagram: "@marcusrodriguez_author",
      totalBooks: 5,
      totalReviews: 234,
      averageRating: 4.3,
      followers: 8900,
      joinedDate: "2019-08-22",
      achievements: ["Hugo Award Nominee", "Nebula Award Finalist", "Computer Scientist", "Philosophy PhD"],
    },
  }

  return authorProfiles[authorId as keyof typeof authorProfiles] || null
}

const getAuthorBooks = (authorId: string) => {
  return mockReviews.filter((review) => review.authorId === authorId)
}

const getAuthorReviews = (authorId: string) => {
  // Mock reader reviews about the author
  const authorReviews = {
    "author-1": [
      {
        reviewerName: "Jennifer Walsh",
        rating: 5,
        comment:
          "Sarah's writing style is incredibly engaging and practical. Her real-world experience shines through every page, making complex concepts easy to understand and implement.",
        date: "2024-01-25",
        verifiedReader: true,
      },
      {
        reviewerName: "Tom Bradley",
        rating: 5,
        comment:
          "I've read all of Sarah's books and they've completely transformed my approach to remote work. Her authenticity and practical advice are unmatched.",
        date: "2024-01-20",
        verifiedReader: true,
      },
      {
        reviewerName: "Maria Santos",
        rating: 4,
        comment:
          "Sarah provides excellent insights into the digital nomad lifestyle. Her books are well-researched and full of actionable advice.",
        date: "2024-01-18",
        verifiedReader: false,
      },
    ],
    "author-2": [
      {
        reviewerName: "Alex Thompson",
        rating: 5,
        comment:
          "Marcus creates incredibly immersive cyberpunk worlds. His technical background really shows in the authenticity of his technological concepts.",
        date: "2024-01-22",
        verifiedReader: true,
      },
      {
        reviewerName: "Rachel Kim",
        rating: 4,
        comment:
          "Rodriguez's exploration of consciousness and identity in a technological age is thought-provoking and brilliantly executed.",
        date: "2024-01-19",
        verifiedReader: true,
      },
    ],
  }

  return authorReviews[authorId as keyof typeof authorReviews] || []
}

export default function AuthorProfilePage({ params }: PageProps) {
  const author = getAuthorData(params.authorId)
  const authorBooks = getAuthorBooks(params.authorId)
  const authorReviews = getAuthorReviews(params.authorId)

  if (!author) {
    notFound()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-[#F79B72] fill-[#F79B72]"
            : i < rating
              ? "text-[#F79B72] fill-[#F79B72] opacity-50"
              : "text-gray-300"
        }`}
      />
    ))
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
            <Link href="/reviews" className="text-gray-600 hover:text-[#F79B72]">
              Browse Books
            </Link>
            <Link href="/authors" className="text-[#F79B72] font-semibold">
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
        {/* Author Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <div className="relative w-48 h-48 mx-auto md:mx-0">
                  <Image
                    src={author.avatar || "/placeholder.svg"}
                    alt={author.name}
                    fill
                    className="object-cover rounded-full shadow-lg"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-[#2A4759] mb-2">{author.name}</h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{author.location}</span>
                    </div>
                  </div>
                  <Button className="bg-[#F79B72] hover:bg-[#e68a61] text-white mt-4 md:mt-0">
                    <Heart className="h-4 w-4 mr-2" />
                    Follow Author
                  </Button>
                </div>

                <p className="text-gray-700 text-lg mb-6 leading-relaxed">{author.bio}</p>

                {/* Author Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-[#F2F2F2] rounded-lg">
                    <div className="text-2xl font-bold text-[#2A4759]">{author.totalBooks}</div>
                    <div className="text-sm text-gray-600">Books Published</div>
                  </div>
                  <div className="text-center p-3 bg-[#F2F2F2] rounded-lg">
                    <div className="text-2xl font-bold text-[#2A4759]">{author.totalReviews}</div>
                    <div className="text-sm text-gray-600">Total Reviews</div>
                  </div>
                  <div className="text-center p-3 bg-[#F2F2F2] rounded-lg">
                    <div className="text-2xl font-bold text-[#2A4759]">{author.averageRating}</div>
                    <div className="text-sm text-gray-600">Avg Rating</div>
                  </div>
                  <div className="text-center p-3 bg-[#F2F2F2] rounded-lg">
                    <div className="text-2xl font-bold text-[#2A4759]">{author.followers.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Followers</div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap gap-4">
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-[#2A4759] hover:text-[#F79B72] transition-colors"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Website
                  </a>
                  <a
                    href={`https://twitter.com/${author.twitter.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-[#2A4759] hover:text-[#F79B72] transition-colors"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    {author.twitter}
                  </a>
                  <a
                    href={`https://instagram.com/${author.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-[#2A4759] hover:text-[#F79B72] transition-colors"
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    {author.instagram}
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Published Books */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-[#2A4759]">
                  <BookMarked className="h-6 w-6 mr-2" />
                  Published Books ({authorBooks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {authorBooks.map((book) => (
                    <Link key={book.id} href={`/reviews/${book.id}`} className="group block">
                      <div className="flex gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow">
                        <div className="relative w-16 h-20 flex-shrink-0">
                          <Image
                            src={book.coverImage || "/placeholder.svg"}
                            alt={book.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#2A4759] group-hover:text-[#F79B72] transition-colors mb-1">
                            {book.title}
                          </h3>
                          <div className="flex items-center mb-2">
                            {renderStars(book.averageReaderRating)}
                            <span className="ml-2 text-sm text-gray-600">({book.readerReviewCount})</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-xs">
                              {book.genre}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* About the Author */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2A4759]">About the Author</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">{author.fullBio}</p>

                <div className="mb-4">
                  <h4 className="font-semibold text-[#2A4759] mb-2">Achievements</h4>
                  <div className="flex flex-wrap gap-2">
                    {author.achievements.map((achievement, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  Member since{" "}
                  {new Date(author.joinedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Reader Reviews about Author */}
            {authorReviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-[#2A4759]">
                    <Users className="h-6 w-6 mr-2" />
                    What Readers Say About {author.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {authorReviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-[#2A4759]">{review.reviewerName}</span>
                              {review.verifiedReader && (
                                <Badge variant="secondary" className="text-xs">
                                  Verified Reader
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center">{renderStars(review.rating)}</div>
                          </div>
                          <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2A4759]">Connect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-[#F79B72] hover:bg-[#e68a61]">
                  <Heart className="h-4 w-4 mr-2" />
                  Follow Author
                </Button>

                <div className="space-y-3">
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-[#2A4759] hover:text-[#F79B72] transition-colors"
                  >
                    <Globe className="h-4 w-4 mr-3" />
                    Visit Website
                  </a>
                  <a
                    href={`https://twitter.com/${author.twitter.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-[#2A4759] hover:text-[#F79B72] transition-colors"
                  >
                    <Twitter className="h-4 w-4 mr-3" />
                    Follow on Twitter
                  </a>
                  <a
                    href={`https://instagram.com/${author.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-[#2A4759] hover:text-[#F79B72] transition-colors"
                  >
                    <Instagram className="h-4 w-4 mr-3" />
                    Follow on Instagram
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2A4759]">Stay Updated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Get notified when {author.name} publishes new books or updates.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F79B72]"
                  />
                  <Button className="w-full bg-[#2A4759] hover:bg-[#1e3a4a]">Subscribe to Updates</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
