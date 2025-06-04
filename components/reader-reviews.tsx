import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, MessageSquare } from "lucide-react"
import { getReaderReviews } from "@/lib/mock-data"

interface ReaderReviewsProps {
  bookId: string
  averageRating: number
  totalReviews: number
}

export default function ReaderReviews({ bookId, averageRating, totalReviews }: ReaderReviewsProps) {
  const readerReviews = getReaderReviews(bookId)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-[#F79B72] fill-[#F79B72]"
            : i < rating
              ? "text-[#F79B72] fill-[#F79B72] opacity-50"
              : "text-gray-300"
        }`}
      />
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-[#2A4759]">
          <MessageSquare className="h-5 w-5 mr-2" />
          Reader Reviews ({totalReviews})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {readerReviews.map((review, index) => (
          <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-[#90D1CA] text-white">{review.reviewerName.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-[#2A4759]">{review.reviewerName}</div>
                  <div className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</div>
                </div>

                <div className="flex items-center mb-2">
                  {renderStars(review.rating)}
                  <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>

                {review.verifiedPurchase && (
                  <div className="mt-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified Purchase</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {readerReviews.length === 0 && (
          <div className="text-center text-gray-500 py-8">No reader reviews yet. Be the first to review this book!</div>
        )}

        <Button
          variant="outline"
          className="w-full border-[#2A4759] text-[#2A4759] hover:bg-[#2A4759] hover:text-white"
        >
          Write a Review
        </Button>
      </CardContent>
    </Card>
  )
}
