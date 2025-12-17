import { NextRequest, NextResponse } from 'next/server';

/**
 * Allowed origins for CORS
 * Supports both environment variables and hardcoded production URLs
 */
const getAllowedOrigins = (): string[] => {
  const origins: string[] = [];

  // Add origins from environment variables (filter out undefined/null)
  const envOrigins = [
    process.env.NEXT_PUBLIC_SOCIAL_CLIENT_URL,
    process.env.NEXT_PUBLIC_ENERGY_CLIENT_URL,
    process.env.SOCIAL_CLIENT_URL,
    process.env.ENERGY_CLIENT_URL,
  ].filter((origin): origin is string => Boolean(origin));

  origins.push(...envOrigins);

  return origins;
};

/**
 * Check if origin is allowed
 */
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) {
    return false;
  }

  const allowedOrigins = getAllowedOrigins();

  // Allow localhost for development
  if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
    return true;
  }

  // Check against allowed origins
  return allowedOrigins.includes(origin);
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
