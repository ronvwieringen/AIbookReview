"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ChevronLeft, Save, TestTube, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

// Define the type for LLM configuration
interface LLMConfig {
  name: string
  url: string
  model: string
  apiKey: string
  status: string
  lastTested: string
}

interface LLMConfigs {
  primary: LLMConfig
  backup: LLMConfig
  metadata: LLMConfig
}

// Mock data for LLM configurations
const initialLLMConfigs: LLMConfigs = {
  primary: {
    name: "Gemini 2.5 Pro",
    url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro",
    model: "gemini-2.5pro",
    apiKey: "AIza***************************",
    status: "active",
    lastTested: "2024-01-15 14:30:00",
  },
  backup: {
    name: "Gemini Pro 1.5",
    url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro",
    model: "gemini-1.5-pro",
    apiKey: "AIza***************************",
    status: "standby",
    lastTested: "2024-11-15 14:25:00",
  },
  metadata: {
    name: "Gemini Flash",
    url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash",
    model: "gemini-2.5flash",
    apiKey: "",
    status: "active",
    lastTested: "2025-05-15 14:25:00",
  },
}

export default function LLMManagementPage() {
  const [configs, setConfigs] = useState<LLMConfigs>(initialLLMConfigs)
  const [activeTab, setActiveTab] = useState<keyof LLMConfigs>("primary")
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setShowSuccessAlert(true)
      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)
    }, 1000)
  }

  const handleTest = () => {
    setIsTesting(true)
    // Simulate API test
    setTimeout(() => {
      setIsTesting(false)
      const updatedConfigs = { ...configs }
      updatedConfigs[activeTab].lastTested = new Date().toLocaleString()
      updatedConfigs[activeTab].status = "active"
      setConfigs(updatedConfigs)
    }, 2000)
  }

  const updateConfig = (field: keyof LLMConfig, value: string) => {
    const updatedConfigs = { ...configs }
    updatedConfigs[activeTab] = {
      ...updatedConfigs[activeTab],
      [field]: value,
    }
    setConfigs(updatedConfigs)
  }

  // Safely get current config with fallback
  const currentConfig = configs[activeTab] || initialLLMConfigs.primary

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
            <span className="text-gray-600">LLM Management</span>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin">Back to Admin</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button variant="ghost" className="mb-6 text-gray-600 hover:text-amber-600 pl-0" asChild>
          <Link href="/admin">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </Link>
        </Button>

        {/* Success Alert */}
        {showSuccessAlert && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">LLM configuration saved successfully!</AlertDescription>
          </Alert>
        )}

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">LLM Management</h1>
          <p className="text-xl text-gray-600">
            Configure Gemini AI models for book analysis. Manage primary, backup, and metadata model settings.
          </p>
        </div>

        {/* Model Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("primary")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "primary" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Primary Model
            </button>
            <button
              onClick={() => setActiveTab("backup")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "backup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Backup Model
            </button>
            <button
              onClick={() => setActiveTab("metadata")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "metadata" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Metadata
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-gray-900">
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Model Configuration
                    </CardTitle>
                    <CardDescription>Configure the Gemini model settings for book analysis</CardDescription>
                  </div>
                  <Badge
                    className={`${
                      currentConfig.status === "active"
                        ? "bg-green-100 text-green-800"
                        : currentConfig.status === "standby"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {currentConfig.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="model-name" className="text-sm font-medium text-gray-900">
                    Model Name
                  </Label>
                  <Input
                    id="model-name"
                    value={currentConfig.name}
                    onChange={(e) => updateConfig("name", e.target.value)}
                    placeholder="e.g., Gemini Pro"
                    className="border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-url" className="text-sm font-medium text-gray-900">
                    API URL
                  </Label>
                  <Input
                    id="api-url"
                    value={currentConfig.url}
                    onChange={(e) => updateConfig("url", e.target.value)}
                    placeholder="https://generativelanguage.googleapis.com/v1beta/models/..."
                    className="border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model-id" className="text-sm font-medium text-gray-900">
                    Model ID
                  </Label>
                  <Input
                    id="model-id"
                    value={currentConfig.model}
                    onChange={(e) => updateConfig("model", e.target.value)}
                    placeholder="e.g., gemini-pro"
                    className="border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key" className="text-sm font-medium text-gray-900">
                    API Key
                  </Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={currentConfig.apiKey}
                    onChange={(e) => updateConfig("apiKey", e.target.value)}
                    placeholder="Enter your Gemini API key"
                    className="border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={handleTest}
                    disabled={isTesting}
                    variant="outline"
                    className="border-amber-200 text-amber-700 hover:bg-amber-50"
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    {isTesting ? "Testing..." : "Test Connection"}
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving} className="bg-amber-600 hover:bg-amber-700">
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Configuration"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Panel */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Model Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Status</span>
                  <Badge
                    className={`${
                      currentConfig.status === "active"
                        ? "bg-green-100 text-green-800"
                        : currentConfig.status === "standby"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {currentConfig.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Tested</span>
                  <span className="text-sm font-medium text-gray-900">{currentConfig.lastTested}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">All Models Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(configs).map(([key, config]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{config.name}</p>
                      <p className="text-xs text-gray-600 capitalize">{key}</p>
                    </div>
                    <Badge
                      className={`${
                        config.status === "active"
                          ? "bg-green-100 text-green-800"
                          : config.status === "standby"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {config.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Important:</strong> Always test the connection after making changes. The backup model will be
                used automatically if the primary model fails.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}
