import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, Star, CheckCircle, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AuthorPortalPage() {
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
            <Link href="#how-it-works" className="text-gray-700 hover:text-amber-600 font-medium">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-gray-700 hover:text-amber-600 font-medium">
              Testimonials
            </Link>
            <Link href="/discover" className="text-gray-700 hover:text-amber-600 font-medium">
              Discover Books
            </Link>
          </nav>
          <div className="flex space-x-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700" asChild>
              <Link href="/register">Get Started</Link>
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
                Elevate Your Self-Published Books with <span className="text-amber-600">AI-Powered Reviews</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Get objective, AI-driven manuscript analysis to improve your work, build credibility, and connect with
                readers who love quality stories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-lg px-8 py-3" asChild>
                  <Link href="/upload">Analyze your manuscript</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3 border-amber-600 text-amber-700 hover:bg-amber-50"
                  asChild
                >
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/img_lady.jpg"
                  alt="Elegant hands writing with an ornate fountain pen, representing quality literary craftsmanship"
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
                    <div className="text-2xl font-bold text-gray-900">456</div>
                    <div className="text-sm text-gray-600">Authors Supported</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works for Authors</h2>
            <p className="text-xl text-gray-600">Simple steps to elevate your manuscript</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Upload</h3>
              <p className="text-gray-600">Upload your manuscript in .docx, .pdf, or .txt format</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Analyze</h3>
              <p className="text-gray-600">Our AI performs detailed analysis and generates comprehensive reviews</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Improve</h3>
              <p className="text-gray-600">Receive actionable feedback and an objective quality score (0-100)</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">Publish reviews to build credibility and connect with readers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Authors Choose AIbookReview</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your writing with AI-powered insights and build credibility with readers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <ul className="space-y-6">
                <li className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Objective AI-Powered Analysis</h3>
                    <p className="text-gray-600">Get objective AI-powered manuscript analysis with detailed feedback</p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Actionable Insights</h3>
                    <p className="text-gray-600">
                      Receive actionable insights to improve plot, pacing, and character development
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Build Credibility</h3>
                    <p className="text-gray-600">
                      Build credibility with transparent quality scores that readers trust
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Connect with Readers</h3>
                    <p className="text-gray-600">
                      Connect with quality-focused readers who appreciate good storytelling
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=600&text=Author+Dashboard"
                alt="Author Dashboard Preview"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Authors Say</h2>
            <p className="text-xl text-gray-600">Real feedback from authors who've transformed their writing</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Image
                    src="/placeholder.svg?height=50&width=50"
                    alt="Author"
                    width={50}
                    height={50}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-lg">Sarah Johnson</h4>
                    <p className="text-sm text-gray-600">Romance Author</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "The AI analysis helped me identify plot holes I completely missed. My book's quality score improved
                  from 72 to 89 after implementing the feedback!"
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Image
                    src="/placeholder.svg?height=50&width=50"
                    alt="Author"
                    width={50}
                    height={50}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-lg">Michael Chen</h4>
                    <p className="text-sm text-gray-600">Sci-Fi Author</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "Having an objective quality score gives me confidence when approaching readers. The transparency
                  builds trust that traditional publishing can't match."
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Image
                    src="/placeholder.svg?height=50&width=50"
                    alt="Author"
                    width={50}
                    height={50}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-lg">Emma Rodriguez</h4>
                    <p className="text-sm text-gray-600">Mystery Author</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "The detailed feedback on pacing and character development was invaluable. I've never had such
                  comprehensive analysis of my work."
                </p>
              </CardContent>
            </Card>
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
              <div className="text-4xl font-bold mb-2">456</div>
              <div className="text-amber-100">Authors Supported</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">87</div>
              <div className="text-amber-100">Average Quality Score</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">94%</div>
              <div className="text-amber-100">Author Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Elevate Your Writing?</h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Join thousands of authors who trust AI-powered analysis to improve their craft
          </p>
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-lg px-8 py-3" asChild>
            <Link href="/register">Start Your First Review</Link>
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
              <p className="text-gray-600">Connecting authors and readers through AI-powered book analysis.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Authors</h4>
              <ul className="space-y-2 text-gray-600">
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
                  <Link href="/dashboard" className="hover:text-amber-600">
                    Dashboard
                  </Link>
                </li>
              </ul>
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
