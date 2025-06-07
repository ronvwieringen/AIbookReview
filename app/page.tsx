/**
 * REQUIREMENTS REFERENCES:
 *
 * [REQ-UI-001] Landing Page Design
 * - Professional, clean design that builds trust
 * - Clear value proposition for all user types
 * - Prominent call-to-action buttons
 *
 * [REQ-UI-002] Navigation Structure
 * - Consistent navigation across all pages
 * - Clear user flow from landing to key actions
 *
 * [REQ-FUNC-001] User Registration/Login
 * - Registration and login buttons prominently displayed
 * - Clear path to account creation
 *
 * [REQ-CONTENT-001] Value Proposition Communication
 * - Clearly communicate benefits for authors, readers, and service providers
 * - Highlight AI-powered quality assessment
 * - Emphasize security and IP protection
 *
 * [REQ-CONTENT-002] How It Works Section
 * - Step-by-step explanation of the process
 * - Visual representation of the workflow
 *
 * [REQ-CONTENT-003] Testimonials and Social Proof
 * - User testimonials to build credibility
 * - Success stories from different user types
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, BookOpen, Shield, Users, BarChart, Globe, CheckCircle } from "lucide-react"
import HeroImage from "@/components/hero-image"
import FeatureCard from "@/components/feature-card"
import UserTypeValue from "@/components/user-type-value"
import HowItWorks from "@/components/how-it-works"
import Testimonial from "@/components/testimonial"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-[#2A4759]" />
              <span className="ml-2 text-2xl font-bold text-[#2A4759]">AIbookReview</span>
            </Link>
            <nav className="hidden md:flex ml-10 space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-[#F79B72]">
                Features
              </Link>
              <Link href="/authors" className="text-gray-600 hover:text-[#F79B72]">
                For Authors
              </Link>
              <Link href="/reviews" className="text-gray-600 hover:text-[#F79B72]">
                Browse Books
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-[#F79B72]">
                How It Works
              </Link>
            </nav>
          </div>
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

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                <h1 className="text-4xl md:text-5xl font-bold text-[#2A4759] leading-tight mb-6">
                  Find Self-Published Page-turners Using the Most Advanced AI Assistance
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Discover quality self-published books with AIbookReview. Our platform connects you with hidden
                  literary treasures, offering transparent AI analysis and a supportive community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/reviews">
                    <Button className="bg-[#F79B72] hover:bg-[#e68a61] text-white text-lg py-6 px-8">
                      Browse Books
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/authors">
                    <Button
                      variant="outline"
                      className="border-[#2A4759] text-[#2A4759] hover:bg-[#2A4759] hover:text-white text-lg py-6 px-8"
                    >
                      For Authors
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <HeroImage />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-[#F2F2F2]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2A4759] mb-12">
              Transforming Self-Publishing with AI
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Users className="h-10 w-10 text-[#F79B72]" />}
                title="Connected Community"
                description="Authors, Readers, Service Providers and Publishing Platforms in one centralized ecosystem."
              />
              <FeatureCard
                icon={<BarChart className="h-10 w-10 text-[#F79B72]" />}
                title="AI Quality Assessment"
                description="Objective, detailed analysis and feedback on manuscripts with the most advanced AI technology, including unbiased quality scores."
              />
              <FeatureCard
                icon={<Shield className="h-10 w-10 text-[#F79B72]" />}
                title="Secure & Private"
                description="Manuscripts are not stored after analysis, protecting the author's intellectual property at all times."
              />
              <FeatureCard
                icon={<CheckCircle className="h-10 w-10 text-[#F79B72]" />}
                title="Plagiarism Detection"
                description="We ensure the integrity of all manuscripts with our built-in plagiarism detection system."
              />
              <FeatureCard
                icon={<BookOpen className="h-10 w-10 text-[#F79B72]" />}
                title="Promotional Blurbs"
                description="Authors get AI-generated promotional blurbs that capture the essence for marketing purposes."
              />
              <FeatureCard
                icon={<Globe className="h-10 w-10 text-[#F79B72]" />}
                title="Multilingual Support"
                description="Our platform supports multiple languages so reviews are in the same language as the manuscript."
              />
            </div>
          </div>
        </section>

        {/* For Authors Section */}
        <section id="for-readers" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2A4759] mb-12">
              Value for Every Audience
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <UserTypeValue
                userType="For Readers"
                icon={<Users className="h-12 w-12 text-white" />}
                benefits={[
                  "Discover quality self-published books",
                  "Make informed purchasing decisions",
                  "Engage with authors and community",
                  "Access transparent review information",
                  "Create personalized reading lists",
                ]}
                bgColor="bg-[#90D1CA]"
                ctaText="Browse Books"
                ctaLink="/reviews"
              />
              <UserTypeValue
                userType="For Authors"
                icon={<BookOpen className="h-12 w-12 text-white" />}
                benefits={[
                  "Objective AI feedback on your manuscript",
                  "Increased credibility with readers",
                  "Connect with professional service providers",
                  "Transparent quality assessment",
                  "Secure handling of your intellectual property",
                ]}
                bgColor="bg-[#2A4759]"
                ctaText="See Benefits"
                ctaLink="/authors"
              />
              <UserTypeValue
                userType="For Service Providers"
                icon={<BarChart className="h-12 w-12 text-white" />}
                benefits={[
                  "Connect with authors needing your expertise",
                  "Showcase your services to a targeted audience",
                  "Receive AI-signaled leads",
                  "Build your reputation with reviews",
                  "Grow your client base efficiently",
                ]}
                bgColor="bg-[#F79B72]"
                ctaText="Join Marketplace"
                ctaLink="/services"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 bg-[#F2F2F2]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2A4759] mb-12">How AIbookReview Works</h2>
            <HowItWorks />
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2A4759] mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Testimonial
                quote="AIbookReview gave me the confidence to publish my first novel. The AI feedback was incredibly detailed and helped me improve my manuscript significantly."
                author="Sarah J., Self-Published Author"
                rating={5}
              />
              <Testimonial
                quote="As a reader, I love being able to find quality self-published books. The transparency about the creation process and AI reviews helps me make better choices."
                author="Michael T., Avid Reader"
                rating={5}
              />
              <Testimonial
                quote="The platform has connected me with authors who genuinely need my editing services. It's been a game-changer for my freelance business."
                author="Elena R., Professional Editor"
                rating={5}
              />
            </div>
          </div>
        </section>

     
      </main>

      <Footer />
    </div>
  )
}