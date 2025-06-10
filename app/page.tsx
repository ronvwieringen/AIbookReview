import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, Star, Search, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
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

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Find Self-Published <span className="text-amber-600">Page-turners</span> Using Advanced AI
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Discover quality self-published books with AIbookReview. Our platform connects you with hidden literary
                treasures, offering transparent AI analysis and a supportive community of readers and authors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-lg px-8 py-3" asChild>
                  <Link href="/discover">Start Discovering</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3 border-amber-600 text-amber-700 hover:bg-amber-50"
                  asChild
                >
                  <Link href="/authors">For Authors</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/robot_reading.jpeg"
                  alt="AI robot reading a book in a cozy library setting, representing AI-powered book analysis"
                  width={600}
                  height={400}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">2,847</div>
                    <div className="text-sm text-gray-600">Quality Books Reviewed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Readers Love AIbookReview</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We use advanced AI to analyze every book, giving you confidence in your next read
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Discover Hidden Gems</h3>
                <p className="text-gray-600 leading-relaxed">
                  Find amazing self-published books that traditional publishers missed. Our AI helps surface quality
                  stories that deserve your attention.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Quality Guaranteed</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every book gets an objective AI quality score (0-100). No more wasting time on poorly written stories
                  - find your next favorite read with confidence.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Supportive Community</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect with fellow book lovers and discover new authors. Share reviews, get recommendations, and be
                  part of a growing literary community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to find your next great read</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Browse & Search</h3>
              <p className="text-gray-600">Explore our curated collection of AI-reviewed self-published books</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Check AI Scores</h3>
              <p className="text-gray-600">See objective quality ratings and detailed AI analysis for each book</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Read Reviews</h3>
              <p className="text-gray-600">Get detailed insights about plot, characters, and writing quality</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Purchase & Enjoy</h3>
              <p className="text-gray-600">Buy directly from your favorite retailers and dive into great stories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Books</h2>
              <p className="text-xl text-gray-600">Highly-rated recent discoveries</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/discover">View All Books</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "The Quantum Garden", author: "David Park", score: 95, genre: "Sci-Fi" },
              { title: "Love in Digital Times", author: "Sarah Chen", score: 92, genre: "Romance" },
              { title: "Midnight Mysteries", author: "Emma Rodriguez", score: 89, genre: "Mystery" },
              { title: "The Last Algorithm", author: "Michael Torres", score: 87, genre: "Thriller" },
            ].map((book, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={`/placeholder.svg?height=300&width=200&text=${book.title}`}
                      alt={book.title}
                      width={200}
                      height={300}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2 bg-amber-600 text-white px-2 py-1 rounded text-sm font-bold">
                      {book.score}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-1">{book.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{book.genre}</span>
                      <div className="flex items-center text-amber-600">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm ml-1">Highly Rated</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-amber-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">2,847</div>
              <div className="text-amber-100">Books Reviewed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1,234</div>
              <div className="text-amber-100">Happy Readers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">456</div>
              <div className="text-amber-100">Authors Supported</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">89%</div>
              <div className="text-amber-100">Reader Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Discover Your Next Favorite Book?</h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Join thousands of readers who trust AI-powered analysis to find quality self-published books
          </p>
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-lg px-8 py-3" asChild>
            <Link href="/discover">Browse Reviews</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t">
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
