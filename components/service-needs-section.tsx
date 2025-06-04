import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Users, Lightbulb } from "lucide-react"

interface ServiceNeed {
  category: string
  suggestion: string
}

interface ServiceNeedsSectionProps {
  serviceNeeds: ServiceNeed[]
}

export default function ServiceNeedsSection({ serviceNeeds }: ServiceNeedsSectionProps) {
  const serviceCategories = [
    {
      name: "Copy Editing",
      description: "Grammar, spelling, and language refinement",
      providers: 12,
    },
    {
      name: "Developmental Editing",
      description: "Plot, structure, and character development",
      providers: 8,
    },
    {
      name: "Cover Design",
      description: "Professional book cover creation",
      providers: 15,
    },
    {
      name: "Proofreading",
      description: "Final review for errors and consistency",
      providers: 18,
    },
  ]

  return (
    <div className="space-y-6">
      {/* AI Suggestions */}
      {serviceNeeds.length > 0 && (
        <Card className="border-l-4 border-l-[#F79B72]">
          <CardHeader>
            <CardTitle className="flex items-center text-[#2A4759]">
              <Lightbulb className="h-5 w-5 mr-2" />
              AI-Suggested Services for Your Book
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceNeeds.map((service, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-[#F2F2F2] rounded-lg">
                  <div className="h-2 w-2 rounded-full bg-[#F79B72] mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="font-medium text-[#2A4759] mb-1">{service.category}</div>
                    <div className="text-sm text-gray-600">{service.suggestion}</div>
                  </div>
                  <Button size="sm" variant="outline">
                    Find Providers
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-[#2A4759]">
            <Users className="h-5 w-5 mr-2" />
            Available Service Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceCategories.map((category, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-[#2A4759]">{category.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {category.providers} providers
                  </Badge>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Browse Providers
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* General Information */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="font-semibold text-[#2A4759] mb-2">Need Help Choosing Services?</h3>
            <p className="text-gray-600 mb-4">
              Our AI analysis has identified specific areas where professional services could enhance your book. Connect
              with verified service providers who specialize in your book's needs.
            </p>
            <Button className="bg-[#F79B72] hover:bg-[#e68a61]">Browse All Service Providers</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
