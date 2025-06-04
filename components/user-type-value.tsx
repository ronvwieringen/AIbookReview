import type { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"

interface UserTypeValueProps {
  userType: string
  icon: ReactNode
  benefits: string[]
  bgColor: string
  ctaText: string
  ctaLink: string
}

export default function UserTypeValue({ userType, icon, benefits, bgColor, ctaText, ctaLink }: UserTypeValueProps) {
  return (
    <div className={`${bgColor} rounded-lg shadow-md overflow-hidden`}>
      <div className="p-6 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/20 mb-4">{icon}</div>
        <h3 className="text-2xl font-bold text-white mb-4">{userType}</h3>
      </div>
      <div className="bg-white p-6">
        <ul className="space-y-3 mb-6">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-[#F79B72] mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{benefit}</span>
            </li>
          ))}
        </ul>
        <Link href={ctaLink}>
          <Button className="w-full bg-gray-700 hover:bg-gray-800 text-white">
            {ctaText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
