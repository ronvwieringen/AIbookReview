"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Star, Calendar, Clock, ExternalLink, Heart, Share2, ChevronLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Mock data for a single book
const mockBookData = {
  id: 1,
  title: "The Digital Frontier",
  author: "Sarah Johnson",
  genre: "Science Fiction",
  score: 87,
  language: "English",
  reviewDate: "January 15, 2024",
  readTime: "8 min read",
  views: 234,
  cover: "/placeholder.svg?height=500&width=300&text=The+Digital+Frontier",
  summary: "A thrilling journey through virtual worlds where reality and digital existence blur.",
  description:
    "In the year 2150, humanity has developed technology that allows people to fully immerse themselves in digital realities. When brilliant programmer Maya Chen discovers a glitch that threatens to collapse both the virtual and physical worlds, she must navigate through increasingly dangerous digital landscapes to save both realities. 'The Digital Frontier' explores themes of identity, reality, and the human condition in an age where the line between physical and digital existence has disappeared.",
  aiReview: {
    plotSummary:
      "The Digital Frontier follows programmer Maya Chen who discovers that the boundary between the physical world and the immersive digital reality called the Frontier is breaking down. As glitches begin affecting real-world physics, Maya must enter increasingly unstable virtual worlds to find the source of the corruption. Along the way, she encounters digital entities that may have developed consciousness, corporate interests trying to weaponize the glitch, and her own past traumas manifested in digital form. The novel culminates in Maya having to make a choice between saving the physical world, the digital one, or finding a way to preserve both.",
    strengths: [
      "Exceptional world-building with detailed, believable technology",
      "Strong character development, particularly Maya's internal struggles",
      "Thought-provoking exploration of consciousness and reality",
      "Well-paced plot with escalating stakes and tension",
    ],
    improvements: [
      "Some secondary characters lack depth and motivation",
      "Technical explanations occasionally slow the narrative",
      "The middle section has pacing issues with repetitive scenarios",
    ],
    writingStyle:
      "Sarah Johnson employs a clean, precise prose style that effectively balances technical descriptions with emotional resonance. The writing features vivid sensory details that help distinguish between physical and various digital environments. Dialogue is natural and character-specific, though occasionally exposition-heavy.",
    characterAnalysis:
      "Maya Chen is a complex, well-developed protagonist whose technical brilliance is balanced by emotional scars from her past. Her character arc from isolated programmer to someone who connects deeply with both human and digital entities is compelling and believable. Supporting characters are generally well-crafted, though some antagonists fall into familiar corporate villain tropes.",
    thematicElements:
      "The novel skillfully explores themes of reality vs. simulation, the nature of consciousness, corporate ethics in technology, and human connection in a digital age. Johnson avoids simple answers to the philosophical questions raised, instead offering nuanced perspectives through different characters and scenarios.",
    conclusion:
      "The Digital Frontier is an ambitious and largely successful science fiction novel that combines engaging action with thoughtful exploration of profound questions. Despite some minor pacing issues and character limitations, the novel offers a fresh perspective on the increasingly blurred line between physical and digital existence. Readers who enjoy philosophical science fiction with strong technical foundations will find this a rewarding read.",
  },
  buyLinks: [
    { name: "Amazon", url: "#" },
    { name: "Barnes & Noble", url: "#" },
    { name: "Apple Books", url: "#" },
  ],
  authorNote:
    "I wanted to explore how our increasing immersion in digital spaces might eventually transform what it means to be human. The story grew from my fascination with virtual reality technology and philosophical questions about consciousness.",
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("summary")
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  // In a real app, we would fetch the book data based on the ID
  const book = mockBookData

  const handleSaveClick = () => {
    // Show login prompt instead of redirecting immediately
    setShowLoginPrompt(true)
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
                src={book.cover || "/placeholder.svg"}
                alt={book.title}
                width={300}
                height={450}
                className="w-full rounded-lg shadow-lg"
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
                  <span>{book.readTime}</span>
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
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Plot Summary</h3>
                  <p className="text-gray-700 leading-relaxed">{book.aiReview.plotSummary}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Strengths</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {book.aiReview.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Areas for Improvement</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {book.aiReview.improvements.map((improvement, index) => (
                        <li key={index}>{improvement}</li>
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
                  <p className="text-gray-700 leading-relaxed italic">{book.authorNote}</p>
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
    </div>
  )
}
