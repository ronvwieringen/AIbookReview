/**
 * Prompts Management Screen (FR803)
 *
 * Requirements References:
 * - FR803: Prompt Management: Create, edit, and manage prompts used with the LLMs for various tasks and languages.
 *   The prompt for metadata extraction (which can be edited and is stored in the database).
 *   The prompts for initial review are different for each metadata.type (fiction, non-fiction, poetry, etc.).
 *   The prompts management page supports using fields from the manuscript metadata (type, topic, language).
 * - NFR018: Code should be well-documented, modular, and follow consistent coding standards
 * - NFR009: Access Control: Role-based access control must be enforced across all platform functions
 * - NFR023: AI Analysis: Support for multiple languages in AI manuscript analysis is required from Phase 1
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { FileText, MessageSquare, Zap, Plus, Save, Eye, Code } from "lucide-react"

interface Prompt {
  id: string
  name: string
  type: "metadata_extraction" | "initial_review" | "detailed_review"
  bookType?: string // For initial_review prompts
  promptText: string
  variables: string[] // Available variables like {type}, {topic}, {language}
  isActive: boolean
  lastModified: string
}

export default function PromptsManagementPage() {
  const { toast } = useToast()
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)

  // Mock data - in real implementation, this would come from the database
  const [prompts, setPrompts] = useState<Prompt[]>([
    {
      id: "1",
      name: "Metadata Extraction",
      type: "metadata_extraction",
      promptText: `Analyze this manuscript and provide the following information in JSON format:
{
    "author": "Name of the primary author (if mentioned, otherwise 'Not specified')",
    "co_authors": ["List of co-authors"] or [],
    "booktype": "fiction or non-fiction or poetry or screenplay or essay or blog or scientific",
    "language": "primary language of the text, in the correct language so for example French is Français and German is Deutsch ist Deutsch und Spanish is Español",
    "ISBN":"ISBN-number",
    "Publisher":"the publisher or uitgever",
    "Wordcount":"the number of words in the manuscript",
    "Topic":"The main topic in maximum 10 words, in the language as identified for the document",
    "Characters":["in the case of fiction, a list of maximum five names of main characters that appear in the story, sorted from most important to least important"],
    "Location":["a list of maximum three main geographical locations where the story is situated"]
}
Base your analysis ONLY on the actual content of the manuscript. If any information is not available, use 'Not specified'.`,
      variables: [],
      isActive: true,
      lastModified: "2024-01-15",
    },
    {
      id: "2",
      name: "Fiction Review",
      type: "initial_review",
      bookType: "fiction",
      promptText: `You are a professional literary critic reviewing a {type} manuscript titled "{topic}". 

Analyze this {language} fiction work and provide a comprehensive review covering:

1. **Language & Style** (25 points)
   - Grammar, spelling, and punctuation accuracy
   - Word choice and vocabulary effectiveness
   - Clarity and accessibility of prose
   - Character voice differentiation
   - Use of literary devices

2. **Sensory Experience & Immersion** (20 points)
   - Integration of sensory details
   - Emotional portrayal through physical reactions
   - Exploration of characters' inner worlds

3. **Scene Construction & Dynamics** (25 points)
   - Setting and atmosphere creation
   - Scene structure and pacing
   - Movement and environmental interaction

4. **Plot, Structure & Meaning** (30 points)
   - Logic and believability
   - Character motivation
   - Tension building and conflict
   - Plot structure and climax effectiveness

Provide a score out of 100 and detailed feedback for each section. End with a brief summary of strengths and areas for improvement.`,
      variables: ["type", "topic", "language"],
      isActive: true,
      lastModified: "2024-01-14",
    },
    {
      id: "3",
      name: "Non-Fiction Review",
      type: "initial_review",
      bookType: "non-fiction",
      promptText: `You are a professional editor reviewing a {type} manuscript about "{topic}". 

Analyze this {language} non-fiction work and provide a comprehensive review covering:

1. **Substantiation of Claims** (30 points)
   - Quality of supporting evidence
   - Appropriateness for target audience
   - Persuasiveness of arguments
   - Source citation and originality

2. **Completeness** (25 points)
   - Coverage of core topic aspects
   - Depth of insight beyond common knowledge

3. **Structure & Clarity** (25 points)
   - Logical organization
   - Clear presentation of ideas
   - Accessibility to intended readers

4. **Originality & Value** (20 points)
   - Unique perspective or contribution
   - Practical applicability
   - Innovation in approach

Provide a score out of 100 and detailed feedback for each section. Identify any weaknesses such as oversimplification, bias, or outdated information.`,
      variables: ["type", "topic", "language"],
      isActive: true,
      lastModified: "2024-01-13",
    },
    {
      id: "4",
      name: "Poetry Review",
      type: "initial_review",
      bookType: "poetry",
      promptText: `You are a poetry critic reviewing a {type} collection titled "{topic}".

Analyze this {language} poetry work and provide a comprehensive review covering:

1. **Language & Craft** (35 points)
   - Word choice and precision
   - Rhythm and meter
   - Use of poetic devices
   - Voice and tone consistency

2. **Imagery & Emotion** (30 points)
   - Vivid and original imagery
   - Emotional resonance
   - Sensory engagement

3. **Structure & Form** (20 points)
   - Poem structure and organization
   - Collection coherence
   - Form innovation or mastery

4. **Meaning & Impact** (15 points)
   - Thematic depth
   - Cultural or universal relevance
   - Reader engagement

Provide a score out of 100 and detailed feedback for each section. Comment on the collection's overall unity and individual poem strengths.`,
      variables: ["type", "topic", "language"],
      isActive: true,
      lastModified: "2024-01-12",
    },
  ])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "metadata_extraction":
        return <FileText className="h-4 w-4" />
      case "initial_review":
        return <MessageSquare className="h-4 w-4" />
      case "detailed_review":
        return <Zap className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case "metadata_extraction":
        return "Metadata Extraction"
      case "initial_review":
        return "Initial Review"
      case "detailed_review":
        return "Detailed Review"
      default:
        return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "metadata_extraction":
        return "bg-blue-100 text-blue-800"
      case "initial_review":
        return "bg-green-100 text-green-800"
      case "detailed_review":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSave = (promptId: string) => {
    toast({
      title: "Prompt Saved",
      description: "Prompt has been updated successfully.",
    })
  }

  const handlePreview = (prompt: Prompt) => {
    // Replace variables with example values for preview
    let previewText = prompt.promptText
    prompt.variables.forEach((variable) => {
      const exampleValues: Record<string, string> = {
        type: "fiction",
        topic: "The Adventures of a Time Traveler",
        language: "English",
      }
      previewText = previewText.replace(new RegExp(`{${variable}}`, "g"), exampleValues[variable] || `{${variable}}`)
    })

    toast({
      title: "Prompt Preview",
      description: "Preview generated with example values.",
    })
  }

  const metadataExtractionPrompts = prompts.filter((p) => p.type === "metadata_extraction")
  const initialReviewPrompts = prompts.filter((p) => p.type === "initial_review")
  const detailedReviewPrompts = prompts.filter((p) => p.type === "detailed_review")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2A4759] mb-2">Prompts Management</h1>
        <p className="text-gray-600">
          Create, edit, and manage prompts used with the LLMs for various tasks and languages. Prompts can include
          variables from manuscript metadata. Prompts work across all languages using the &#123;language&#125;
          parameter.
        </p>
      </div>

      <Tabs defaultValue="metadata" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metadata">Metadata Extraction</TabsTrigger>
          <TabsTrigger value="initial">Initial Review</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Review</TabsTrigger>
        </TabsList>

        <TabsContent value="metadata" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Metadata Extraction Prompts</h2>
            <Button className="bg-[#F79B72] hover:bg-[#F79B72]/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Prompt
            </Button>
          </div>

          {metadataExtractionPrompts.map((prompt) => (
            <Card key={prompt.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(prompt.type)}
                    <div>
                      <CardTitle>{prompt.name}</CardTitle>
                      <CardDescription>Last modified: {prompt.lastModified}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(prompt.type)}>{getTypeName(prompt.type)}</Badge>
                    <Badge variant={prompt.isActive ? "default" : "secondary"}>
                      {prompt.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`prompt-${prompt.id}`}>Prompt Text</Label>
                  <Textarea
                    id={`prompt-${prompt.id}`}
                    value={prompt.promptText}
                    onChange={(e) => {
                      setPrompts((prev) =>
                        prev.map((p) => (p.id === prompt.id ? { ...p, promptText: e.target.value } : p)),
                      )
                    }}
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => handlePreview(prompt)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    onClick={() => handleSave(prompt.id)}
                    className="bg-[#F79B72] hover:bg-[#F79B72]/90 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="initial" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Initial Review Prompts</h2>
            <Button className="bg-[#F79B72] hover:bg-[#F79B72]/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Prompt
            </Button>
          </div>

          {initialReviewPrompts.map((prompt) => (
            <Card key={prompt.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(prompt.type)}
                    <div>
                      <CardTitle>{prompt.name}</CardTitle>
                      <CardDescription>
                        Book Type: {prompt.bookType} • Last modified: {prompt.lastModified}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(prompt.type)}>{getTypeName(prompt.type)}</Badge>
                    <Badge variant="outline">{prompt.bookType}</Badge>
                    <Badge variant={prompt.isActive ? "default" : "secondary"}>
                      {prompt.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`book-type-${prompt.id}`}>Book Type</Label>
                    <Select value={prompt.bookType || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select book type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fiction">Fiction</SelectItem>
                        <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                        <SelectItem value="poetry">Poetry</SelectItem>
                        <SelectItem value="screenplay">Screenplay</SelectItem>
                        <SelectItem value="essay">Essay</SelectItem>
                        <SelectItem value="blog">Blog</SelectItem>
                        <SelectItem value="scientific">Scientific</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {prompt.variables.length > 0 && (
                  <div>
                    <Label>Available Variables</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {prompt.variables.map((variable) => (
                        <Badge key={variable} variant="outline" className="font-mono">
                          <Code className="h-3 w-3 mr-1" />
                          {`{${variable}}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor={`prompt-${prompt.id}`}>Prompt Text</Label>
                  <Textarea
                    id={`prompt-${prompt.id}`}
                    value={prompt.promptText}
                    onChange={(e) => {
                      setPrompts((prev) =>
                        prev.map((p) => (p.id === prompt.id ? { ...p, promptText: e.target.value } : p)),
                      )
                    }}
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => handlePreview(prompt)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview with Variables
                  </Button>
                  <Button
                    onClick={() => handleSave(prompt.id)}
                    className="bg-[#F79B72] hover:bg-[#F79B72]/90 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Detailed Review Prompts</h2>
            <Button className="bg-[#F79B72] hover:bg-[#F79B72]/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Prompt
            </Button>
          </div>

          {detailedReviewPrompts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No detailed review prompts configured yet.</p>
                <Button className="mt-4 bg-[#F79B72] hover:bg-[#F79B72]/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Prompt
                </Button>
              </CardContent>
            </Card>
          ) : (
            detailedReviewPrompts.map((prompt) => (
              <Card key={prompt.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(prompt.type)}
                      <div>
                        <CardTitle>{prompt.name}</CardTitle>
                        <CardDescription>Last modified: {prompt.lastModified}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getTypeColor(prompt.type)}>{getTypeName(prompt.type)}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`prompt-${prompt.id}`}>Prompt Text</Label>
                    <Textarea
                      id={`prompt-${prompt.id}`}
                      value={prompt.promptText}
                      onChange={(e) => {
                        setPrompts((prev) =>
                          prev.map((p) => (p.id === prompt.id ? { ...p, promptText: e.target.value } : p)),
                        )
                      }}
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => handlePreview(prompt)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      onClick={() => handleSave(prompt.id)}
                      className="bg-[#F79B72] hover:bg-[#F79B72]/90 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
