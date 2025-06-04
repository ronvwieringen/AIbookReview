import { Badge } from "@/components/ui/badge"
import { BookOpen, Eye, MessageSquare, Star, Upload, Users, CheckCircle, TrendingUp } from "lucide-react"

interface Activity {
  id: string
  type:
    | "review_completed"
    | "review_published"
    | "reader_review"
    | "view_milestone"
    | "upload"
    | "service_recommendation"
  title: string
  description: string
  timestamp: string
  metadata?: {
    bookTitle?: string
    rating?: number
    viewCount?: number
    serviceName?: string
  }
}

interface RecentActivityProps {
  activities: Activity[]
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "review_completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "review_published":
        return <Eye className="h-4 w-4 text-[#F79B72]" />
      case "reader_review":
        return <MessageSquare className="h-4 w-4 text-blue-600" />
      case "view_milestone":
        return <TrendingUp className="h-4 w-4 text-purple-600" />
      case "upload":
        return <Upload className="h-4 w-4 text-[#2A4759]" />
      case "service_recommendation":
        return <Users className="h-4 w-4 text-[#90D1CA]" />
      default:
        return <BookOpen className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityBadge = (type: string) => {
    switch (type) {
      case "review_completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "review_published":
        return <Badge className="bg-orange-100 text-orange-800">Published</Badge>
      case "reader_review":
        return <Badge className="bg-blue-100 text-blue-800">New Review</Badge>
      case "view_milestone":
        return <Badge className="bg-purple-100 text-purple-800">Milestone</Badge>
      case "upload":
        return <Badge variant="outline">Upload</Badge>
      case "service_recommendation":
        return <Badge className="bg-teal-100 text-teal-800">Recommendation</Badge>
      default:
        return <Badge variant="secondary">Activity</Badge>
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
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
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-[#2A4759] text-sm">{activity.title}</h4>
                  {getActivityBadge(activity.type)}
                </div>

                <p className="text-sm text-gray-600 mb-2">{activity.description}</p>

                {/* Activity-specific metadata */}
                {activity.metadata && (
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {activity.metadata.bookTitle && (
                      <span className="font-medium">"{activity.metadata.bookTitle}"</span>
                    )}
                    {activity.metadata.rating && (
                      <div className="flex items-center gap-1">
                        {renderStars(activity.metadata.rating)}
                        <span>({activity.metadata.rating}/5)</span>
                      </div>
                    )}
                    {activity.metadata.viewCount && <span>{activity.metadata.viewCount.toLocaleString()} views</span>}
                    {activity.metadata.serviceName && (
                      <span className="text-[#F79B72]">{activity.metadata.serviceName}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 ml-4 flex-shrink-0">{formatTimestamp(activity.timestamp)}</div>
            </div>
          </div>
        </div>
      ))}

      {activities.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-sm">No recent activity</div>
        </div>
      )}
    </div>
  )
}
