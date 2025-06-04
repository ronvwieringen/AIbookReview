import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Users, BarChart3, MessageSquare, Settings, Plus, Eye } from "lucide-react"

export default function QuickActions() {
  const actions = [
    {
      title: "Upload Manuscript",
      description: "Get AI review for new book",
      icon: Upload,
      href: "/author/upload",
      color: "bg-[#F79B72] hover:bg-[#e68a61]",
      textColor: "text-white",
    },
    {
      title: "View Public Profile",
      description: "See your author profile",
      icon: Eye,
      href: "/authors/sarah-chen",
      color: "bg-[#2A4759] hover:bg-[#1e3544]",
      textColor: "text-white",
    },
    {
      title: "Browse Services",
      description: "Find professional help",
      icon: Users,
      href: "/author/services",
      color: "bg-[#90D1CA] hover:bg-[#7bc4bc]",
      textColor: "text-white",
    },
    {
      title: "Analytics",
      description: "Detailed performance data",
      icon: BarChart3,
      href: "/author/analytics",
      color: "bg-white hover:bg-gray-50",
      textColor: "text-[#2A4759]",
      border: "border border-gray-200",
    },
    {
      title: "Reader Feedback",
      description: "View all reader reviews",
      icon: MessageSquare,
      href: "/author/feedback",
      color: "bg-white hover:bg-gray-50",
      textColor: "text-[#2A4759]",
      border: "border border-gray-200",
    },
    {
      title: "Account Settings",
      description: "Manage your account",
      icon: Settings,
      href: "/author/settings",
      color: "bg-white hover:bg-gray-50",
      textColor: "text-[#2A4759]",
      border: "border border-gray-200",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-[#2A4759]">
          <Plus className="h-5 w-5 mr-2" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => {
          const IconComponent = action.icon
          return (
            <Button
              key={index}
              variant="ghost"
              className={`w-full justify-start h-auto p-3 ${action.color} ${action.textColor} ${action.border || ""}`}
              asChild
            >
              <Link href={action.href}>
                <div className="flex items-center gap-3">
                  <IconComponent className="h-4 w-4 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs opacity-80">{action.description}</div>
                  </div>
                </div>
              </Link>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
