import Link from "next/link"
import { BookOpen, Mail, Twitter, Facebook, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#2A4759] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <BookOpen className="h-8 w-8" />
              <span className="ml-2 text-2xl font-bold">AIbookReview</span>
            </div>
            <p className="text-gray-300 mb-4">
              Elevating self-publishing with AI-powered quality assessment, community support, and enhanced
              discoverability.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white hover:text-[#F79B72]">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white hover:text-[#F79B72]">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white hover:text-[#F79B72]">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white hover:text-[#F79B72]">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#F79B72]">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#F79B72]">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#F79B72]">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#F79B72]">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#F79B72]">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#F79B72]">
                  Author Resources
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#F79B72]">
                  Service Provider Directory
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#F79B72]">
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <a href="mailto:info@aibookreview.com" className="text-gray-300 hover:text-[#F79B72]">
                  info@aibookreview.com
                </a>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#F79B72]">
                  Support
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#F79B72]">
                  Partnerships
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} AIbookReview.com. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="#" className="text-gray-300 hover:text-[#F79B72] text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-300 hover:text-[#F79B72] text-sm">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-300 hover:text-[#F79B72] text-sm">
              Cookie Policy
            </Link>
            <Link href="/admin" className="text-gray-300 hover:text-[#F79B72] text-sm">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
