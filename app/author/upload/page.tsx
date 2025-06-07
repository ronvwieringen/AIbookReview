/**
 * REQUIREMENTS REFERENCES:
 *
 * [REQ-UI-005] Manuscript Upload Interface
 * - Multi-step upload process with clear progress indicators
 * - File upload with drag-and-drop functionality
 * - Metadata extraction and confirmation
 * - Real-time progress tracking during AI analysis
 *
 * [REQ-FUNC-008] Manuscript Upload Process
 * - Support for multiple file formats (PDF, DOCX, TXT, MD)
 * - File validation and error handling
 * - Secure file transfer and processing
 * - Automatic metadata extraction from manuscript
 *
 * [REQ-FUNC-009] AI Analysis Workflow
 * - Initiate AI analysis after upload confirmation
 * - Real-time progress updates during analysis
 * - Quality assessment and plagiarism detection
 * - Generation of promotional blurbs and summaries
 *
 * [REQ-FUNC-010] Metadata Management
 * - Extract title, author, genre from manuscript
 * - Allow manual editing and confirmation
 * - Keyword extraction and tagging
 * - Language detection and selection
 *
 * [REQ-SEC-001] Secure File Handling
 * - Encrypted file transfer
 * - Temporary storage during processing
 * - Automatic deletion after analysis
 * - IP protection measures
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen } from "lucide-react"
import AuthorDashboardNav from "@/components/author-dashboard-nav"
import UploadStep from "@/components/upload-steps/upload-step"
import MetadataStep from "@/components/upload-steps/metadata-step"
import AnalysisStep from "@/components/upload-steps/analysis-step"
import { useToast } from "@/hooks/use-toast"

export interface UploadedFile {
  file: File
  name: string
  size: number
  type: string
  wordCount: number
}

export interface ExtractedMetadata {
  title: string
  author: string
  language: string
  bookType: string
  isbn: string
  keywords: string[]
  wordCount: number
}

export default function ManuscriptUploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [extractedMetadata, setExtractedMetadata] = useState<ExtractedMetadata | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const steps = [
    { number: 1, title: "Upload Manuscript", description: "Select and upload your manuscript file" },
    { number: 2, title: "Confirm Metadata", description: "Review and edit extracted information" },
    { number: 3, title: "AI Analysis", description: "AI reviews your manuscript" },
  ]

  const getStepProgress = () => {
    switch (currentStep) {
      case 1:
        return 0
      case 2:
        return 33
      case 3:
        return 66
      default:
        return 100
    }
  }

  const handleFileUpload = async (file: File, wordCount: number) => {
    setIsProcessing(true)

    try {
      // Simulate file upload and metadata extraction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const uploadedFileData: UploadedFile = {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        wordCount,
      }

      // Simulate AI metadata extraction with language detection
      const mockMetadata: ExtractedMetadata = {
        title: "The Digital Nomad's Guide to Freedom",
        author: "Sarah Chen",
        language: "English", // This would be detected by AI
        bookType: "Non-Fiction",
        isbn: "",
        keywords: ["digital nomad", "remote work", "entrepreneurship", "lifestyle design", "freedom"],
        wordCount,
      }

      setUploadedFile(uploadedFileData)
      setExtractedMetadata(mockMetadata)
      setCurrentStep(2)

      toast({
        title: "File Uploaded Successfully",
        description: `Metadata extracted from your ${wordCount.toLocaleString()}-word manuscript. Language detected: ${mockMetadata.language}`,
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMetadataConfirm = async (metadata: ExtractedMetadata) => {
    setIsProcessing(true)
    setExtractedMetadata(metadata)

    try {
      // Simulate starting AI analysis
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCurrentStep(3)

      toast({
        title: "Analysis Started",
        description: "Your manuscript is now being analyzed by our AI system.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start analysis. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAnalysisComplete = (reviewId: string) => {
    toast({
      title: "Analysis Complete!",
      description: "Your AI review is ready. Redirecting to results...",
    })

    // Redirect to results page after a short delay
    setTimeout(() => {
      router.push(`/author/reviews/${reviewId}/results`)
    }, 2000)
  }

  const handleStartOver = () => {
    setCurrentStep(1)
    setUploadedFile(null)
    setExtractedMetadata(null)
    setIsProcessing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthorDashboardNav />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2A4759] mb-4">Upload Your Manuscript</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get comprehensive AI-powered feedback on your manuscript. Our analysis includes quality assessment,
            plagiarism detection, language detection, and actionable improvement suggestions.
          </p>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      currentStep >= step.number
                        ? "bg-[#2A4759] text-white"
                        : currentStep === step.number
                          ? "bg-[#F79B72] text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <div
                      className={`text-sm font-medium ${
                        currentStep >= step.number ? "text-[#2A4759]" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                  {index < steps.length - 1 && <div className="flex-1 h-px bg-gray-200 mx-4 hidden sm:block"></div>}
                </div>
              ))}
            </div>
            <Progress value={getStepProgress()} className="h-2" />
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 1 && <UploadStep onFileUpload={handleFileUpload} isProcessing={isProcessing} />}

          {currentStep === 2 && extractedMetadata && (
            <MetadataStep
              metadata={extractedMetadata}
              onConfirm={handleMetadataConfirm}
              onBack={() => setCurrentStep(1)}
              isProcessing={isProcessing}
            />
          )}

          {currentStep === 3 && uploadedFile && extractedMetadata && (
            <AnalysisStep
              file={uploadedFile}
              metadata={extractedMetadata}
              onComplete={handleAnalysisComplete}
              onStartOver={handleStartOver}
            />
          )}
        </div>

        {/* Help Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-[#2A4759]">
              <BookOpen className="h-5 w-5 mr-2" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-[#2A4759] mb-2">Supported File Formats</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• PDF documents (.pdf)</li>
                  <li>• Microsoft Word (.docx)</li>
                  <li>• Plain text files (.txt)</li>
                  <li>• Markdown files (.md)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[#2A4759] mb-2">What We Analyze</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Writing quality and style</li>
                  <li>• Plot structure and pacing</li>
                  <li>• Character development</li>
                  <li>• Plagiarism detection</li>
                  <li>• Language detection</li>
                  <li>• Word count and reading time</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}