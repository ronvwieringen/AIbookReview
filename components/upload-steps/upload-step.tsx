"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UploadStepProps {
  onFileUpload: (file: File, language: string) => void
  isProcessing: boolean
}

const supportedLanguages = [
  { code: "en", name: "English" },
  { code: "nl", name: "Dutch" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
]

const acceptedFileTypes = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "text/plain": [".txt"],
  "text/markdown": [".md"],
}

export default function UploadStep({ onFileUpload, isProcessing }: UploadStepProps) {
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>("")
  const [uploadError, setUploadError] = useState<string>("")

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
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

        // Auto-detect language based on filename or default to English
        if (!selectedLanguage) {
          setSelectedLanguage("en")
        }

        toast({
          title: "File Selected",
          description: `${file.name} is ready for upload.`,
        })
      }
    },
    [selectedLanguage, toast],
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

    if (!selectedLanguage) {
      setUploadError("Please select the manuscript language.")
      return
    }

    onFileUpload(selectedFile, selectedLanguage)
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

      {/* Language Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#2A4759]">Manuscript Language</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label htmlFor="language-select">Select the primary language of your manuscript</Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger id="language-select">
                <SelectValue placeholder="Choose language..." />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              This helps our AI provide more accurate analysis and feedback in the appropriate language.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* File Information */}
      {selectedFile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#2A4759]">
              <FileText className="h-5 w-5 mr-2" />
              File Information
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
                <div className="font-medium text-gray-700">File Type</div>
                <div className="text-gray-600">{selectedFile.type || "Unknown"}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Language</div>
                <div className="text-gray-600">
                  {selectedLanguage
                    ? supportedLanguages.find((l) => l.code === selectedLanguage)?.name
                    : "Not selected"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end">
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !selectedLanguage || isProcessing}
          className="bg-[#F79B72] hover:bg-[#e68a61] text-white px-8"
        >
          {isProcessing ? "Uploading..." : "Upload & Extract Metadata"}
        </Button>
      </div>
    </div>
  )
}
