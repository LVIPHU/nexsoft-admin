/*
 * Combined middleware for:
 * 1. CORS handling for API routes
 * 2. i18n locale redirect for page routes
 *
 * For more info see
 * https://nextjs.org/docs/app/building-your-application/routing/internationalization
 */
import { type NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { localeIds, defaultLanguage } from '@nexsoft-admin/utils';

/**
 * Allowed origins for CORS
 */
const ALLOWED_ORIGINS = [
  'http://localhost:3001', // social app
  'http://localhost:3002', // energy app
  // Add production origins here when deploying
  // 'https://social.example.com',
  // 'https://energy.example.com',
];

/**
 * Check if origin is allowed
 */
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) {
    return false;
  }
  return ALLOWED_ORIGINS.includes(origin) || origin.startsWith('http://localhost:');
}

/**
 * Handle CORS for API routes
 * Allows cross-origin requests from client apps (social, energy)
 */
function handleCORS(request: NextRequest) {
  // Get origin from request
  const origin = request.headers.get('origin');

  // Check if origin is allowed
  const allowed = isAllowedOrigin(origin);

  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });

    if (allowed) {
      response.headers.set('Access-Control-Allow-Origin', origin!);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-app-id');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
    }

    return response;
  }

  // For actual requests, add CORS headers to response
  const response = NextResponse.next();

  if (allowed) {
    response.headers.set('Access-Control-Allow-Origin', origin!);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-app-id');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

/**
 * Handle i18n locale redirect for page routes
 */
function handleLocaleRedirect(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = localeIds.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect if there is no locale
  const locale = getRequestLocale(request.headers);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en/products
  return NextResponse.redirect(request.nextUrl);
}

function getRequestLocale(requestHeaders: Headers): string {
  const langHeader = requestHeaders.get('accept-language') || undefined;
  const languages = new Negotiator({
    headers: { 'accept-language': langHeader },
  }).languages(localeIds.slice());

  return languages[0] || localeIds[0] || defaultLanguage;
}

/**
 * Main middleware function
 * Combined middleware for CORS and i18n
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle CORS for API routes
  if (pathname.startsWith('/api/')) {
    return handleCORS(request);
  }

  // Handle i18n locale redirect for page routes
  return handleLocaleRedirect(request);
}

/**
 * Export config for Next.js middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - api routes are handled separately for CORS
     */
    '/((?!_next/static|_next/image|favicon.ico|api/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/api/:path*',
  ],
};
