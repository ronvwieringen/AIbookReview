"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UploadStepProps {
  onFileUpload: (file: File) => void
  isProcessing: boolean
}

interface AnalysisResult {
  wordCount: number
  readingTimeMinutes: number
  category: string
  extractionMethod: string
  fileSize: number
  fileName: string
  fileType: string
}

const acceptedFileTypes = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "text/plain": [".txt"],
  "text/markdown": [".md"],
}

export default function UploadStep({ onFileUpload, isProcessing }: UploadStepProps) {
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [analysisError, setAnalysisError] = useState<string>("")

  const analyzeFile = async (file: File) => {
    setIsAnalyzing(true)
    setAnalysisError("")
    setAnalysisResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/analyze-manuscript', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Analysis failed')
      }

      if (result.success) {
        setAnalysisResult(result.analysis)
        toast({
          title: "Analysis Complete",
          description: `Found ${result.analysis.wordCount.toLocaleString()} words in your manuscript.`,
        })
      } else {
        throw new Error(result.error || 'Analysis failed')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      setAnalysisError(error instanceof Error ? error.message : 'Analysis failed')
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the file. You can still proceed with upload.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setUploadError("")
      setAnalysisError("")
      setAnalysisResult(null)

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.errors[0]?.code === "file-too-large") {
          setUploadError("File is too large. Maximum size is 50MB.")
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setUploadError("Invalid file type. Please upload a PDF, DOCX, TXT, or MD file.")
        } else {
          setUploadError("File upload failed. Please try again.")
        }
        return
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setSelectedFile(file)

        toast({
          title: "File Selected",
          description: `${file.name} is ready for analysis.`,
        })

        // Automatically analyze the file
        analyzeFile(file)
      }
    },
    [toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
  })

  const handleUpload = () => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload.")
      return
    }

    onFileUpload(selectedFile)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#2A4759]">Select Your Manuscript</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-[#F79B72] bg-orange-50"
                : selectedFile
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-[#F79B72] hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />

            {selectedFile ? (
              <div className="space-y-3">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                <div>
                  <div className="font-semibold text-green-800">{selectedFile.name}</div>
                  <div className="text-sm text-green-600">{formatFileSize(selectedFile.size)}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedFile(null)
                    setAnalysisResult(null)
                    setAnalysisError("")
                  }}
                >
                  Choose Different File
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <div className="text-lg font-semibold text-gray-700">
                    {isDragActive ? "Drop your manuscript here" : "Drag & drop your manuscript"}
                  </div>
                  <div className="text-sm text-gray-500">or click to browse files</div>
                </div>
                <div className="text-xs text-gray-400">Supports PDF, DOCX, TXT, MD • Max 50MB</div>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">{uploadError}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {selectedFile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#2A4759]">
              <FileText className="h-5 w-5 mr-2" />
              Manuscript Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-[#F79B72]" />
                  <span className="text-gray-600">Analyzing manuscript...</span>
                </div>
              </div>
            ) : analysisResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-[#F2F2F2] rounded-lg">
                    <div className="text-2xl font-bold text-[#2A4759]">{analysisResult.wordCount.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Words</div>
                  </div>
                  <div className="text-center p-3 bg-[#F2F2F2] rounded-lg">
                    <div className="text-2xl font-bold text-[#2A4759]">{analysisResult.readingTimeMinutes}</div>
                    <div className="text-sm text-gray-600">Min Read</div>
                  </div>
                  <div className="text-center p-3 bg-[#F2F2F2] rounded-lg">
                    <div className="text-lg font-bold text-[#2A4759]">{analysisResult.category}</div>
                    <div className="text-sm text-gray-600">Category</div>
                  </div>
                  <div className="text-center p-3 bg-[#F2F2F2] rounded-lg">
                    <div className="text-lg font-bold text-[#2A4759]">{formatFileSize(analysisResult.fileSize)}</div>
                    <div className="text-sm text-gray-600">File Size</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Extracted using: {analysisResult.extractionMethod}
                </div>
              </div>
            ) : analysisError ? (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-yellow-800 font-medium">Analysis Failed</div>
                    <div className="text-sm text-yellow-700 mt-1">{analysisError}</div>
                    <div className="text-xs text-yellow-600 mt-2">You can still proceed with the upload.</div>
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end">
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isProcessing}
          className="bg-[#F79B72] hover:bg-[#e68a61] text-white px-8"
        >
          {isProcessing ? "Processing..." : "Upload & Extract Metadata"}
        </Button>
      </div>
    </div>
  )
}