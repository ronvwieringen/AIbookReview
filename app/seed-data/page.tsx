"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, Database, BookOpen, Trash2 } from "lucide-react"
import { supabase } from '@/lib/supabase/client'

interface SeedStep {
  name: string
  status: 'pending' | 'running' | 'success' | 'error'
  message: string
  details?: any
}

export default function SeedDataPage() {
  const [steps, setSteps] = useState<SeedStep[]>([])
  const [isSeeding, setIsSeeding] = useState(false)
  const [progress, setProgress] = useState(0)

  const updateStep = (index: number, status: 'running' | 'success' | 'error', message: string, details?: any) => {
    setSteps(prev => prev.map((step, i) => 
      i === index ? { ...step, status, message, details } : step
    ))
  }

  const seedDatabase = async () => {
    setIsSeeding(true)
    setProgress(0)
    
    const seedSteps = [
      { name: 'Create Test Authors', status: 'pending' as const, message: 'Preparing...' },
      { name: 'Create Test Books', status: 'pending' as const, message: 'Preparing...' },
      { name: 'Create AI Reviews', status: 'pending' as const, message: 'Preparing...' },
      { name: 'Create Purchase Links', status: 'pending' as const, message: 'Preparing...' },
      { name: 'Verify Data', status: 'pending' as const, message: 'Preparing...' }
    ]
    setSteps(seedSteps)

    try {
      // Step 1: Create test authors
      updateStep(0, 'running', 'Creating test author profiles...')
      setProgress(20)

      const testAuthors = [
        { email: 'sarah.johnson@example.com', full_name: 'Sarah Johnson', role: 'author' },
        { email: 'michael.chen@example.com', full_name: 'Michael Chen', role: 'author' },
        { email: 'emma.rodriguez@example.com', full_name: 'Emma Rodriguez', role: 'author' },
        { email: 'david.park@example.com', full_name: 'David Park', role: 'author' }
      ]

      const authorIds = []
      for (const author of testAuthors) {
        // Create auth user first
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: author.email,
          password: 'testpassword123',
          email_confirm: true,
          user_metadata: { full_name: author.full_name }
        })

        if (authError && !authError.message.includes('already registered')) {
          throw new Error(`Failed to create auth user: ${authError.message}`)
        }

        // Create or update profile
        const userId = authData?.user?.id || (await supabase
          .from('profiles')
          .select('id')
          .eq('email', author.email)
          .single()).data?.id

        if (userId) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              email: author.email,
              full_name: author.full_name,
              role: author.role
            })

          if (profileError) {
            throw new Error(`Failed to create profile: ${profileError.message}`)
          }
          authorIds.push(userId)
        }
      }

      updateStep(0, 'success', `Created ${authorIds.length} test authors`)

      // Step 2: Create test books
      updateStep(1, 'running', 'Creating test books...')
      setProgress(40)

      const testBooks = [
        {
          title: "The Digital Frontier",
          author_id: authorIds[0],
          genre_id: 2, // Science Fiction
          language: "english",
          description: "A thrilling journey through virtual worlds where reality and digital existence blur.",
          publisher: "Independent Press",
          visibility: "public"
        },
        {
          title: "Love in the Time of AI",
          author_id: authorIds[1],
          genre_id: 4, // Romance
          language: "english",
          description: "A heartwarming story about finding love in an increasingly digital world.",
          publisher: "Romance Publishers",
          visibility: "public"
        },
        {
          title: "Shadows of Tomorrow",
          author_id: authorIds[2],
          genre_id: 5, // Mystery
          language: "english",
          description: "A gripping mystery that keeps readers guessing until the very last page.",
          publisher: "Mystery House",
          visibility: "public"
        },
        {
          title: "The Quantum Garden",
          author_id: authorIds[3],
          genre_id: 2, // Science Fiction
          language: "english",
          description: "An epic tale of quantum physics and parallel universes colliding.",
          publisher: "Sci-Fi Press",
          visibility: "public"
        }
      ]

      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .insert(testBooks)
        .select('id, title')

      if (booksError) {
        throw new Error(`Failed to create books: ${booksError.message}`)
      }

      updateStep(1, 'success', `Created ${booksData.length} test books`)

      // Step 3: Create AI reviews
      updateStep(2, 'running', 'Creating AI reviews...')
      setProgress(60)

      const aiReviews = [
        {
          book_id: booksData[0].id,
          ai_quality_score: 87,
          plot_score: 88,
          character_score: 85,
          writing_style_score: 92,
          pacing_score: 78,
          world_building_score: 95,
          status: 'completed',
          ai_analysis: {
            strengths: [
              "Exceptional world-building with detailed technology",
              "Strong character development and internal struggles",
              "Well-paced plot with escalating tension"
            ],
            improvements: [
              "Some secondary characters need more depth",
              "Technical explanations slow the narrative",
              "Middle section has pacing issues"
            ],
            conclusion: "An ambitious and largely successful science fiction novel."
          }
        },
        {
          book_id: booksData[1].id,
          ai_quality_score: 92,
          plot_score: 90,
          character_score: 95,
          writing_style_score: 88,
          pacing_score: 92,
          world_building_score: 85,
          status: 'completed',
          ai_analysis: {
            strengths: [
              "Compelling romantic development",
              "Excellent character chemistry",
              "Thoughtful exploration of modern relationships"
            ],
            improvements: [
              "Some plot points feel predictable",
              "Could use more conflict in the middle"
            ],
            conclusion: "A delightful romance with heart and intelligence."
          }
        },
        {
          book_id: booksData[2].id,
          ai_quality_score: 78,
          plot_score: 82,
          character_score: 75,
          writing_style_score: 80,
          pacing_score: 85,
          world_building_score: 70,
          status: 'completed',
          ai_analysis: {
            strengths: [
              "Intriguing mystery plot",
              "Good pacing and suspense",
              "Satisfying resolution"
            ],
            improvements: [
              "Character development could be stronger",
              "Some red herrings feel forced"
            ],
            conclusion: "A solid mystery with room for improvement."
          }
        },
        {
          book_id: booksData[3].id,
          ai_quality_score: 95,
          plot_score: 95,
          character_score: 90,
          writing_style_score: 98,
          pacing_score: 92,
          world_building_score: 100,
          status: 'completed',
          ai_analysis: {
            strengths: [
              "Masterful world-building",
              "Complex and engaging plot",
              "Beautiful prose style"
            ],
            improvements: [
              "Could be more accessible to general readers"
            ],
            conclusion: "A tour de force of science fiction writing."
          }
        }
      ]

      const { error: reviewsError } = await supabase
        .from('ai_reviews')
        .insert(aiReviews)

      if (reviewsError) {
        throw new Error(`Failed to create AI reviews: ${reviewsError.message}`)
      }

      updateStep(2, 'success', `Created ${aiReviews.length} AI reviews`)

      // Step 4: Create purchase links
      updateStep(3, 'running', 'Creating purchase links...')
      setProgress(80)

      const purchaseLinks = []
      for (const book of booksData) {
        purchaseLinks.push(
          { book_id: book.id, platform_name: 'Amazon', url: 'https://amazon.com' },
          { book_id: book.id, platform_name: 'Barnes & Noble', url: 'https://barnesandnoble.com' }
        )
      }

      const { error: linksError } = await supabase
        .from('book_purchase_links')
        .insert(purchaseLinks)

      if (linksError) {
        throw new Error(`Failed to create purchase links: ${linksError.message}`)
      }

      updateStep(3, 'success', `Created ${purchaseLinks.length} purchase links`)

      // Step 5: Verify data
      updateStep(4, 'running', 'Verifying seeded data...')
      setProgress(100)

      const { data: verifyData, error: verifyError } = await supabase
        .from('books')
        .select(`
          id,
          title,
          visibility,
          ai_reviews(ai_quality_score),
          book_purchase_links(platform_name)
        `)
        .eq('visibility', 'public')

      if (verifyError) {
        throw new Error(`Failed to verify data: ${verifyError.message}`)
      }

      updateStep(4, 'success', `Verified ${verifyData.length} public books with reviews and links`, verifyData)

    } catch (error: any) {
      const currentStepIndex = steps.findIndex(step => step.status === 'running')
      if (currentStepIndex >= 0) {
        updateStep(currentStepIndex, 'error', error.message)
      }
    } finally {
      setIsSeeding(false)
    }
  }

  const clearTestData = async () => {
    try {
      setIsSeeding(true)
      
      // Delete in reverse order of dependencies
      await supabase.from('book_purchase_links').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('ai_reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('books').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      
      // Delete test author profiles
      const testEmails = [
        'sarah.johnson@example.com',
        'michael.chen@example.com', 
        'emma.rodriguez@example.com',
        'david.park@example.com'
      ]
      
      await supabase.from('profiles').delete().in('email', testEmails)
      
      alert('Test data cleared successfully!')
      setSteps([])
      setProgress(0)
    } catch (error: any) {
      alert(`Error clearing data: ${error.message}`)
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold text-gray-900">AIbookReview</span>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Seed Test Data</h1>
            <p className="text-gray-600">
              Populate the database with sample books for testing the discover page
            </p>
          </div>

          {/* Controls */}
          <Card className="mb-6 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Database Seeding</CardTitle>
              <CardDescription>
                Create sample books, authors, and reviews for testing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button 
                  onClick={seedDatabase}
                  disabled={isSeeding}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSeeding ? 'Seeding Data...' : 'Seed Test Data'}
                </Button>
                
                <Button 
                  onClick={clearTestData}
                  disabled={isSeeding}
                  variant="outline"
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Test Data
                </Button>
              </div>

              {isSeeding && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {steps.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Seeding Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{step.name}</h4>
                        <div className="flex items-center gap-2">
                          {step.status === 'running' && (
                            <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          )}
                          {step.status === 'success' && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                          {step.status === 'error' && (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          )}
                          <span className={`text-sm font-medium ${
                            step.status === 'success' ? 'text-green-600' :
                            step.status === 'error' ? 'text-red-600' :
                            step.status === 'running' ? 'text-blue-600' :
                            'text-gray-600'
                          }`}>
                            {step.status === 'pending' ? 'Pending' : 
                             step.status === 'running' ? 'Running' :
                             step.status === 'success' ? 'Success' : 'Error'}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{step.message}</p>
                      {step.details && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-xs text-gray-500">View Details</summary>
                          <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
                            {JSON.stringify(step.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="mt-6 border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-800">Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-amber-800 space-y-3">
                <p>After seeding the data successfully:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Go to the <a href="/discover" className="underline font-medium">Discover page</a> to see the books</li>
                  <li>Test the search and filter functionality</li>
                  <li>Click on books to view detailed reviews</li>
                  <li>Verify all data is displaying correctly</li>
                </ol>
                <div className="pt-3">
                  <Button onClick={() => window.location.href = '/discover'} className="bg-amber-600 hover:bg-amber-700">
                    Go to Discover Page
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}