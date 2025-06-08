// Simple middleware for development - no authentication checks
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // For development, we'll handle auth checks in the components themselves
  // This middleware is essentially a pass-through
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Don't run middleware on static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};