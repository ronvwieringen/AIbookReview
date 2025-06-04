import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, Edit, MoreHorizontal, Star, MessageSquare, BookOpen } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Review {
  id: string
  title: string
  status: "draft" | "public" | "private"
  aiScore: number
  readerRating: number
  readerCount: number
  views: number
  lastUpdated: string
  coverImage: string
  hasNewFeedback: boolean
}

interface ReviewsOverviewProps {
  reviews: Review[]
}

export default function ReviewsOverview({ reviews }: ReviewsOverviewProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "public":
        return <Badge className="bg-green-100 text-green-800">Public</Badge>
      case "private":
        return <Badge variant="secondary">Private</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? "text-[#F79B72] fill-[#F79B72]" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex gap-4">
              {/* Book Cover */}
              <div className="flex-shrink-0">
                <div className="relative w-16 h-20">
                  <Image
                    src={review.coverImage || "/placeholder.svg"}
                    alt={`Cover of ${review.title}`}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-[#2A4759] truncate">{review.title}</h3>
                      {getStatusBadge(review.status)}
                      {review.hasNewFeedback && (
                        <Badge variant="outline" className="text-[#F79B72] border-[#F79B72]">
                          New Feedback
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">AI Score</div>
                        <div className="font-semibold text-[#2A4759]">{review.aiScore}/100</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Reader Rating</div>
                        <div className="flex items-center gap-1">
                          {renderStars(review.readerRating)}
                          <span className="text-xs text-gray-600">({review.readerCount})</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Views</div>
                        <div className="font-semibold">{review.views.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Updated</div>
                        <div className="text-xs">{review.lastUpdated}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/author/reviews/${review.id}/results`}>
                        <Edit className="h-3 w-3 mr-1" />
                        Manage
                      </Link>
                    </Button>

                    {review.status === "public" && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/reviews/${review.id}`}>
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Link>
                      </Button>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          View Feedback
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {review.status === "public" ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Make Private
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Make Public
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete Review</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {reviews.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No reviews yet</h3>
          <p className="text-gray-500 mb-4">Upload your first manuscript to get started with AI reviews.</p>
          <Link href="/author/upload">
            <Button className="bg-[#F79B72] hover:bg-[#e68a61] text-white">Upload Manuscript</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
