import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import type { BookReview } from "@/lib/mock-data"

interface BookReviewCardProps {
  review: BookReview
}

export default function BookReviewCard({ review }: BookReviewCardProps) {
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
    <Card className="group hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
          <Image
            src={review.coverImage || "/placeholder.svg"}
            alt={`Cover of ${review.title}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-[#2A4759] text-white font-semibold">AI Score: {review.aiQualityScore}</Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-[#2A4759]">
              {review.language.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="mb-2">
            <Badge variant="outline" className="text-xs">
              {review.genre}
            </Badge>
          </div>

          <h3 className="font-bold text-lg text-[#2A4759] mb-2 line-clamp-2 group-hover:text-[#F79B72] transition-colors">
            <Link href={`/reviews/${review.id}`}>{review.title}</Link>
          </h3>

          <p className="text-sm text-gray-600 mb-2">
            by{" "}
            <Link href={`/authors/${review.authorId}`} className="text-[#2A4759] hover:text-[#F79B72] font-medium">
              {review.author}
            </Link>
          </p>

          <p className="text-sm text-gray-700 line-clamp-3 mb-3">{review.blurb}</p>
        </div>

        <div className="space-y-3">
          {/* Reader Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {renderStars(review.averageReaderRating)}
              <span className="text-sm text-gray-600 ml-1">({review.readerReviewCount})</span>
            </div>
            <span className="text-sm font-medium text-[#2A4759]">{review.averageReaderRating.toFixed(1)}</span>
          </div>

          {/* Keywords */}
          <div className="flex flex-wrap gap-1">
            {review.keywords.slice(0, 3).map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {review.keywords.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{review.keywords.length - 3}
              </Badge>
            )}
          </div>

          {/* Review Date */}
          <div className="text-xs text-gray-500">Reviewed {new Date(review.reviewDate).toLocaleDateString()}</div>
        </div>
      </CardContent>
    </Card>
  )
}
