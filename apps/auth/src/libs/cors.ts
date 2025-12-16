import { NextRequest, NextResponse } from 'next/server';

/**
 * Allowed origins for CORS
 */
const ALLOWED_ORIGINS = [process.env.NEXT_PUBLIC_SOCIAL_CLIENT_URL, process.env.NEXT_PUBLIC_ENERGY_CLIENT_URL];

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
 * Add CORS headers to response
 */
export function addCorsHeaders(request: NextRequest, response: NextResponse): NextResponse {
  const origin = request.headers.get('origin');

  if (isAllowedOrigin(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin!);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-app-id');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

/**
 * Create CORS response for preflight OPTIONS request
 */
export function createCorsPreflightResponse(request: NextRequest): NextResponse | null {
  const origin = request.headers.get('origin');

  if (!isAllowedOrigin(origin)) {
    return null;
  }

  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', origin!);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-app-id');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  return response;
}
