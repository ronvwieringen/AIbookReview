/**
 * REQUIREMENTS REFERENCES:
 *
 * [REQ-UI-006] Author Review Results Dashboard
 * - Comprehensive display of AI analysis results
 * - Tabbed interface for different result sections
 * - Publication controls and settings
 * - Content management and editing capabilities
 *
 * [REQ-FUNC-011] Review Results Management
 * - Display complete AI analysis and scores
 * - Allow editing of promotional blurb
 * - Author response to AI review functionality
 * - Publication status controls (public/private)
 *
 * [REQ-FUNC-012] Content Publishing Controls
 * - Toggle between public and private review status
 * - Shareable link generation
 * - Download options for complete reports
 * - Purchase link management
 *
 * [REQ-FUNC-013] Author Content Management
 * - Edit AI-generated promotional blurb
 * - Add author response to AI review
 * - Upload and manage book cover images
 * - Manage book metadata and information
 *
 * [REQ-FUNC-014] Service Integration Management
 * - Display AI-suggested service needs
 * - Connect with recommended service providers
 * - Track service engagement and recommendations
 *
 * [REQ-UI-007] Author Dashboard Navigation
 * - Consistent navigation for author-specific pages
 * - Quick access to key author functions
 * - Integration with main author dashboard
 */

"use client"

import { useState } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Download,
  Eye,
  EyeOff,
  Share2,
  Edit3,
  CheckCircle,
  AlertTriangle,
  BarChart,
  FileText,
  Settings,
  ExternalLink,
  Upload,
} from "lucide-react"
import { mockReviews, getFullReviewData } from "@/lib/mock-data"
import AuthorDashboardNav from "@/components/author-dashboard-nav"
import ServiceNeedsSection from "@/components/service-needs-section"
import { useToast } from "@/hooks/use-toast"

interface PageProps {
  params: {
    id: string
  }
}

export default function ReviewResultsPage({ params }: PageProps) {
  const { toast } = useToast()
  const review = mockReviews.find((r) => r.id === params.id)

  if (!review) {
    notFound()
  }

  const fullReviewData = getFullReviewData(params.id)
  const [isPublic, setIsPublic] = useState(false)
  const [authorResponse, setAuthorResponse] = useState(fullReviewData.authorResponse || "")
  const [editableBlurb, setEditableBlurb] = useState(fullReviewData.promotionalBlurb)
  const [coverImage, setCoverImage] = useState(review.coverImage)

  const shareableLink = `${typeof window !== "undefined" ? window.location.origin : ""}/reviews/${review.id}`

  const handlePublishToggle = (checked: boolean) => {
    setIsPublic(checked)
    toast({
      title: checked ? "Review Published" : "Review Made Private",
      description: checked
        ? "Your review is now visible to readers on the platform."
        : "Your review is now private and only visible to you.",
    })
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink)
    toast({
      title: "Link Copied",
      description: "The shareable link has been copied to your clipboard.",
    })
  }

  const handleDownloadReport = () => {
    toast({
      title: "Download Started",
      description: "Your AI review report is being prepared for download.",
    })
  }

  const handleSaveResponse = () => {
    toast({
      title: "Response Saved",
      description: "Your response to the AI review has been saved.",
    })
  }

  const handleSaveBlurb = () => {
    toast({
      title: "Blurb Updated",
      description: "Your promotional blurb has been updated.",
    })
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
      <AuthorDashboardNav />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#2A4759] mb-2">AI Review Results</h1>
              <p className="text-gray-600">Review completed on {new Date(review.reviewDate).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleDownloadReport}>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button onClick={handleCopyLink} variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>

          {/* Publication Status */}
          <Card className="border-l-4 border-l-[#F79B72]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isPublic ? <Eye className="h-5 w-5 text-green-600" /> : <EyeOff className="h-5 w-5 text-gray-500" />}
                  <div>
                    <div className="font-semibold text-[#2A4759]">
                      {isPublic ? "Review is Public" : "Review is Private"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isPublic ? "Readers can discover and view your book review" : "Only you can see this review"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Label htmlFor="publish-toggle" className="text-sm font-medium">
                    Publish Review
                  </Label>
                  <Switch id="publish-toggle" checked={isPublic} onCheckedChange={handlePublishToggle} />
                </div>
              </div>
              {isPublic && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-800">
                    <strong>Public URL:</strong> {shareableLink}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed-review">Detailed Review</TabsTrigger>
            <TabsTrigger value="manage-content">Manage Content</TabsTrigger>
            <TabsTrigger value="services">Suggested Services</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Book Info Card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center text-[#2A4759]">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Book Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div
                        className="relative w-32 h-44 group cursor-pointer"
                        onClick={() => document.getElementById("cover-upload-overview")?.click()}
                      >
                        <Image
                          src={coverImage || "/placeholder.svg"}
                          alt={`Cover of ${review.title}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Upload className="h-6 w-6 text-white" />
                        </div>
                        <input
                          id="cover-upload-overview"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              // Handle file upload here
                              toast({
                                title: "Cover Updated",
                                description: "Your book cover has been updated.",
                              })
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#2A4759] mb-2">{review.title}</h3>
                      <p className="text-gray-600 mb-3">by {review.author}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline">{review.genre}</Badge>
                        <Badge variant="secondary">{review.language}</Badge>
                        {review.keywords.slice(0, 3).map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-gray-700 text-sm leading-relaxed">{fullReviewData.singleLineSummary}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Scores Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-[#2A4759]">
                    <BarChart className="h-5 w-5 mr-2" />
                    AI Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-[#F2F2F2] rounded-lg">
                    <div className="text-3xl font-bold text-[#2A4759] mb-1">{review.aiQualityScore}</div>
                    <div className="text-sm text-gray-600">Quality Score</div>
                    <div className="text-xs text-gray-500 mt-1">out of 100</div>
                  </div>

                  <div className="flex items-center justify-center p-3 bg-[#F2F2F2] rounded-lg">
                    <PlagiarismIcon className={`h-5 w-5 mr-2 ${plagiarismStatus.color}`} />
                    <div className="text-center">
                      <div className={`text-sm font-medium ${plagiarismStatus.color}`}>{plagiarismStatus.text}</div>
                      <div className="text-xs text-gray-500">{review.plagiarismScore}% similarity</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#2A4759]">AI-Generated Blurb</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-[#F2F2F2] p-4 rounded-lg italic text-gray-700 mb-4">"{editableBlurb}"</div>
                  <p className="text-xs text-gray-500">This promotional blurb can be used for marketing your book.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-[#2A4759]">Review Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{fullReviewData.reviewSummary}</p>
                </CardContent>
              </Card>
            </div>

            {/* Book Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2A4759]">Book Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">{fullReviewData.detailedSummary}</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Detailed Review Tab */}
          <TabsContent value="detailed-review">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-[#2A4759]">
                  <FileText className="h-5 w-5 mr-2" />
                  Complete AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: fullReviewData.fullReviewContent }} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Content Tab */}
          <TabsContent value="manage-content" className="space-y-6">
            {/* Edit Promotional Blurb */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-[#2A4759]">
                  <Edit3 className="h-5 w-5 mr-2" />
                  Edit Promotional Blurb
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="blurb-edit">Promotional Blurb (max 25 words)</Label>
                  <Textarea
                    id="blurb-edit"
                    value={editableBlurb}
                    onChange={(e) => setEditableBlurb(e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                  <div className="text-xs text-gray-500 mt-1">{editableBlurb.split(" ").length} words</div>
                </div>
                <Button onClick={handleSaveBlurb} className="bg-[#F79B72] hover:bg-[#e68a61]">
                  Save Blurb
                </Button>
              </CardContent>
            </Card>

            {/* Author Response */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-[#2A4759]">
                  <Edit3 className="h-5 w-5 mr-2" />
                  Your Response to AI Review
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="author-response">Add your perspective or clarifications about the AI review</Label>
                  <Textarea
                    id="author-response"
                    value={authorResponse}
                    onChange={(e) => setAuthorResponse(e.target.value)}
                    placeholder="Share your thoughts about the AI review, provide context, or address any points you'd like to clarify for readers..."
                    className="mt-2"
                    rows={6}
                  />
                </div>
                <Button onClick={handleSaveResponse} className="bg-[#F79B72] hover:bg-[#e68a61]">
                  Save Response
                </Button>
              </CardContent>
            </Card>

            {/* Cover Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-[#2A4759]">
                  <Upload className="h-5 w-5 mr-2" />
                  Book Cover
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative w-24 h-32 flex-shrink-0">
                    <Image
                      src={coverImage || "/placeholder.svg"}
                      alt="Current cover"
                      fill
                      className="object-cover rounded border"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="cover-upload">Upload New Cover</Label>
                    <Input id="cover-upload" type="file" accept="image/*" className="mt-2" />
                    <p className="text-xs text-gray-500 mt-1">Recommended: 300x400px, JPG or PNG format</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <ServiceNeedsSection serviceNeeds={fullReviewData.serviceNeeds} />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-[#2A4759]">
                  <Settings className="h-5 w-5 mr-2" />
                  Review Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium text-[#2A4759]">Public Visibility</div>
                    <div className="text-sm text-gray-600">Allow readers to discover and view your book review</div>
                  </div>
                  <Switch checked={isPublic} onCheckedChange={handlePublishToggle} />
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-[#2A4759] mb-4">Purchase Links</h3>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input placeholder="Platform name (e.g., Amazon)" className="flex-1" />
                      <Input placeholder="Purchase URL" className="flex-1" />
                      <Button variant="outline">Add</Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Add links where readers can purchase your book. These will be displayed on your public review
                      page.
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-[#2A4759] mb-4">Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Public Review Page
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Download Complete Report (PDF)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Request In-Depth Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
