import { Star } from "lucide-react"

interface TestimonialProps {
  quote: string
  author: string
  rating: number
}

export default function Testimonial({ quote, author, rating }: TestimonialProps) {
  return (
    <div className="bg-[#F2F2F2] p-6 rounded-lg">
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-5 w-5 ${i < rating ? "text-[#F79B72] fill-[#F79B72]" : "text-gray-300"}`} />
        ))}
      </div>
      <p className="text-gray-700 italic mb-4">"{quote}"</p>
      <p className="text-[#2A4759] font-semibold">{author}</p>
    </div>
  )
}
