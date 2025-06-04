import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#2A4759] mb-2">Book Review Not Found</h1>
        <p className="text-gray-600 mb-6">The book review you're looking for doesn't exist or has been removed.</p>
        <Link href="/reviews">
          <Button className="bg-[#F79B72] hover:bg-[#e68a61] text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse Books
          </Button>
        </Link>
      </div>
    </div>
  )
}
