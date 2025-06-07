import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Middleware logic can be added here if needed
    // The withAuth wrapper handles the authentication context properly
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow access to admin routes only for admin users
        if (pathname.startsWith('/admin')) {
          return token?.role === 'admin'
        }
        
        // Allow access to author routes for authenticated users
        if (pathname.startsWith('/author/')) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/author/dashboard',
    '/author/profile',
    '/author/reviews/:path*',
  ],
}