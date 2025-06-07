import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isAuthorRoute = request.nextUrl.pathname.startsWith('/author');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');

  // Protect admin routes
  if (isAdminRoute) {
    if (!isAuthenticated || token?.role !== 'PlatformAdmin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect author routes
  if (isAuthorRoute) {
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
      request.nextUrl.pathname.startsWith('/api/books') && 
      request.method === 'GET'
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
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/author/:path*',
    '/api/:path*',
  ],
};