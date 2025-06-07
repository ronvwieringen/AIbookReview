import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "@/components/ui/toast"

export const metadata: Metadata = {
  title: 'AIbookReview - AI-Powered Book Reviews',
  description: 'Discover quality self-published books with AI-powered reviews and transparent quality assessment.',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}