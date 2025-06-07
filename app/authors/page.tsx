/**
 * REQUIREMENTS REFERENCES:
 *
 * [REQ-UI-001] Landing Page Design
 * - Professional, clean design that builds trust
 * - Clear value proposition for authors
 * - Prominent call-to-action buttons
 *
 * [REQ-CONTENT-001] Value Proposition Communication
 * - Clearly communicate benefits for authors
 * - Highlight AI-powered quality assessment
 * - Emphasize security and IP protection
 *
 * [REQ-FUNC-008] Manuscript Upload Process
 * - Clear explanation of upload workflow
 * - File format support information
 * - Security and privacy assurances
 *
 * [REQ-FUNC-009] AI Analysis Workflow
 * - Detailed explanation of AI analysis process
 * - Quality assessment features
 * - Plagiarism detection capabilities
 *
 * [REQ-FUNC-007] Service Provider Integration
 * - Connection to professional services
 * - AI-suggested service recommendations
 * - Service marketplace integration
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronRight,
  BookOpen,
  Shield,
  Users,
  BarChart,
  Upload,
  CheckCircle,
  FileText,
  Zap,
  Target,
  Globe,
  ArrowRight,
  ArrowDown,
} from "lucide-react"
import FeatureCard from "@/components/feature-card"
import Testimonial from "@/components/testimonial"
import Footer from "@/components/footer"

export default function AuthorsLandingPage() {
  const authorBenefits = [
    {
      icon: <BarChart className="h-8 w-8 text-[#F79B72]" />,
      title: "Objective AI Feedback",
      description:
        "Get comprehensive, unbiased analysis of your manuscript with detailed quality scores and actionable improvement suggestions.",
    },
    {
      icon: <Shield className="h-8 w-8 text-[#F79B72]" />,
      title: "IP Protection Guaranteed",
      description:
        "Your manuscripts are securely processed and automatically deleted after analysis. Your intellectual property remains completely protected.",
    },
    {
      icon: <Users className="h-8 w-8 text-[#F79B72]" />,
      title: "Connect with Readers",
      description:
        "Increase your book's discoverability and build credibility with readers through transparent AI reviews and quality scores.",
    },
    {
      icon: <Target className="h-8 w-8 text-[#F79B72]" />,
      title: "Professional Services",
      description:
        "Get AI-powered recommendations for editors, cover designers, and other professionals based on your manuscript's specific needs.",
    },
    {
      icon: <FileText className="h-8 w-8 text-[#F79B72]" />,
      title: "Marketing Content",
      description:
        "Receive AI-generated promotional blurbs, summaries, and marketing copy to help promote your book effectively.",
    },
    {
      icon: <Globe className="h-8 w-8 text-[#F79B72]" />,
      title: "Multilingual Support",
      description:
        "Submit manuscripts in multiple languages including English, Dutch, German, French, Spanish, Italian, and Portuguese.",
    },
  ]

  const processSteps = [
    {
      number: 1,
      title: "Upload Your Manuscript",
      description:
        "Securely upload your manuscript in PDF, DOCX, TXT, or MD format. Our system automatically extracts metadata and ensures your IP is protected.",
      features: ["Multiple file formats", "Automatic metadata extraction", "Secure encryption", "IP protection"],
    },
    {
      number: 2,
      title: "AI Analysis & Review",
      description:
        "Our advanced AI analyzes your manuscript for quality, originality, and marketability, providing detailed feedback and scores.",
      features: ["Quality assessment", "Plagiarism detection", "Style analysis", "Genre-specific feedback"],
    },
    {
      number: 3,
      title: "Review & Improve",
      description:
        "Access your comprehensive AI review with actionable feedback, promotional content, and service recommendations.",
      features: ["Detailed feedback", "Promotional blurbs", "Service recommendations", "Quality scores"],
    },
    {
      number: 4,
      title: "Publish & Connect",
      description:
        "Choose to make your review public, connect with readers, and link to where your book can be purchased.",
      features: ["Public/private options", "Reader engagement", "Purchase links", "Author profile"],
    },
  ]

  const pricingPlans = [
    {
      name: "Free Review",
      price: "€0",
      description: "Perfect for getting started",
      features: [
        "Basic AI quality assessment",
        "Plagiarism detection",
        "Simple promotional blurb",
        "Basic service recommendations",
        "Public review option",
      ],
      cta: "Get Free Review",
      popular: false,
    },
    {
      name: "In-Depth Review",
      price: "€29",
      description: "Comprehensive analysis for serious authors",
      features: [
        "Detailed AI quality assessment",
        "Advanced plagiarism detection",
        "Multiple promotional blurbs",
        "Comprehensive service recommendations",
        "Priority processing",
        "Author dashboard access",
        "Marketing content package",
      ],
      cta: "Upgrade to In-Depth",
      popular: true,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
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

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#2A4759] to-[#1e3544] text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Elevate Your Self-Publishing Journey with AI-Powered Reviews
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
                Get objective, comprehensive feedback on your manuscript. Build credibility with readers and connect
                with professional services—all while protecting your intellectual property.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/author/upload">
                  <Button className="bg-[#F79B72] hover:bg-[#e68a61] text-white text-lg py-6 px-8">
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Your Manuscript
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-white text-white bg-white/10 hover:bg-white hover:text-[#2A4759] text-lg py-6 px-8"
                >
                  See Sample Review
                </Button>
              </div>
              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-300">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Free to start
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  IP protected
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Results in minutes
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2A4759] mb-12">
              Why Authors Choose AIbookReview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {authorBenefits.map((benefit, index) => (
                <FeatureCard key={index} icon={benefit.icon} title={benefit.title} description={benefit.description} />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section - Vertical Layout with Arrows */}
        <section className="py-16 bg-[#F2F2F2]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2A4759] mb-12">
              How It Works for Authors
            </h2>
            <div className="max-w-3xl mx-auto">
              {processSteps.map((step, index) => (
                <div key={step.number} className="flex flex-col items-center">
                  <Card className="w-full relative overflow-hidden">
                    <CardHeader>
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-[#2A4759] text-white flex items-center justify-center text-xl font-bold mr-4">
                          {step.number}
                        </div>
                        <CardTitle className="text-xl text-[#2A4759]">{step.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {step.features.map((feature, featureIndex) => (
                          <Badge key={featureIndex} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Arrow pointing to next step */}
                  {index < processSteps.length - 1 && (
                    <div className="flex justify-center my-4">
                      <div className="w-12 h-12 rounded-full bg-[#F79B72] flex items-center justify-center shadow-md">
                        <ArrowDown className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2A4759] mb-12">
              Choose Your Review Level
            </h2>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              {pricingPlans.map((plan, index) => (
                <Card key={index} className={`relative ${plan.popular ? "border-[#F79B72] border-2" : ""}`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Badge className="bg-[#F79B72] text-white px-4 py-1">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-[#2A4759] mb-2">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold text-[#2A4759] mb-2">{plan.price}</div>
                    <p className="text-gray-600">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#F79B72] mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/author/upload">
                      <Button
                        className={`w-full ${plan.popular ? "bg-[#F79B72] hover:bg-[#e68a61] text-white" : "bg-[#2A4759] hover:bg-[#1e3544] text-white"}`}
                      >
                        {plan.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-[#F2F2F2]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2A4759] mb-12">What Authors Are Saying</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Testimonial
                quote="AIbookReview gave me the confidence to publish my first novel. The AI feedback was incredibly detailed and helped me improve my manuscript significantly."
                author="Sarah J., Self-Published Author"
                rating={5}
              />
              <Testimonial
                quote="The service recommendations were spot-on. I found an amazing editor through their platform who really understood my genre."
                author="Marcus R., Science Fiction Author"
                rating={5}
              />
              <Testimonial
                quote="I love the transparency. Readers can see the quality score and know they're getting a well-crafted book. It's helped my sales tremendously."
                author="Elena V., Non-Fiction Author"
                rating={5}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#2A4759] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Your AI Review?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of authors who have improved their manuscripts and connected with readers through
              AIbookReview. Start with a free review today.
            </p>
            <Link href="/author/upload">
              <Button className="bg-[#F79B72] hover:bg-[#e68a61] text-white text-lg py-6 px-8">
                <Upload className="mr-2 h-5 w-5" />
                Upload Your Manuscript Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}