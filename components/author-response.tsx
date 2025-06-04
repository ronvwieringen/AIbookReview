import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle } from "lucide-react"

interface AuthorResponseProps {
  authorName: string
  response: string
}

export default function AuthorResponse({ authorName, response }: AuthorResponseProps) {
  return (
    <Card className="border-l-4 border-l-[#F79B72]">
      <CardHeader>
        <CardTitle className="flex items-center text-[#2A4759]">
          <MessageCircle className="h-5 w-5 mr-2" />
          Author's Response
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-[#2A4759] text-white">{authorName.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="font-medium text-[#2A4759] mb-2">{authorName}</div>
            <div className="text-gray-700 leading-relaxed">{response}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
