/**
 * LLM Configuration Management Screen (FR802)
 *
 * Requirements References:
 * - FR802: LLM Configuration Management: Manage configurations for different AI models used
 *   (metadata extraction, review types, quality scoring, plagiarism support, blurb generation,
 *   service needs signaling). There is an LLM for metadata extraction, one for initial review
 *   and one for detailed (payed) analysis. For each LLM there is a backup LLM which is used
 *   when the primary LLM cannot be reached. LLM attributes: public name, API URL, model code, API key
 * - NFR018: Code should be well-documented, modular, and follow consistent coding standards
 * - NFR009: Access Control: Role-based access control must be enforced across all platform functions
 * - NFR008: Data Encryption: Sensitive data (e.g., passwords, API keys) must be encrypted at rest and in transit
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Settings, Database, Brain, Zap, Shield, Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface LLMConfig {
  id: string
  name: string
  type: "metadata_extraction" | "initial_review" | "detailed_review"
  primaryLLM: {
    apiUrl: string
    modelCode: string
    apiKey: string
  }
  backupLLM: {
    apiUrl: string
    modelCode: string
    apiKey: string
  }
  isActive: boolean
}

export default function LLMManagementPage() {
  const { toast } = useToast()
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({})

  // Mock data - in real implementation, this would come from the database
  const [llmConfigs, setLlmConfigs] = useState<LLMConfig[]>([
    {
      id: "1",
      name: "Metadata Extraction Engine",
      type: "metadata_extraction",
      primaryLLM: {
        apiUrl: "https://api.openai.com/v1",
        modelCode: "gpt-4o-mini",
        apiKey: "sk-proj-*********************",
      },
      backupLLM: {
        apiUrl: "https://api.anthropic.com/v1",
        modelCode: "claude-3-haiku-20240307",
        apiKey: "sk-ant-*********************",
      },
      isActive: true,
    },
    {
      id: "2",
      name: "Initial Review Generator",
      type: "initial_review",
      primaryLLM: {
        apiUrl: "https://api.openai.com/v1",
        modelCode: "gpt-4o",
        apiKey: "sk-proj-*********************",
      },
      backupLLM: {
        apiUrl: "https://api.anthropic.com/v1",
        modelCode: "claude-3-sonnet-20240229",
        apiKey: "sk-ant-*********************",
      },
      isActive: true,
    },
    {
      id: "3",
      name: "Detailed Analysis Engine",
      type: "detailed_review",
      primaryLLM: {
        apiUrl: "https://api.openai.com/v1",
        modelCode: "gpt-4o",
        apiKey: "sk-proj-*********************",
      },
      backupLLM: {
        apiUrl: "https://api.anthropic.com/v1",
        modelCode: "claude-3-opus-20240229",
        apiKey: "sk-ant-*********************",
      },
      isActive: true,
    },
  ])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "metadata_extraction":
        return <Database className="h-5 w-5" />
      case "initial_review":
        return <Brain className="h-5 w-5" />
      case "detailed_review":
        return <Zap className="h-5 w-5" />
      default:
        return <Settings className="h-5 w-5" />
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

  const toggleApiKeyVisibility = (configId: string, llmType: "primary" | "backup") => {
    const key = `${configId}-${llmType}`
    setShowApiKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const maskApiKey = (apiKey: string) => {
    if (apiKey.length <= 8) return apiKey
    return apiKey.substring(0, 8) + "*".repeat(apiKey.length - 8)
  }

  const handleSave = (configId: string) => {
    toast({
      title: "Configuration Saved",
      description: "LLM configuration has been updated successfully.",
    })
  }

  const handleTest = (configId: string, llmType: "primary" | "backup") => {
    toast({
      title: "Testing Connection",
      description: `Testing ${llmType} LLM connection...`,
    })

    // Simulate API test
    setTimeout(() => {
      toast({
        title: "Connection Successful",
        description: `${llmType} LLM is responding correctly.`,
      })
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2A4759] mb-2">LLM Configuration Management</h1>
        <p className="text-gray-600">
          Manage AI model configurations for metadata extraction, initial reviews, and detailed analysis. Each
          configuration includes a primary LLM and a backup LLM for redundancy.
        </p>
      </div>

      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/admin" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        {llmConfigs.map((config) => (
          <Card key={config.id} className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(config.type)}
                  <div>
                    <CardTitle className="text-xl">{config.name}</CardTitle>
                    <CardDescription>
                      Configuration for {getTypeName(config.type).toLowerCase()} processing
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(config.type)}>{getTypeName(config.type)}</Badge>
                  <Badge variant={config.isActive ? "default" : "secondary"}>
                    {config.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary LLM Configuration */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-4 w-4 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-600">Primary LLM</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`primary-api-url-${config.id}`}>API URL</Label>
                    <Input
                      id={`primary-api-url-${config.id}`}
                      value={config.primaryLLM.apiUrl}
                      onChange={(e) => {
                        setLlmConfigs((prev) =>
                          prev.map((c) =>
                            c.id === config.id ? { ...c, primaryLLM: { ...c.primaryLLM, apiUrl: e.target.value } } : c,
                          ),
                        )
                      }}
                      placeholder="https://api.example.com/v1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`primary-model-${config.id}`}>Model Code</Label>
                    <Input
                      id={`primary-model-${config.id}`}
                      value={config.primaryLLM.modelCode}
                      onChange={(e) => {
                        setLlmConfigs((prev) =>
                          prev.map((c) =>
                            c.id === config.id
                              ? { ...c, primaryLLM: { ...c.primaryLLM, modelCode: e.target.value } }
                              : c,
                          ),
                        )
                      }}
                      placeholder="gpt-4o"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`primary-api-key-${config.id}`}>API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`primary-api-key-${config.id}`}
                        type={showApiKeys[`${config.id}-primary`] ? "text" : "password"}
                        value={
                          showApiKeys[`${config.id}-primary`]
                            ? config.primaryLLM.apiKey
                            : maskApiKey(config.primaryLLM.apiKey)
                        }
                        onChange={(e) => {
                          setLlmConfigs((prev) =>
                            prev.map((c) =>
                              c.id === config.id
                                ? { ...c, primaryLLM: { ...c.primaryLLM, apiKey: e.target.value } }
                                : c,
                            ),
                          )
                        }}
                        placeholder="sk-proj-..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => toggleApiKeyVisibility(config.id, "primary")}
                      >
                        {showApiKeys[`${config.id}-primary`] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => handleTest(config.id, "primary")}>
                        Test
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Backup LLM Configuration */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-4 w-4 text-orange-600" />
                  <h3 className="text-lg font-semibold text-orange-600">Backup LLM</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`backup-api-url-${config.id}`}>API URL</Label>
                    <Input
                      id={`backup-api-url-${config.id}`}
                      value={config.backupLLM.apiUrl}
                      onChange={(e) => {
                        setLlmConfigs((prev) =>
                          prev.map((c) =>
                            c.id === config.id ? { ...c, backupLLM: { ...c.backupLLM, apiUrl: e.target.value } } : c,
                          ),
                        )
                      }}
                      placeholder="https://api.example.com/v1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`backup-model-${config.id}`}>Model Code</Label>
                    <Input
                      id={`backup-model-${config.id}`}
                      value={config.backupLLM.modelCode}
                      onChange={(e) => {
                        setLlmConfigs((prev) =>
                          prev.map((c) =>
                            c.id === config.id ? { ...c, backupLLM: { ...c.backupLLM, modelCode: e.target.value } } : c,
                          ),
                        )
                      }}
                      placeholder="claude-3-sonnet"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`backup-api-key-${config.id}`}>API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`backup-api-key-${config.id}`}
                        type={showApiKeys[`${config.id}-backup`] ? "text" : "password"}
                        value={
                          showApiKeys[`${config.id}-backup`]
                            ? config.backupLLM.apiKey
                            : maskApiKey(config.backupLLM.apiKey)
                        }
                        onChange={(e) => {
                          setLlmConfigs((prev) =>
                            prev.map((c) =>
                              c.id === config.id ? { ...c, backupLLM: { ...c.backupLLM, apiKey: e.target.value } } : c,
                            ),
                          )
                        }}
                        placeholder="sk-ant-..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => toggleApiKeyVisibility(config.id, "backup")}
                      >
                        {showApiKeys[`${config.id}-backup`] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => handleTest(config.id, "backup")}>
                        Test
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => handleSave(config.id)} className="bg-[#F79B72] hover:bg-[#F79B72]/90 text-white">
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
