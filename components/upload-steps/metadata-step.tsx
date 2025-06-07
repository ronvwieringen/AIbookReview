"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit3, CheckCircle, ArrowLeft, X } from "lucide-react"
import type { ExtractedMetadata } from "@/app/author/upload/page"

interface MetadataStepProps {
  metadata: ExtractedMetadata
  onConfirm: (metadata: ExtractedMetadata) => void
  onBack: () => void
  isProcessing: boolean
}

const bookTypes = [
  "Fiction",
  "Non-Fiction",
  "Poetry",
  "Screenplay",
  "Biography",
  "Memoir",
  "Self-Help",
  "Business",
  "Academic",
  "Children's",
  "Young Adult",
  "Other",
]

export default function MetadataStep({ metadata, onConfirm, onBack, isProcessing }: MetadataStepProps) {
  const [editedMetadata, setEditedMetadata] = useState<ExtractedMetadata>(metadata)
  const [newKeyword, setNewKeyword] = useState("")

  const handleInputChange = (field: keyof ExtractedMetadata, value: string) => {
    setEditedMetadata((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addKeyword = () => {
    if (
      newKeyword.trim() &&
      editedMetadata.keywords.length < 5 &&
      !editedMetadata.keywords.includes(newKeyword.trim())
    ) {
      setEditedMetadata((prev) => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()],
      }))
      setNewKeyword("")
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    setEditedMetadata((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((keyword) => keyword !== keywordToRemove),
    }))
  }

  const handleConfirm = () => {
    onConfirm(editedMetadata)
  }

  const isFormValid = () => {
    return (
      editedMetadata.title.trim() !== "" &&
      editedMetadata.author.trim() !== "" &&
      editedMetadata.language !== "" &&
      editedMetadata.bookType !== ""
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <div className="font-semibold text-green-800">Metadata Extracted Successfully</div>
              <div className="text-sm text-green-600">
                Please review and edit the information below before proceeding with the AI analysis.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-[#2A4759]">
            <Edit3 className="h-5 w-5 mr-2" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Book Title *</Label>
              <Input
                id="title"
                value={editedMetadata.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter book title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="author">Author Name *</Label>
              <Input
                id="author"
                value={editedMetadata.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                placeholder="Enter author name"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="language">Language *</Label>
              <Input
                id="language"
                value={editedMetadata.language}
                onChange={(e) => handleInputChange("language", e.target.value)}
                placeholder="e.g., English, Dutch, German"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be automatically detected during AI analysis
              </p>
            </div>
            <div>
              <Label htmlFor="bookType">Book Type *</Label>
              <Select value={editedMetadata.bookType} onValueChange={(value) => handleInputChange("bookType", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select book type" />
                </SelectTrigger>
                <SelectContent>
                  {bookTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="isbn">ISBN (Optional)</Label>
            <Input
              id="isbn"
              value={editedMetadata.isbn}
              onChange={(e) => handleInputChange("isbn", e.target.value)}
              placeholder="Enter ISBN if available"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">International Standard Book Number (ISBN-10 or ISBN-13)</p>
          </div>
        </CardContent>
      </Card>

      {/* Keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#2A4759]">Keywords</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Current Keywords ({editedMetadata.keywords.length}/5)</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {editedMetadata.keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {keyword}
                  <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeKeyword(keyword)} />
                </Badge>
              ))}
              {editedMetadata.keywords.length === 0 && (
                <div className="text-sm text-gray-500">No keywords added yet</div>
              )}
            </div>
          </div>

          {editedMetadata.keywords.length < 5 && (
            <div>
              <Label htmlFor="new-keyword">Add Keyword</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="new-keyword"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Enter a keyword"
                  onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                  className="flex-1"
                />
                <Button onClick={addKeyword} variant="outline" disabled={!newKeyword.trim()}>
                  Add
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Keywords help readers discover your book and improve AI analysis accuracy.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Analysis Preview */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-[#2A4759]">What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-[#F79B72] mt-2 flex-shrink-0"></div>
              <div>
                <div className="font-medium text-[#2A4759]">AI Quality Assessment</div>
                <div className="text-gray-600">Comprehensive analysis of writing quality, structure, and style</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-[#F79B72] mt-2 flex-shrink-0"></div>
              <div>
                <div className="font-medium text-[#2A4759]">Plagiarism Detection</div>
                <div className="text-gray-600">Scan against extensive database to ensure originality</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-[#F79B72] mt-2 flex-shrink-0"></div>
              <div>
                <div className="font-medium text-[#2A4759]">Promotional Content</div>
                <div className="text-gray-600">Generate marketing blurb and book summaries</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-[#F79B72] mt-2 flex-shrink-0"></div>
              <div>
                <div className="font-medium text-[#2A4759]">Service Recommendations</div>
                <div className="text-gray-600">Identify areas where professional services could help</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isProcessing}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Upload
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!isFormValid() || isProcessing}
          className="bg-[#F79B72] hover:bg-[#e68a61] text-white px-8"
        >
          {isProcessing ? "Starting Analysis..." : "Start Free AI Review"}
        </Button>
      </div>
    </div>
  )
}