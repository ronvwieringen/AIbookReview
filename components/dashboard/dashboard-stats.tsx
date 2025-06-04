import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Eye, Star, TrendingUp, Users, BarChart3 } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    totalReviews: number
    publicReviews: number
    averageScore: number
    totalViews: number
    readerReviews: number
    averageRating: number
  }
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: "Total Reviews",
      value: stats.totalReviews,
      icon: BookOpen,
      color: "text-[#2A4759]",
      bgColor: "bg-blue-50",
      change: "+2 this month",
      changeType: "positive" as const,
    },
    {
      title: "Public Reviews",
      value: stats.publicReviews,
      icon: Eye,
      color: "text-[#F79B72]",
      bgColor: "bg-orange-50",
      change: "+1 this month",
      changeType: "positive" as const,
    },
    {
      title: "Avg AI Score",
      value: stats.averageScore,
      icon: BarChart3,
      color: "text-[#90D1CA]",
      bgColor: "bg-teal-50",
      change: "+3 points",
      changeType: "positive" as const,
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+12% this week",
      changeType: "positive" as const,
    },
    {
      title: "Reader Reviews",
      value: stats.readerReviews,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+5 this week",
      changeType: "positive" as const,
    },
    {
      title: "Avg Rating",
      value: `${stats.averageRating}/5`,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      change: "+0.2 this month",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-[#2A4759] mt-1">{stat.value}</p>
                  <p className={`text-xs mt-1 ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <IconComponent className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
