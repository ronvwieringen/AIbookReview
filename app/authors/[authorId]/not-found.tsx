import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowLeft } from "lucide-react"

export default function AuthorNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <BookOpen className="h-24 w-24 text-[#F79B72] mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-[#2A4759] mb-4">Author Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Sorry, we couldn't find the author you're looking for. They may have moved or the link might be incorrect.
        </p>
        <div className="space-x-4">
          <Link href="/reviews">
            <Button variant="outline" className="border-[#2A4759] text-[#2A4759] hover:bg-[#2A4759] hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse Books
            </Button>
          </Link>
          <Link href="/">
            <Button className="bg-[#F79B72] hover:bg-[#e68a61] text-white">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
