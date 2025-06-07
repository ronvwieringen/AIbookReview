import { RegisterForm } from "@/components/auth/register-form";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b bg-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <BookOpen className="h-8 w-8 text-[#2A4759]" />
            <span className="ml-2 text-2xl font-bold text-[#2A4759]">AIbookReview</span>
          </Link>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <RegisterForm />
      </main>
      
      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} AIbookReview. All rights reserved.</p>
      </footer>
    </div>
  );
}