"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, CheckCircle, AlertCircle, BookOpen, ArrowLeft, Star, FileText } from "lucide-react"
import Link from "next/link"

export default function UploadPage() {
  const [step, setStep] = useState(1)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [metadata, setMetadata] = useState({
    title: "",
    author: "",
    language: "english",
    genre: "",
    description: "",
    keywords: [] as string[],
    publisher: "",
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          // Simulate AI metadata extraction
          setTimeout(() => {
            setMetadata({
              title: "The Digital Frontier",
              author: "Sarah Johnson",
              language: "english",
              genre: "science-fiction",
              description:
                "A thrilling journey through virtual worlds where reality and digital existence blur in unexpected ways.",
              keywords: ["virtual reality", "technology", "consciousness", "digital worlds", "future"],
              publisher: "Independent Press",
            })
            setStep(2)
          }, 1000)
        }
      }, 200)
    }
  }

  const handleMetadataSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(3)
    // Simulate AI analysis
    setTimeout(() => {
      setStep(4)
    }, 3000)
  }

  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...metadata.keywords]
    newKeywords[index] = value
    setMetadata({ ...metadata, keywords: newKeywords })
  }

  const addKeyword = () => {
    if (metadata.keywords.length < 5) {
      setMetadata({ ...metadata, keywords: [...metadata.keywords, ""] })
    }
  }

  const removeKeyword = (index: number) => {
    const newKeywords = metadata.keywords.filter((_, i) => i !== index)
    setMetadata({ ...metadata, keywords: newKeywords })
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
        <Button variant="ghost" className="mb-6 text-gray-600 hover:text-amber-600 pl-0" asChild>
          <Link href="/authors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Author Portal
          </Link>
        </Button>

        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get Your AI Book Review</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your manuscript and get detailed AI analysis with actionable feedback to improve your writing.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className={`flex items-center ${step >= 1 ? "text-amber-600" : "text-gray-400"}`}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-amber-600 text-white" : "bg-gray-200"} font-semibold`}
              >
                1
              </div>
              <span className="ml-3 text-sm font-medium">Upload Manuscript</span>
            </div>
            <div className={`flex items-center ${step >= 2 ? "text-amber-600" : "text-gray-400"}`}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-amber-600 text-white" : "bg-gray-200"} font-semibold`}
              >
                2
              </div>
              <span className="ml-3 text-sm font-medium">Review Metadata</span>
            </div>
            <div className={`flex items-center ${step >= 3 ? "text-amber-600" : "text-gray-400"}`}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-amber-600 text-white" : "bg-gray-200"} font-semibold`}
              >
                3
              </div>
              <span className="ml-3 text-sm font-medium">AI Analysis</span>
            </div>
            <div className={`flex items-center ${step >= 4 ? "text-amber-600" : "text-gray-400"}`}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 4 ? "bg-amber-600 text-white" : "bg-gray-200"} font-semibold`}
              >
                4
              </div>
              <span className="ml-3 text-sm font-medium">Results</span>
            </div>
          </div>
          <Progress value={(step / 4) * 100} className="w-full h-2" />
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: File Upload */}
          {step === 1 && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl">Upload Your Manuscript</CardTitle>
                <CardDescription className="text-lg">
                  Upload your manuscript in .docx, .pdf, or .txt format. Your file is processed securely and deleted
                  after analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <div className="border-2 border-dashed border-amber-200 rounded-xl p-12 text-center bg-amber-50/50 hover:bg-amber-50 transition-colors">
                  <Upload className="h-16 w-16 text-amber-600 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Choose a file to upload</h3>
                  <p className="text-gray-600 mb-6">Supported formats: .docx, .pdf, .txt (Max 50MB)</p>
                  <Input
                    type="file"
                    accept=".docx,.pdf,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload">
                    <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
                      <span>
                        <FileText className="h-5 w-5 mr-2" />
                        Select File
                      </span>
                    </Button>
                  </Label>
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-900">Uploading and analyzing...</span>
                      <span className="text-sm text-gray-600">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                <Alert className="mt-8 border-amber-200 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    Your manuscript is processed securely and deleted immediately after analysis. We never store your
                    content.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Metadata */}
          {step === 2 && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl">Review Extracted Information</CardTitle>
                <CardDescription className="text-lg">
                  Our AI has extracted this information from your manuscript. Please review and edit as needed.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <form onSubmit={handleMetadataSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium text-gray-900">
                        Book Title
                      </Label>
                      <Input
                        id="title"
                        value={metadata.title}
                        onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                        placeholder="Enter book title"
                        className="border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="author" className="text-sm font-medium text-gray-900">
                        Author Name
                      </Label>
                      <Input
                        id="author"
                        value={metadata.author}
                        onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
                        placeholder="Enter author name"
                        className="border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-sm font-medium text-gray-900">
                        Language
                      </Label>
                      <Select
                        value={metadata.language}
                        onValueChange={(value) => setMetadata({ ...metadata, language: value })}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-amber-500 focus:ring-amber-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="genre" className="text-sm font-medium text-gray-900">
                        Genre
                      </Label>
                      <Select
                        value={metadata.genre}
                        onValueChange={(value) => setMetadata({ ...metadata, genre: value })}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-amber-500 focus:ring-amber-500">
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fiction">Fiction</SelectItem>
                          <SelectItem value="romance">Romance</SelectItem>
                          <SelectItem value="mystery">Mystery</SelectItem>
                          <SelectItem value="science-fiction">Science Fiction</SelectItem>
                          <SelectItem value="fantasy">Fantasy</SelectItem>
                          <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                          <SelectItem value="biography">Biography</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="publisher" className="text-sm font-medium text-gray-900">
                        Publisher
                      </Label>
                      <Input
                        id="publisher"
                        value={metadata.publisher}
                        onChange={(e) => setMetadata({ ...metadata, publisher: e.target.value })}
                        placeholder="Enter publisher name"
                        className="border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-900">
                      Brief Description
                    </Label>
                    <Textarea
                      id="description"
                      value={metadata.description}
                      onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                      placeholder="Brief description of your book"
                      rows={4}
                      className="border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-gray-900">Keywords (Max 5)</Label>
                      {metadata.keywords.length < 5 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addKeyword}
                          className="border-amber-200 text-amber-700 hover:bg-amber-50"
                        >
                          Add Keyword
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {metadata.keywords.map((keyword, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={keyword}
                            onChange={(e) => handleKeywordChange(index, e.target.value)}
                            placeholder={`Keyword ${index + 1}`}
                            className="border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeKeyword(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                    {metadata.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {metadata.keywords
                          .filter((k) => k.trim())
                          .map((keyword, index) => (
                            <Badge key={index} variant="outline" className="border-amber-200 text-amber-700">
                              {keyword}
                            </Badge>
                          ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6">
                    <Button type="submit" size="lg" className="w-full bg-amber-600 hover:bg-amber-700">
                      Start AI Analysis
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Analysis in Progress */}
          {step === 3 && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl">AI Analysis in Progress</CardTitle>
                <CardDescription className="text-lg">
                  Our AI is analyzing your manuscript. This typically takes 2-3 minutes.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-amber-600 mx-auto mb-6"></div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Analyzing Your Manuscript</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We're evaluating plot structure, character development, pacing, writing style, and overall quality...
                </p>
                <div className="space-y-3 text-sm text-gray-500 max-w-sm mx-auto">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span>Extracting key themes and elements</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span>Analyzing narrative structure</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="h-4 w-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Evaluating character development</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="h-4 w-4 border-2 border-gray-300 rounded-full mr-2"></div>
                    <span>Generating quality score</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Results */}
          {step === 4 && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-6">
                <CardTitle className="flex items-center justify-center text-2xl">
                  <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                  Analysis Complete!
                </CardTitle>
                <CardDescription className="text-lg">
                  Your AI review is ready. Here's a preview of your results.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pb-8">
                <div className="text-center p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="text-5xl font-bold text-amber-600 mb-3">87</div>
                  <div className="text-xl font-semibold text-gray-900 mb-2">AI Quality Score</div>
                  <Badge className="bg-amber-600 text-white px-4 py-1">
                    <Star className="h-4 w-4 mr-1" />
                    Very Good
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900">Key Strengths:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Exceptional world-building with detailed technology</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Strong character development and internal struggles</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Well-paced plot with escalating tension</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900">Areas for Improvement:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Some secondary characters need more depth</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Technical explanations slow the narrative</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Middle section has pacing issues</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-lg mb-3 text-gray-900">AI Summary:</h4>
                  <p className="text-gray-700 leading-relaxed">
                    "The Digital Frontier" is an ambitious science fiction novel that successfully combines engaging
                    action with thoughtful exploration of consciousness and reality. The world-building is exceptional,
                    and the protagonist's character arc is compelling. While there are minor pacing issues and some
                    secondary characters could use more development, the novel offers a fresh perspective on the
                    increasingly blurred line between physical and digital existence.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="flex-1 bg-amber-600 hover:bg-amber-700" asChild>
                    <Link href="/register">Create Account to Save Results</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50"
                    asChild
                  >
                    <Link href="/upload">Upload Another Book</Link>
                  </Button>
                </div>

                <Alert className="border-amber-200 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    <strong>Want to save your results?</strong> Create a free account to access your full review, save
                    it to your dashboard, and optionally publish it to help readers discover your book.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
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
