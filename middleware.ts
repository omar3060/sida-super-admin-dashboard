import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to authentication routes and public assets
  const publicRoutes = [
    '/signin',
    '/signin-2', 
    '/signin-3',
    '/register',
    '/register-2',
    '/register-3',
    '/forgot-password',
    '/forgot-password-2',
    '/forgot-password-3',
    '/reset-password',
    '/reset-password-2',
    '/reset-password-3',
    '/email-verification',
    '/email-verification-2',
    '/email-verification-3',
    '/two-step-verification',
    '/two-step-verification-2',
    '/two-step-verification-3',
    '/lock-screen',
    '/error-404',
    '/error-500',
    '/coming-soon',
    '/under-maintenance',
    '/blank-page',
    '/_next',
    '/api',
    '/assets',
    '/favicon.ico',
    '/manifest.json'
  ];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route) || 
    pathname === '/' || 
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/assets')
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, check if user is authenticated
  // Since middleware runs on the server, we'll redirect to signin
  // The client-side will handle the actual authentication check
  return NextResponse.redirect(new URL('/signin-3', request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
