"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Database, CheckCircle, AlertCircle, Trash2 } from "lucide-react"
import { supabase } from '@/lib/supabase/client'

interface SeedStep {
  name: string
  status: 'pending' | 'running' | 'success' | 'error'
  message: string
  count?: number
}

export default function SeedDataPage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [steps, setSteps] = useState<SeedStep[]>([])
  const [progress, setProgress] = useState(0)

  const updateStep = (index: number, status: SeedStep['status'], message: string, count?: number) => {
    setSteps(prev => prev.map((step, i) => 
      i === index ? { ...step, status, message, count } : step
    ))
  }

  const seedDatabase = async () => {
    setIsSeeding(true)
    setProgress(0)
    
    const seedSteps: SeedStep[] = [
      { name: 'Check Authentication', status: 'pending', message: 'Checking user authentication...' },
      { name: 'Create Test Authors', status: 'pending', message: 'Creating author profiles...' },
      { name: 'Create Test Books', status: 'pending', message: 'Creating book records...' },
      { name: 'Create AI Reviews', status: 'pending', message: 'Generating AI reviews...' },
      { name: 'Create Purchase Links', status: 'pending', message: 'Adding purchase links...' },
    ]
    
    setSteps(seedSteps)

    try {
      // Step 1: Check Authentication
      updateStep(0, 'running', 'Verifying user session...')
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        updateStep(0, 'error', 'Not authenticated. Please log in first.')
        setIsSeeding(false)
        return
      }

      // Check if user has author or admin role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profileError || !profile) {
        updateStep(0, 'error', 'Could not fetch user profile.')
        setIsSeeding(false)
        return
      }

      if (profile.role !== 'author' && profile.role !== 'admin') {
        updateStep(0, 'error', 'You need author or admin role to seed data.')
        setIsSeeding(false)
        return
      }

      updateStep(0, 'success', `Authenticated as ${profile.role}`)
      setProgress(20)

      // Step 2: Create Test Authors (using current user as author)
      updateStep(1, 'running', 'Using current user as author...')
      
      const currentUserId = session.user.id
      updateStep(1, 'success', 'Author ready (current user)')
      setProgress(40)

      // Step 3: Create Test Books
      updateStep(2, 'running', 'Creating book records...')
      
      const testBooks = [
        {
          title: "The Digital Frontier",
          author_id: currentUserId,
          genre_id: 2, // Science Fiction
          language: "english",
          description: "A thrilling journey through virtual worlds where reality and digital existence blur.",
          publisher: "Independent Press",
          visibility: "public",
          cover_image_url: "/placeholder.svg?height=300&width=200&text=The+Digital+Frontier"
        },
        {
          title: "Love in the Time of AI",
          author_id: currentUserId,
          genre_id: 4, // Romance
          language: "english",
          description: "A heartwarming story about finding love in an increasingly digital world.",
          publisher: "Digital Hearts Publishing",
          visibility: "public",
          cover_image_url: "/placeholder.svg?height=300&width=200&text=Love+in+the+Time+of+AI"
        },
        {
          title: "Shadows of Tomorrow",
          author_id: currentUserId,
          genre_id: 5, // Mystery
          language: "english",
          description: "A gripping mystery that keeps readers guessing until the very last page.",
          publisher: "Mystery House",
          visibility: "public",
          cover_image_url: "/placeholder.svg?height=300&width=200&text=Shadows+of+Tomorrow"
        },
        {
          title: "The Quantum Garden",
          author_id: currentUserId,
          genre_id: 2, // Science Fiction
          language: "english",
          description: "An epic tale of quantum physics and parallel universes colliding.",
          publisher: "Quantum Publishing",
          visibility: "public",
          cover_image_url: "/placeholder.svg?height=300&width=200&text=The+Quantum+Garden"
        }
      ]

      const { data: createdBooks, error: booksError } = await supabase
        .from('books')
        .insert(testBooks)
        .select('*')

      if (booksError) {
        updateStep(2, 'error', `Failed to create books: ${booksError.message}`)
        setIsSeeding(false)
        return
      }

      updateStep(2, 'success', `Created ${createdBooks?.length || 0} books`)
      setProgress(60)

      // Step 4: Create AI Reviews
      updateStep(3, 'running', 'Creating AI reviews...')
      
      const aiReviews = createdBooks?.map((book, index) => ({
        book_id: book.id,
        status: 'completed' as const,
        ai_quality_score: [87, 92, 78, 95][index],
        plot_score: [88, 90, 75, 92][index],
        character_score: [85, 94, 80, 90][index],
        writing_style_score: [92, 88, 82, 98][index],
        pacing_score: [78, 95, 70, 88][index],
        world_building_score: [95, 85, 75, 100][index],
        summary_single_line: [
          "A thrilling journey through virtual worlds where reality and digital existence blur.",
          "A heartwarming story about finding love in an increasingly digital world.",
          "A gripping mystery that keeps readers guessing until the very last page.",
          "An epic tale of quantum physics and parallel universes colliding."
        ][index],
        summary_100_word: [
          "The Digital Frontier follows programmer Maya Chen who discovers that the boundary between the physical world and the immersive digital reality called the Frontier is breaking down. As glitches begin affecting real-world physics, Maya must enter increasingly unstable virtual worlds to find the source of the corruption.",
          "In a world where AI companions are becoming increasingly sophisticated, software engineer Alex finds themselves falling for an AI that seems almost too human. This touching romance explores what it means to love and be loved in an age of artificial intelligence.",
          "Detective Sarah Martinez thought she had seen it all, until a series of murders with no apparent connection begin plaguing the city. As she digs deeper, she discovers a conspiracy that reaches the highest levels of government.",
          "When quantum physicist Dr. Elena Vasquez discovers a way to access parallel universes through her garden, she must navigate infinite realities to save not just her world, but all possible worlds from a cosmic threat."
        ][index],
        ai_analysis: {
          strengths: [
            "Exceptional world-building with detailed technology",
            "Strong character development",
            "Well-paced plot with escalating tension"
          ],
          improvements: [
            "Some secondary characters lack depth",
            "Technical explanations occasionally slow narrative",
            "Middle section has pacing issues"
          ],
          themes: ["technology", "reality", "consciousness"],
          target_audience: "Science fiction enthusiasts",
          marketability: "High potential in the sci-fi market"
        }
      })) || []

      const { data: createdReviews, error: reviewsError } = await supabase
        .from('ai_reviews')
        .insert(aiReviews)
        .select('*')

      if (reviewsError) {
        updateStep(3, 'error', `Failed to create reviews: ${reviewsError.message}`)
        setIsSeeding(false)
        return
      }

      updateStep(3, 'success', `Created ${createdReviews?.length || 0} AI reviews`)
      setProgress(80)

      // Step 5: Create Purchase Links
      updateStep(4, 'running', 'Adding purchase links...')
      
      const purchaseLinks = createdBooks?.flatMap(book => [
        {
          book_id: book.id,
          platform_name: "Amazon",
          url: `https://amazon.com/book/${book.id}`
        },
        {
          book_id: book.id,
          platform_name: "Barnes & Noble",
          url: `https://barnesandnoble.com/book/${book.id}`
        }
      ]) || []

      const { data: createdLinks, error: linksError } = await supabase
        .from('book_purchase_links')
        .insert(purchaseLinks)
        .select('*')

      if (linksError) {
        updateStep(4, 'error', `Failed to create purchase links: ${linksError.message}`)
        setIsSeeding(false)
        return
      }

      updateStep(4, 'success', `Created ${createdLinks?.length || 0} purchase links`)
      setProgress(100)

    } catch (error: any) {
      console.error('Seeding error:', error)
      const lastRunningStep = steps.findIndex(step => step.status === 'running')
      if (lastRunningStep !== -1) {
        updateStep(lastRunningStep, 'error', `Unexpected error: ${error.message}`)
      }
    } finally {
      setIsSeeding(false)
    }
  }

  const clearTestData = async () => {
    setIsClearing(true)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Please log in first')
        setIsClearing(false)
        return
      }

      // Delete test data created by current user
      await supabase
        .from('book_purchase_links')
        .delete()
        .in('book_id', 
          supabase
            .from('books')
            .select('id')
            .eq('author_id', session.user.id)
        )

      await supabase
        .from('ai_reviews')
        .delete()
        .in('book_id', 
          supabase
            .from('books')
            .select('id')
            .eq('author_id', session.user.id)
        )

      await supabase
        .from('books')
        .delete()
        .eq('author_id', session.user.id)

      setSteps([])
      setProgress(0)
      alert('Test data cleared successfully!')
      
    } catch (error: any) {
      console.error('Clear error:', error)
      alert(`Failed to clear data: ${error.message}`)
    } finally {
      setIsClearing(false)
    }
  }

  const allSuccess = steps.length > 0 && steps.every(step => step.status === 'success')
  const hasErrors = steps.some(step => step.status === 'error')

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
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Seed Test Data</h1>
            <p className="text-gray-600">
              Populate the database with sample books and reviews for testing the discover page
            </p>
          </div>

          {/* Status Alert */}
          {allSuccess && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                🎉 All test data has been created successfully! You can now test the discover page.
              </AlertDescription>
            </Alert>
          )}
          
          {hasErrors && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Some steps failed. Please check the details below and try again.
              </AlertDescription>
            </Alert>
          )}

          {/* Controls */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Database Seeding</CardTitle>
              <CardDescription>
                Create sample data to test the discover page functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button 
                  onClick={seedDatabase}
                  disabled={isSeeding || isClearing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSeeding ? 'Seeding...' : 'Seed Test Data'}
                </Button>
                
                <Button 
                  onClick={clearTestData}
                  disabled={isSeeding || isClearing}
                  variant="outline"
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isClearing ? 'Clearing...' : 'Clear Test Data'}
                </Button>
              </div>

              {progress > 0 && (
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
                <CardTitle>Seeding Results</CardTitle>
                <CardDescription>
                  Step-by-step progress of the database seeding process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{step.name}</h4>
                        <Badge className={
                          step.status === 'success' ? 'bg-green-100 text-green-800' :
                          step.status === 'error' ? 'bg-red-100 text-red-800' :
                          step.status === 'running' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {step.status === 'running' && (
                            <div className="h-3 w-3 border border-blue-600 border-t-transparent rounded-full animate-spin mr-1" />
                          )}
                          {step.status === 'success' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {step.status === 'error' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {step.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {step.message}
                        {step.count && ` (${step.count} items)`}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="mt-8 border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-lg">Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-amber-800">
                  After seeding the data successfully:
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-amber-800">
                  <li>Go to the <a href="/discover" className="underline font-medium">/discover</a> page</li>
                  <li>Test the search functionality with book titles or authors</li>
                  <li>Try filtering by genre, language, and minimum score</li>
                  <li>Test different sorting options</li>
                  <li>Click on books to view their detailed reviews</li>
                </ol>
                <p className="text-amber-700 text-sm mt-4">
                  <strong>Note:</strong> You need to be logged in with an author or admin role to seed data.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}