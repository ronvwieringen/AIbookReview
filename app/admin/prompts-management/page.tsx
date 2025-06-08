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

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { FileText, MessageSquare, Zap, Plus, Save, Eye, Code, ArrowLeft, Loader2 } from "lucide-react"
import { useSimpleAuth } from "@/lib/simple-auth"
import Link from "next/link"

interface Prompt {
  id: string
  name: string
  type: "metadata_extraction" | "initial_review" | "detailed_review"
  book_type?: string
  prompt_text: string
  variables: string[]
  is_active: boolean
  lastModified: string
}

export default function PromptsManagementPage() {
  const { user, isAuthenticated } = useSimpleAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user?.role !== "PlatformAdmin") {
      router.push("/")
      return
    }

    fetchPrompts()
  }, [user, isAuthenticated, router])

  const fetchPrompts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/prompts')
      
      if (!response.ok) {
        throw new Error('Failed to fetch prompts')
      }
      
      const data = await response.json()
      setPrompts(data)
    } catch (error) {
      console.error('Error fetching prompts:', error)
      toast({
        title: "Error",
        description: "Failed to load prompts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (promptId: string) => {
    const prompt = prompts.find(p => p.id === promptId)
    if (!prompt) return

    // Validation
    if (!prompt.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Prompt name is required.",
        variant: "destructive",
      })
      return
    }

    if (!prompt.prompt_text.trim()) {
      toast({
        title: "Validation Error", 
        description: "Prompt text is required.",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(promptId)
      
      const response = await fetch(`/api/prompts/${promptId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prompt),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save prompt')
      }

      const updatedPrompt = await response.json()
      
      setPrompts(prev => prev.map(p => 
        p.id === promptId ? updatedPrompt : p
      ))

      toast({
        title: "Success",
        description: "Prompt saved successfully.",
      })
    } catch (error) {
      console.error('Error saving prompt:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save prompt.",
        variant: "destructive",
      })
    } finally {
      setSaving(null)
    }
  }

  const handlePreview = (prompt: Prompt) => {
    let previewText = prompt.prompt_text
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

  const updatePrompt = (promptId: string, field: keyof Prompt, value: any) => {
    setPrompts(prev => prev.map(p => 
      p.id === promptId ? { ...p, [field]: value } : p
    ))
  }

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

  if (!isAuthenticated || user?.role !== "PlatformAdmin") {
    return <div>Loading...</div>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#F79B72]" />
          <span className="text-gray-600">Loading prompts...</span>
        </div>
      </div>
    )
  }

  const metadataExtractionPrompts = prompts.filter((p) => p.type === "metadata_extraction")
  const initialReviewPrompts = prompts.filter((p) => p.type === "initial_review")
  const detailedReviewPrompts = prompts.filter((p) => p.type === "detailed_review")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/admin" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Admin Dashboard
            </Link>
          </Button>
        </div>
        
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
                    <Badge variant={prompt.is_active ? "default" : "secondary"}>
                      {prompt.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`prompt-${prompt.id}`}>Prompt Text</Label>
                  <Textarea
                    id={`prompt-${prompt.id}`}
                    value={prompt.prompt_text}
                    onChange={(e) => updatePrompt(prompt.id, 'prompt_text', e.target.value)}
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
                    disabled={saving === prompt.id}
                    className="bg-[#F79B72] hover:bg-[#F79B72]/90 text-white"
                  >
                    {saving === prompt.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
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
                        Book Type: {prompt.book_type} • Last modified: {prompt.lastModified}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(prompt.type)}>{getTypeName(prompt.type)}</Badge>
                    <Badge variant="outline">{prompt.book_type}</Badge>
                    <Badge variant={prompt.is_active ? "default" : "secondary"}>
                      {prompt.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`book-type-${prompt.id}`}>Book Type</Label>
                    <Select 
                      value={prompt.book_type || ""} 
                      onValueChange={(value) => updatePrompt(prompt.id, 'book_type', value)}
                    >
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
                    value={prompt.prompt_text}
                    onChange={(e) => updatePrompt(prompt.id, 'prompt_text', e.target.value)}
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
                    disabled={saving === prompt.id}
                    className="bg-[#F79B72] hover:bg-[#F79B72]/90 text-white"
                  >
                    {saving === prompt.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
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
                      value={prompt.prompt_text}
                      onChange={(e) => updatePrompt(prompt.id, 'prompt_text', e.target.value)}
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
                      disabled={saving === prompt.id}
                      className="bg-[#F79B72] hover:bg-[#F79B72]/90 text-white"
                    >
                      {saving === prompt.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
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