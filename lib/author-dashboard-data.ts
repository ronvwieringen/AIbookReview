export interface DashboardStats {
  totalReviews: number
  publicReviews: number
  averageScore: number
  totalViews: number
  readerReviews: number
  averageRating: number
}

export interface Review {
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

export interface Activity {
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

export interface LatestFeedback {
  readerName: string
  rating: number
  comment: string
  bookTitle: string
  timestamp: string
}

export interface RecommendedService {
  category: string
  reason: string
  providers: number
}

export interface PerformanceData {
  date: string
  views: number
  readerReviews: number
  aiScore: number
}

export interface AuthorDashboardData {
  stats: DashboardStats
  reviews: Review[]
  recentActivity: Activity[]
  latestFeedback: LatestFeedback[]
  recommendedServices: RecommendedService[]
  performanceData: PerformanceData[]
}

export function getAuthorDashboardData(): AuthorDashboardData {
  return {
    stats: {
      totalReviews: 5,
      publicReviews: 3,
      averageScore: 87,
      totalViews: 2847,
      readerReviews: 23,
      averageRating: 4.3,
    },
    reviews: [
      {
        id: "1",
        title: "The Digital Nomad's Guide to Freedom",
        status: "public",
        aiScore: 92,
        readerRating: 4.7,
        readerCount: 23,
        views: 1247,
        lastUpdated: "2 days ago",
        coverImage: "/images/covers/digital-nomad-guide.png",
        hasNewFeedback: true,
      },
      {
        id: "2",
        title: "Remote Work Mastery",
        status: "public",
        aiScore: 88,
        readerRating: 4.2,
        readerCount: 15,
        views: 892,
        lastUpdated: "1 week ago",
        coverImage: "/images/covers/startup-secrets.png",
        hasNewFeedback: false,
      },
      {
        id: "3",
        title: "Building Your Online Empire",
        status: "private",
        aiScore: 85,
        readerRating: 0,
        readerCount: 0,
        views: 0,
        lastUpdated: "3 days ago",
        coverImage: "/images/covers/mindful-manager.png",
        hasNewFeedback: false,
      },
      {
        id: "4",
        title: "The Entrepreneur's Mindset",
        status: "draft",
        aiScore: 79,
        readerRating: 0,
        readerCount: 0,
        views: 0,
        lastUpdated: "1 day ago",
        coverImage: "/images/covers/startup-secrets.png",
        hasNewFeedback: false,
      },
      {
        id: "5",
        title: "Passive Income Strategies",
        status: "public",
        aiScore: 91,
        readerRating: 4.5,
        readerCount: 31,
        views: 708,
        lastUpdated: "5 days ago",
        coverImage: "/images/covers/mindful-cooking.png",
        hasNewFeedback: true,
      },
    ],
    recentActivity: [
      {
        id: "1",
        type: "reader_review",
        title: "New 5-star review received",
        description: "Mike Johnson left a detailed review for your book",
        timestamp: "2024-01-20T10:30:00Z",
        metadata: {
          bookTitle: "The Digital Nomad's Guide to Freedom",
          rating: 5,
        },
      },
      {
        id: "2",
        type: "view_milestone",
        title: "1,000 views milestone reached",
        description: "Your book has reached 1,000 total views",
        timestamp: "2024-01-19T15:45:00Z",
        metadata: {
          bookTitle: "The Digital Nomad's Guide to Freedom",
          viewCount: 1000,
        },
      },
      {
        id: "3",
        type: "review_completed",
        title: "AI review completed",
        description: "Your manuscript analysis is ready for review",
        timestamp: "2024-01-18T09:15:00Z",
        metadata: {
          bookTitle: "The Entrepreneur's Mindset",
        },
      },
      {
        id: "4",
        type: "service_recommendation",
        title: "New service recommendation",
        description: "AI suggests professional editing for improved quality",
        timestamp: "2024-01-17T14:20:00Z",
        metadata: {
          serviceName: "Professional Editing",
        },
      },
      {
        id: "5",
        type: "review_published",
        title: "Review published",
        description: "Your book review is now visible to readers",
        timestamp: "2024-01-16T11:00:00Z",
        metadata: {
          bookTitle: "Building Your Online Empire",
        },
      },
    ],
    latestFeedback: [
      {
        readerName: "Mike Johnson",
        rating: 5,
        comment:
          "Absolutely fantastic guide! The practical advice is invaluable and easy to implement. Changed my entire approach to remote work.",
        bookTitle: "The Digital Nomad's Guide to Freedom",
        timestamp: "2024-01-20T10:30:00Z",
      },
      {
        readerName: "Lisa Chen",
        rating: 4,
        comment: "Great insights on passive income. Would have liked more specific examples, but overall very helpful.",
        bookTitle: "Passive Income Strategies",
        timestamp: "2024-01-19T16:45:00Z",
      },
      {
        readerName: "David Rodriguez",
        rating: 5,
        comment:
          "This book completely transformed my understanding of remote work. Highly recommended for anyone considering this lifestyle.",
        bookTitle: "Remote Work Mastery",
        timestamp: "2024-01-18T13:20:00Z",
      },
    ],
    recommendedServices: [
      {
        category: "Copy Editing",
        reason: "Based on AI analysis of your latest manuscript",
        providers: 12,
      },
      {
        category: "Cover Design",
        reason: "Improve visual appeal and marketability",
        providers: 8,
      },
      {
        category: "Marketing Consultation",
        reason: "Boost visibility and reader engagement",
        providers: 6,
      },
    ],
    performanceData: [
      { date: "2024-01-01", views: 45, readerReviews: 2, aiScore: 85 },
      { date: "2024-01-02", views: 52, readerReviews: 3, aiScore: 86 },
      { date: "2024-01-03", views: 38, readerReviews: 1, aiScore: 87 },
      { date: "2024-01-04", views: 67, readerReviews: 4, aiScore: 88 },
      { date: "2024-01-05", views: 73, readerReviews: 2, aiScore: 87 },
      { date: "2024-01-06", views: 89, readerReviews: 5, aiScore: 89 },
      { date: "2024-01-07", views: 94, readerReviews: 3, aiScore: 90 },
      { date: "2024-01-08", views: 112, readerReviews: 6, aiScore: 88 },
      { date: "2024-01-09", views: 98, readerReviews: 4, aiScore: 91 },
      { date: "2024-01-10", views: 156, readerReviews: 7, aiScore: 92 },
      { date: "2024-01-11", views: 134, readerReviews: 5, aiScore: 90 },
      { date: "2024-01-12", views: 178, readerReviews: 8, aiScore: 93 },
      { date: "2024-01-13", views: 145, readerReviews: 6, aiScore: 91 },
      { date: "2024-01-14", views: 203, readerReviews: 9, aiScore: 94 },
      { date: "2024-01-15", views: 189, readerReviews: 7, aiScore: 92 },
      { date: "2024-01-16", views: 234, readerReviews: 11, aiScore: 95 },
      { date: "2024-01-17", views: 267, readerReviews: 8, aiScore: 93 },
      { date: "2024-01-18", views: 298, readerReviews: 12, aiScore: 96 },
      { date: "2024-01-19", views: 312, readerReviews: 10, aiScore: 94 },
      { date: "2024-01-20", views: 345, readerReviews: 14, aiScore: 97 },
    ],
  }
}
