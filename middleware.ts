import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  try {
    // Ensure NEXTAUTH_SECRET is set
    if (!process.env.NEXTAUTH_SECRET) {
      console.error('NEXTAUTH_SECRET environment variable is not set');
      return NextResponse.next();
    }

    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET
    });
    
    const isAuthenticated = !!token;
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
    const isAuthorDashboardRoute = request.nextUrl.pathname === '/author/dashboard' || 
                                   request.nextUrl.pathname === '/author/profile' ||
                                   request.nextUrl.pathname.startsWith('/author/reviews');
    const isApiRoute = request.nextUrl.pathname.startsWith('/api');

    // Allow seed endpoint in development
    if (request.nextUrl.pathname === '/api/seed' && process.env.NODE_ENV === 'development') {
      return NextResponse.next();
    }

    // Protect admin routes
    if (isAdminRoute) {
      if (!isAuthenticated || token?.role !== 'PlatformAdmin') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    // Protect only specific author routes (dashboard, profile, reviews management)
    if (isAuthorDashboardRoute) {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      
      if (token?.role !== 'Author' && token?.role !== 'PlatformAdmin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // Protect API routes that are not auth-related
    if (isApiRoute && !request.nextUrl.pathname.startsWith('/api/auth')) {
      // Allow public API routes
      if (
        (request.nextUrl.pathname.startsWith('/api/books') && request.method === 'GET') ||
        (request.nextUrl.pathname.startsWith('/api/genres') && request.method === 'GET') ||
        (request.nextUrl.pathname.startsWith('/api/languages') && request.method === 'GET')
      ) {
        return NextResponse.next();
      }

      // Require authentication for other API routes
      if (!isAuthenticated) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // If there's an error getting the token, allow the request to proceed
    // This prevents the middleware from blocking all requests due to auth issues
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/author/dashboard',
    '/author/profile',
    '/author/reviews/:path*',
    '/api/:path*',
  ],
};