/**
 * FAQ Page
 * 
 * Frequently Asked Questions page for AIbookReview.com
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ArrowLeft } from "lucide-react"

export default function FAQPage() {
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
            <Link href="/authors" className="text-gray-600 hover:text-[#F79B72]">
              For Authors
            </Link>
            <Link href="/services" className="text-gray-600 hover:text-[#F79B72]">
              Services
            </Link>
            <Link href="/faq" className="text-[#F79B72] font-semibold">
              FAQ
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
            href="/"
            className="inline-flex items-center text-[#2A4759] hover:text-[#F79B72] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2A4759] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Find answers to common questions about AIbookReview.com. If you can't find what you're looking for, 
            feel free to contact our support team.
          </p>
        </div>

        {/* FAQ Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#2A4759]">Coming Soon</CardTitle>
            <CardDescription>
              We're working on compiling the most frequently asked questions to help you get the most out of AIbookReview.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">FAQ Content Coming Soon</h3>
              <p className="text-gray-500 mb-6">
                We're currently preparing comprehensive answers to help you understand our platform better.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">In the meantime, you can:</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/authors">
                    <Button variant="outline" className="border-[#2A4759] text-[#2A4759] hover:bg-[#2A4759] hover:text-white">
                      Learn About Our Services
                    </Button>
                  </Link>
                  <Link href="/reviews">
                    <Button className="bg-[#F79B72] hover:bg-[#e68a61] text-white">
                      Browse Book Reviews
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-[#2A4759]">Need Help?</CardTitle>
            <CardDescription>
              Can't find the answer you're looking for? We're here to help.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-[#2A4759] mb-2">Contact Support</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Get in touch with our support team for personalized assistance.
                </p>
                <Button variant="outline" className="border-[#2A4759] text-[#2A4759] hover:bg-[#2A4759] hover:text-white">
                  Contact Support
                </Button>
              </div>
              <div>
                <h4 className="font-semibold text-[#2A4759] mb-2">Documentation</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Explore our comprehensive guides and documentation.
                </p>
                <Button variant="outline" className="border-[#2A4759] text-[#2A4759] hover:bg-[#2A4759] hover:text-white">
                  View Documentation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}