import { NextRequest, NextResponse } from 'next/server';

const USER_ID_COOKIE_NAME = 'user_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Set user_id cookie with secure flags
 */
export function setUserIdCookie(response: NextResponse, userId: string): void {
  const isProduction = process.env.NODE_ENV === 'production';

  response.cookies.set(USER_ID_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: isProduction, // Only send over HTTPS in production
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

/**
 * Get userId from cookie
 */
export function getUserIdCookie(request: NextRequest): string | null {
  return request.cookies.get(USER_ID_COOKIE_NAME)?.value || null;
}
