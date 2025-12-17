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
import { addCorsHeaders, createCorsPreflightResponse } from './libs/cors';

/**
 * Handle CORS for API routes
 * Allows cross-origin requests from client apps (social, energy)
 */
function handleCORS(request: NextRequest) {
  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    const response = createCorsPreflightResponse(request);
    return response || new NextResponse(null, { status: 204 });
  }

  // For actual requests, add CORS headers to response
  const response = NextResponse.next();
  return addCorsHeaders(request, response);
}

/**
 * Handle i18n locale redirect for page routes
 */
function handleLocaleRedirect(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = localeIds.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

  if (pathnameHasLocale) return;

  const locale = getRequestLocale(request.headers);
  request.nextUrl.pathname = `/${locale}${pathname}`;
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
