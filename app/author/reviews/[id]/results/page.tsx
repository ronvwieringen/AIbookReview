"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BookOpen,
  Star,
  CheckCircle,
  AlertCircle,
  Save,
  Share2,
  ExternalLink,
  ChevronLeft,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Download,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data for a review result
const mockReviewData = {
  id: 1,
  title: "The Digital Frontier",
  author: "Sarah Johnson",
  genre: "Science Fiction",
  score: 87,
  language: "English",
  reviewDate: "January 15, 2024",
  publisher: "Independent Press",
  keywords: ["virtual reality", "technology", "consciousness", "digital worlds", "future"],
  isPublic: false,
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
    scoreBreakdown: {
      plot: 88,
      characters: 85,
      pacing: 78,
      writingStyle: 92,
      worldBuilding: 95,
      themes: 90,
      overall: 87,
    },
  },
  buyLinks: [
    { name: "Amazon", url: "https://amazon.com" },
    { name: "Barnes & Noble", url: "https://barnesandnoble.com" },
  ],
  authorResponse: "",
}

export default function ReviewResultsPage({ params }: { params: { id: string } }) {
  const [review, setReview] = useState(mockReviewData)
  const [activeTab, setActiveTab] = useState("summary")
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [newLinkName, setNewLinkName] = useState("")
  const [newLinkUrl, setNewLinkUrl] = useState("")

  const handleAuthorResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview({ ...review, authorResponse: e.target.value })
  }

  const handlePublicToggle = () => {
    setReview({ ...review, isPublic: !review.isPublic })
  }

  const handleSaveChanges = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setShowSuccessAlert(true)
      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 5000)
    }, 1000)
  }

  const addBuyLink = () => {
    if (newLinkName && newLinkUrl) {
      setReview({
        ...review,
        buyLinks: [...review.buyLinks, { name: newLinkName, url: newLinkUrl }],
      })
      setNewLinkName("")
      setNewLinkUrl("")
    }
  }

  const removeBuyLink = (index: number) => {
    const updatedLinks = [...review.buyLinks]
    updatedLinks.splice(index, 1)
    setReview({ ...review, buyLinks: updatedLinks })
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
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, Sarah!</span>
            <Button variant="outline" size="sm" asChild>
              <Link href="/author/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button variant="ghost" className="mb-6 text-gray-600 hover:text-amber-600 pl-0" asChild>
          <Link href="/author/dashboard">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        {/* Success Alert */}
        {showSuccessAlert && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">Your changes have been saved successfully!</AlertDescription>
          </Alert>
        )}

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{review.title}</h1>
              <div className="flex items-center flex-wrap gap-3">
                <Badge variant="outline" className="border-amber-200 text-amber-700">
                  {review.genre}
                </Badge>
                <div className="flex items-center">
                  <Badge className="bg-amber-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    {review.score}
                  </Badge>
                </div>
                <span className="text-gray-500 text-sm">Reviewed on {review.reviewDate}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleSaveChanges} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="relative">
                <Image
                  src={review.cover || "/placeholder.svg"}
                  alt={review.title}
                  width={300}
                  height={450}
                  className="w-full h-auto"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-amber-600 text-white px-3 py-1 text-lg font-bold">
                    <Star className="h-4 w-4 mr-1" />
                    {review.score}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Author</p>
                    <p className="font-medium">{review.author}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Publisher</p>
                    <p className="font-medium">{review.publisher}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Language</p>
                    <p className="font-medium">{review.language}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Keywords</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {review.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="border-amber-200 text-amber-700">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Visibility Settings</CardTitle>
                <CardDescription>Control who can see your review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="public-toggle" className="font-medium">
                      {review.isPublic ? "Public Review" : "Private Review"}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {review.isPublic ? "Your review is visible to all readers" : "Only you can see this review"}
                    </p>
                  </div>
                  <Switch
                    id="public-toggle"
                    checked={review.isPublic}
                    onCheckedChange={handlePublicToggle}
                    className="data-[state=checked]:bg-amber-600"
                  />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  {review.isPublic ? (
                    <Eye className="h-4 w-4 text-amber-600 mr-2" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-500 mr-2" />
                  )}
                  <span className={review.isPublic ? "text-amber-600" : "text-gray-500"}>
                    {review.isPublic ? "Visible to readers" : "Hidden from readers"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Where to Buy</CardTitle>
                <CardDescription>Add links where readers can purchase your book</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {review.buyLinks.map((link, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ExternalLink className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="font-medium">{link.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-red-600"
                        onClick={() => removeBuyLink(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-100">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="link-name">Store Name</Label>
                      <Input
                        id="link-name"
                        placeholder="e.g. Amazon"
                        value={newLinkName}
                        onChange={(e) => setNewLinkName(e.target.value)}
                        className="border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="link-url">URL</Label>
                      <Input
                        id="link-url"
                        placeholder="https://"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        className="border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                      />
                    </div>
                    <Button
                      onClick={addBuyLink}
                      disabled={!newLinkName || !newLinkUrl}
                      className="w-full bg-amber-600 hover:bg-amber-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Review Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>AI Review Results</CardTitle>
                <CardDescription>Detailed analysis of your manuscript by our advanced AI system</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-4 mb-6">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
                    <TabsTrigger value="scores">Score Breakdown</TabsTrigger>
                    <TabsTrigger value="response">Your Response</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="space-y-6">
                    <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                      <div className="text-5xl font-bold text-amber-600 mb-3">{review.score}</div>
                      <div className="text-xl font-semibold text-gray-900 mb-2">AI Quality Score</div>
                      <Badge className="bg-amber-600 text-white px-4 py-1">
                        <Star className="h-4 w-4 mr-1" />
                        Very Good
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-900">Plot Summary</h3>
                      <p className="text-gray-700 leading-relaxed">{review.aiReview.plotSummary}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-900">Key Strengths</h3>
                        <ul className="space-y-2">
                          {review.aiReview.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-900">Areas for Improvement</h3>
                        <ul className="space-y-2">
                          {review.aiReview.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-start">
                              <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-900">Conclusion</h3>
                      <p className="text-gray-700 leading-relaxed">{review.aiReview.conclusion}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="detailed" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-900">Writing Style</h3>
                      <p className="text-gray-700 leading-relaxed">{review.aiReview.writingStyle}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-900">Character Analysis</h3>
                      <p className="text-gray-700 leading-relaxed">{review.aiReview.characterAnalysis}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-900">Thematic Elements</h3>
                      <p className="text-gray-700 leading-relaxed">{review.aiReview.thematicElements}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="scores" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(review.aiReview.scoreBreakdown).map(([category, score]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium capitalize">
                              {category === "writingStyle"
                                ? "Writing Style"
                                : category === "worldBuilding"
                                  ? "World Building"
                                  : category}
                            </span>
                            <Badge
                              className={`${
                                score >= 90
                                  ? "bg-green-600"
                                  : score >= 80
                                    ? "bg-amber-600"
                                    : score >= 70
                                      ? "bg-orange-600"
                                      : "bg-red-600"
                              } text-white`}
                            >
                              {score}/100
                            </Badge>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                score >= 90
                                  ? "bg-green-600"
                                  : score >= 80
                                    ? "bg-amber-600"
                                    : score >= 70
                                      ? "bg-orange-600"
                                      : "bg-red-600"
                              }`}
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-6 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3 text-gray-900">How Scores Are Calculated</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Our AI analyzes multiple aspects of your manuscript to generate these scores. The overall score
                        is a weighted average that considers plot structure, character development, pacing, writing
                        style, world-building, and thematic depth. Scores above 90 are considered excellent, 80-89 very
                        good, 70-79 good, and below 70 indicates areas needing significant improvement.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="response" className="space-y-6">
                    <div>
                      <Label htmlFor="author-response" className="text-lg font-semibold text-gray-900">
                        Your Response to the Review
                      </Label>
                      <p className="text-gray-600 mb-4">
                        Share your thoughts on the AI review. This will be visible to readers if you make your review
                        public.
                      </p>
                      <Textarea
                        id="author-response"
                        placeholder="Write your response here..."
                        value={review.authorResponse}
                        onChange={handleAuthorResponseChange}
                        className="min-h-[200px] border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                      />
                    </div>

                    <Alert className="border-amber-200 bg-amber-50">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        Your response helps readers understand your perspective and intentions as an author. It will be
                        displayed alongside the AI review if you choose to make it public.
                      </AlertDescription>
                    </Alert>

                    <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleSaveChanges} disabled={isSaving}>
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Response"}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
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
