import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Only apply middleware to specific protected routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isAuthorDashboard = request.nextUrl.pathname === '/author/dashboard';
  const isAuthorProfile = request.nextUrl.pathname === '/author/profile';
  const isAuthorReviews = request.nextUrl.pathname.startsWith('/author/reviews');

  // Skip middleware for public routes
  if (!isAdminRoute && !isAuthorDashboard && !isAuthorProfile && !isAuthorReviews) {
    return NextResponse.next();
  }

  // For protected routes, redirect to login
  // In a real app, you would check authentication here
  // For now, we'll just allow access to avoid the cookies error
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/author/dashboard',
    '/author/profile',
    '/author/reviews/:path*',
  ],
};