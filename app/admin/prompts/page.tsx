"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BookOpen,
  Save,
  TestTube,
  RotateCcw,
  FileText,
  BookOpenCheck,
  Newspaper,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

interface PromptData {
  id: string
  name: string
  content: string
  lastModified: string
  version: number
  previousVersion?: string
}

export default function PromptsManagement() {
  const [prompts, setPrompts] = useState<Record<string, PromptData>>({
    metadata: {
      id: "metadata",
      name: "Metadata Extraction",
      content: `You are an expert book metadata extraction system. Your task is to analyze the provided manuscript text and extract comprehensive metadata about the book.

Please analyze the text and provide the following information in JSON format:

{
  "title": "The book's title (if explicitly mentioned or can be inferred)",
  "genre": "Primary genre classification",
  "subgenres": ["Array of applicable subgenres"],
  "themes": ["Major themes present in the work"],
  "setting": {
    "time_period": "When the story takes place",
    "location": "Where the story is set",
    "world_type": "realistic/fantasy/sci-fi/historical/etc"
  },
  "characters": {
    "protagonist": "Main character description",
    "supporting_characters": ["Key supporting characters"],
    "character_count": "approximate number of significant characters"
  },
  "narrative_style": {
    "point_of_view": "first person/third person/omniscient/etc",
    "tense": "past/present/mixed",
    "narrative_technique": "linear/non-linear/multiple timelines/etc"
  },
  "content_warnings": ["Any potentially sensitive content"],
  "target_audience": "Primary intended readership",
  "estimated_word_count": "Approximate word count if determinable",
  "language_complexity": "elementary/intermediate/advanced/literary",
  "cultural_context": "Any specific cultural or historical context",
  "series_potential": "standalone/series potential/part of series"
}

Focus on accuracy and provide detailed, specific information where possible. If certain metadata cannot be determined from the provided text, indicate this clearly in your response.`,
      lastModified: "2024-01-15T10:30:00Z",
      version: 3,
      previousVersion: `You are a book metadata extraction system. Analyze the manuscript and extract:

Title, Genre, Themes, Setting, Characters, Style, Target Audience.

Provide in JSON format with detailed analysis.`,
    },
    fiction: {
      id: "fiction",
      name: "Fiction Review",
      content: `You are a professional literary critic and book reviewer specializing in fiction. Your task is to provide a comprehensive, balanced, and insightful review of the submitted manuscript.

Please structure your review with the following sections:

## OVERALL ASSESSMENT
Provide a concise summary of your overall impression, including a rating out of 5 stars and a brief explanation of the rating.

## PLOT AND STRUCTURE
- Evaluate the story's plot development, pacing, and structure
- Assess the effectiveness of the opening, middle, and conclusion
- Comment on plot originality and any plot holes or inconsistencies
- Analyze the use of conflict, tension, and resolution

## CHARACTER DEVELOPMENT
- Evaluate the depth and believability of main characters
- Assess character growth and development throughout the story
- Comment on dialogue quality and character voice distinctiveness
- Analyze relationships between characters and their dynamics

## WRITING STYLE AND CRAFT
- Evaluate prose quality, clarity, and readability
- Assess the author's voice and narrative technique
- Comment on descriptive writing and scene-setting abilities
- Analyze use of literary devices and techniques

## THEMES AND DEPTH
- Identify and evaluate major themes explored in the work
- Assess the depth of thematic exploration
- Comment on the work's emotional resonance and impact
- Evaluate any social, philosophical, or cultural commentary

## GENRE CONVENTIONS
- Assess how well the work fits within its genre
- Evaluate adherence to or creative departure from genre expectations
- Comment on originality within the genre context

## STRENGTHS
List the manuscript's strongest elements and what works particularly well.

## AREAS FOR IMPROVEMENT
Provide constructive feedback on elements that could be strengthened, with specific suggestions where possible.

## TARGET AUDIENCE
Identify the ideal readership for this work and explain why.

## MARKETABILITY
Assess the commercial potential and compare to similar successful works in the market.

## FINAL RECOMMENDATION
Provide a clear recommendation regarding publication readiness and any next steps.

Maintain a professional, constructive tone throughout. Be honest but encouraging, focusing on helping the author improve their work while recognizing its strengths.`,
      lastModified: "2024-01-14T15:45:00Z",
      version: 2,
      previousVersion: `You are a fiction book reviewer. Analyze the manuscript and provide:

Plot assessment, character analysis, writing style evaluation, themes, strengths, weaknesses, and publication recommendation.

Be thorough and constructive in your feedback.`,
    },
    nonfiction: {
      id: "nonfiction",
      name: "Non-Fiction Review",
      content: `You are an expert non-fiction book reviewer and editor with extensive experience across multiple non-fiction categories. Your task is to provide a comprehensive, professional review of the submitted non-fiction manuscript.

Please structure your review with the following sections:

## OVERALL ASSESSMENT
Provide a concise summary of your overall impression, including a rating out of 5 stars and brief explanation of the rating.

## CONTENT AND ACCURACY
- Evaluate the accuracy and reliability of information presented
- Assess the depth and breadth of research
- Comment on fact-checking and source credibility
- Identify any factual errors or questionable claims

## STRUCTURE AND ORGANIZATION
- Evaluate the logical flow and organization of content
- Assess chapter structure and information hierarchy
- Comment on the effectiveness of introductions and conclusions
- Analyze use of headings, subheadings, and navigation aids

## WRITING CLARITY AND ACCESSIBILITY
- Evaluate clarity of explanation for complex concepts
- Assess readability for the intended audience
- Comment on jargon usage and technical language appropriateness
- Analyze the author's ability to make difficult topics accessible

## AUTHORITY AND EXPERTISE
- Evaluate the author's demonstrated expertise in the subject matter
- Assess credibility and authority on the topic
- Comment on the author's unique perspective or contribution
- Analyze use of personal experience vs. research-based content

## PRACTICAL VALUE AND APPLICATION
- Assess the practical utility of the information provided
- Evaluate actionable advice and implementation guidance
- Comment on real-world applicability of concepts
- Analyze tools, frameworks, or methodologies presented

## RESEARCH AND SOURCES
- Evaluate the quality and diversity of sources cited
- Assess bibliography and reference completeness
- Comment on balance between primary and secondary sources
- Analyze integration of research into the narrative

## ORIGINALITY AND CONTRIBUTION
- Assess what new insights or perspectives the work offers
- Evaluate originality of ideas or approach
- Comment on the work's contribution to the field
- Analyze differentiation from existing works on the topic

## VISUAL ELEMENTS AND SUPPLEMENTS
- Evaluate use of charts, graphs, images, or diagrams
- Assess effectiveness of visual aids in supporting content
- Comment on appendices, glossaries, or additional resources
- Analyze overall design and layout considerations

## TARGET AUDIENCE ALIGNMENT
- Identify the intended audience and assess content appropriateness
- Evaluate whether the writing level matches the target readership
- Comment on assumptions about reader background knowledge
- Analyze market positioning within the category

## STRENGTHS
List the manuscript's strongest elements and most valuable contributions.

## AREAS FOR IMPROVEMENT
Provide specific, constructive feedback on elements that need strengthening, with actionable suggestions.

## COMPETITIVE ANALYSIS
Compare to similar works in the market and assess competitive positioning.

## MARKETABILITY AND COMMERCIAL POTENTIAL
Evaluate commercial viability and potential market appeal.

## FINAL RECOMMENDATION
Provide clear guidance on publication readiness and recommended next steps.

Maintain objectivity while being constructive. Focus on helping the author strengthen their work while acknowledging its contributions to the field.`,
      lastModified: "2024-01-13T09:20:00Z",
      version: 4,
      previousVersion: `You are a non-fiction book reviewer. Evaluate the manuscript for:

Content accuracy, organization, writing clarity, research quality, practical value, and market potential.

Provide detailed feedback and publication recommendation.`,
    },
  })

  const [activePrompt, setActivePrompt] = useState<string>("metadata")
  const [editedContent, setEditedContent] = useState<string>("")
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isTesting, setIsTesting] = useState<boolean>(false)
  const [testResult, setTestResult] = useState<string>("")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  useEffect(() => {
    setEditedContent(prompts[activePrompt]?.content || "")
    setIsEditing(false)
    setTestResult("")
  }, [activePrompt, prompts])

  const handleEdit = () => {
    setIsEditing(true)
    setEditedContent(prompts[activePrompt].content)
  }

  const handleSave = async () => {
    setSaveStatus("saving")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updatedPrompt = {
      ...prompts[activePrompt],
      previousVersion: prompts[activePrompt].content,
      content: editedContent,
      lastModified: new Date().toISOString(),
      version: prompts[activePrompt].version + 1,
    }

    setPrompts((prev) => ({
      ...prev,
      [activePrompt]: updatedPrompt,
    }))

    setIsEditing(false)
    setSaveStatus("saved")

    setTimeout(() => setSaveStatus("idle"), 3000)
  }

  const handleRevert = () => {
    if (prompts[activePrompt].previousVersion) {
      const revertedPrompt = {
        ...prompts[activePrompt],
        content: prompts[activePrompt].previousVersion!,
        lastModified: new Date().toISOString(),
        version: prompts[activePrompt].version + 1,
      }

      setPrompts((prev) => ({
        ...prev,
        [activePrompt]: revertedPrompt,
      }))

      setEditedContent(prompts[activePrompt].previousVersion!)
      setIsEditing(false)
    }
  }

  const handleTest = async () => {
    setIsTesting(true)
    setTestResult("")

    // Simulate API test call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setTestResult(
      "✅ Prompt test successful! The AI model responded appropriately to the prompt structure and generated expected output format.",
    )
    setIsTesting(false)
  }

  const handleCancel = () => {
    setEditedContent(prompts[activePrompt].content)
    setIsEditing(false)
  }

  const currentPrompt = prompts[activePrompt]
  const hasChanges = editedContent !== currentPrompt?.content
  const canRevert = currentPrompt?.previousVersion && currentPrompt.previousVersion !== currentPrompt.content

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold text-gray-900">AIbookReview</span>
            <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium ml-3">Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin">← Back to Admin</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Prompts Management</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Configure and manage AI prompts used for metadata extraction and book reviews. Test prompts before saving
            and revert to previous versions when needed.
          </p>
        </div>

        {/* Status Alert */}
        {saveStatus === "saved" && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Prompt saved successfully! Changes are now active.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-amber-600" />
              AI Prompts Configuration
            </CardTitle>
            <CardDescription>
              Manage the prompts used by the AI system for different types of analysis and review generation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activePrompt} onValueChange={setActivePrompt} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="metadata" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Metadata Extraction
                </TabsTrigger>
                <TabsTrigger value="fiction" className="flex items-center gap-2">
                  <BookOpenCheck className="h-4 w-4" />
                  Fiction Review
                </TabsTrigger>
                <TabsTrigger value="nonfiction" className="flex items-center gap-2">
                  <Newspaper className="h-4 w-4" />
                  Non-Fiction Review
                </TabsTrigger>
              </TabsList>

              {Object.entries(prompts).map(([key, prompt]) => (
                <TabsContent key={key} value={key} className="space-y-6">
                  {/* Prompt Info */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{prompt.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>Version {prompt.version}</span>
                        <span>Last modified: {new Date(prompt.lastModified).toLocaleDateString()}</span>
                        <Badge variant="outline" className="text-xs">
                          {prompt.content.length} characters
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isEditing && (
                        <>
                          <Button variant="outline" size="sm" onClick={handleEdit}>
                            Edit Prompt
                          </Button>
                          {canRevert && (
                            <Button variant="outline" size="sm" onClick={handleRevert}>
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Revert
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Prompt Content */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Prompt Content</label>
                      {hasChanges && (
                        <Badge variant="secondary" className="text-xs">
                          Unsaved changes
                        </Badge>
                      )}
                    </div>

                    <Textarea
                      value={isEditing ? editedContent : prompt.content}
                      onChange={(e) => setEditedContent(e.target.value)}
                      readOnly={!isEditing}
                      className={`min-h-[400px] font-mono text-sm ${!isEditing ? "bg-gray-50" : "bg-white"}`}
                      placeholder="Enter your prompt content here..."
                    />

                    {/* Action Buttons */}
                    {isEditing && (
                      <div className="flex items-center gap-3 pt-4 border-t">
                        <Button
                          onClick={handleSave}
                          disabled={!hasChanges || saveStatus === "saving"}
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                        </Button>

                        <Button variant="outline" onClick={handleTest} disabled={isTesting || !editedContent.trim()}>
                          <TestTube className="h-4 w-4 mr-2" />
                          {isTesting ? "Testing..." : "Test Prompt"}
                        </Button>

                        <Button variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </div>
                    )}

                    {/* Test Results */}
                    {testResult && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">{testResult}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Usage Guidelines */}
        <Card className="border-0 shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              Prompt Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Metadata Extraction</h4>
                <p className="text-sm text-gray-600">
                  Used to analyze manuscripts and extract structured information like genre, themes, characters, and
                  setting details.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Fiction Review</h4>
                <p className="text-sm text-gray-600">
                  Generates comprehensive reviews for fiction works, focusing on plot, characters, writing style, and
                  literary merit.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Non-Fiction Review</h4>
                <p className="text-sm text-gray-600">
                  Creates detailed reviews for non-fiction works, emphasizing accuracy, research quality, and practical
                  value.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold text-gray-900 mb-2">Best Practices</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Always test prompts before saving to ensure they generate expected outputs</li>
                <li>• Keep prompts clear and specific to avoid ambiguous AI responses</li>
                <li>• Use structured formats (like JSON) for consistent data extraction</li>
                <li>• Include examples in prompts when possible to guide AI behavior</li>
                <li>• Regularly review and update prompts based on performance feedback</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
