"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, FileText, AlertCircle, CheckCircle, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { extractTextFromFile, countWords, getEstimatedReadingTime, getManuscriptCategory } from "@/lib/word-counter"

interface UploadStepProps {
  onFileUpload: (file: File, wordCount: number) => void
  isProcessing: boolean
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
  const [wordCount, setWordCount] = useState<number>(0)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)

  const analyzeFile = async (file: File) => {
    setIsAnalyzing(true)
    try {
      const text = await extractTextFromFile(file)
      const count = countWords(text)
      setWordCount(count)
      
      toast({
        title: "File Analyzed",
        description: `Found ${count.toLocaleString()} words in your manuscript.`,
      })
    } catch (error) {
      console.error('Error analyzing file:', error)
      toast({
        title: "Analysis Warning",
        description: "Could not count words in this file, but you can still proceed.",
        variant: "destructive",
      })
      setWordCount(0)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      setUploadError("")

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

        // Analyze the file for word count
        await analyzeFile(file)

        toast({
          title: "File Selected",
          description: `${file.name} is ready for upload.`,
        })
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

    onFileUpload(selectedFile, wordCount)
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
                  {isAnalyzing && (
                    <div className="text-sm text-blue-600 mt-2">Analyzing content...</div>
                  )}
                  {wordCount > 0 && !isAnalyzing && (
                    <div className="text-sm text-green-600 mt-2">
                      {wordCount.toLocaleString()} words • {getEstimatedReadingTime(wordCount)}
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedFile(null)
                    setWordCount(0)
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
                <div className="text-xs text-gray-400">NOTE: we will only store the review, not the manuscript</div>
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

      {/* File Information */}
      {selectedFile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#2A4759]">
              <FileText className="h-5 w-5 mr-2" />
              Manuscript Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-700">Filename</div>
                <div className="text-gray-600">{selectedFile.name}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">File Size</div>
                <div className="text-gray-600">{formatFileSize(selectedFile.size)}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Word Count</div>
                <div className="text-gray-600">
                  {isAnalyzing ? (
                    "Analyzing..."
                  ) : wordCount > 0 ? (
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {wordCount.toLocaleString()} words
                    </span>
                  ) : (
                    "Not analyzed"
                  )}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Language</div>
                <div className="text-gray-600">Will be detected automatically</div>
              </div>
            </div>
            
            {wordCount > 0 && !isAnalyzing && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm">
                  <div className="font-medium text-blue-800 mb-1">Manuscript Details:</div>
                  <div className="text-blue-700">
                    • Category: {getManuscriptCategory(wordCount)}
                  </div>
                  <div className="text-blue-700">
                    • Estimated reading time: {getEstimatedReadingTime(wordCount)}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center">
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isProcessing || isAnalyzing}
          className="bg-[#F79B72] hover:bg-[#e68a61] text-white px-8"
        >
          {isProcessing ? "Uploading..." : isAnalyzing ? "Analyzing..." : "Upload & Extract Metadata"}
        </Button>
      </div>
    </div>
  )
}