/**
 * REQUIREMENTS REFERENCES:
 *
 * [REQ-FUNC-006] Author Process Transparency
 * - Display author's process checklist
 * - Professional services used disclosure
 * - AI tools usage transparency
 * - Process verification and validation
 *
 * [REQ-CONTENT-006] Transparency and Trust Building
 * - Clear disclosure of author's creation process
 * - Professional service engagement tracking
 * - AI tool usage transparency
 * - Building reader confidence through transparency
 *
 * [REQ-FUNC-007] Service Provider Integration
 * - Track professional services used
 * - Display service provider engagement
 * - Connect transparency with service recommendations
 *
 * [REQ-UI-004] Individual Book Review Page
 * - Process transparency as part of book review display
 * - Integration with overall review presentation
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, User, Cpu } from "lucide-react"
import { getAuthorProcessChecklist } from "@/lib/mock-data"

interface AuthorProcessChecklistProps {
  bookId: string
}

export default function AuthorProcessChecklist({ bookId }: AuthorProcessChecklistProps) {
  const checklist = getAuthorProcessChecklist(bookId)

  const renderChecklistItem = (item: { name: string; completed: boolean; details?: string }) => (
    <div key={item.name} className="flex items-start gap-3 py-2">
      {item.completed ? (
        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
      )}
      <div className="flex-1">
        <div className={`font-medium ${item.completed ? "text-gray-900" : "text-gray-500"}`}>{item.name}</div>
        {item.details && <div className="text-sm text-gray-600 mt-1">{item.details}</div>}
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-[#2A4759]">
          <User className="h-5 w-5 mr-2" />
          Author's Process Transparency
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-[#2A4759] mb-3 flex items-center">
            <User className="h-4 w-4 mr-2" />
            Professional Services Engaged
          </h4>
          <div className="space-y-1">{checklist.professionalServices.map(renderChecklistItem)}</div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold text-[#2A4759] mb-3 flex items-center">
            <Cpu className="h-4 w-4 mr-2" />
            AI Tools Usage
          </h4>
          <div className="space-y-1">{checklist.aiToolsUsage.map(renderChecklistItem)}</div>
        </div>

        <div className="border-t pt-4">
          <div className="text-xs text-gray-500">
            This checklist is self-reported by the author to provide transparency about the book creation process.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
