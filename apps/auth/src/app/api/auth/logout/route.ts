import { NextRequest, NextResponse } from 'next/server';
import { logoutRequestSchema } from '@nexsoft-admin/models';
import { revokeAllSessions, revokeAppSession, getAllAppSessions } from '@/libs/redis';
import { getUserIdFromToken } from '@/libs/jwt';
import { addCorsHeaders, createCorsPreflightResponse } from '@/libs/cors';
import { z } from 'zod';

/**
 * OPTIONS /api/auth/logout
 * Handle CORS preflight request
 */
export async function OPTIONS(request: NextRequest) {
  const response = createCorsPreflightResponse(request);
  return response || new NextResponse(null, { status: 204 });
}

/**
 * POST /api/auth/logout
 * Logout endpoint supporting both local and global logout
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = logoutRequestSchema.parse(body);

    // Get userId from session/cookie or from refresh_token
    let userId = request.cookies.get('user_id')?.value;

    // If no userId from cookie, decode refresh_token to get userId
    if (!userId && validated.refresh_token) {
      try {
        // MOCK: getUserIdFromToken returns sub (username) as userId
        // TODO: In the future, this can be changed to lookup actual userId from database
        userId = getUserIdFromToken(validated.refresh_token);
      } catch (error) {
        console.error('Failed to decode refresh token:', error);
        const response = NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
        return addCorsHeaders(request, response);
      }
    }

    if (!userId) {
      const response = NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
      return addCorsHeaders(request, response);
    }

    const targetUserId = userId;

    if (validated.type === 'global') {
      // Global logout: Revoke all sessions
      await revokeAllSessions(targetUserId);

      // Get all app sessions to notify them (in a real implementation, you'd publish events)
      const appSessions = await getAllAppSessions(targetUserId);

      // TODO: Publish logout event to Redis pub/sub or message queue
      // This would notify all apps to logout the user
      console.log(
        'Global logout - affected apps:',
        appSessions.map((s) => s.appId),
      );

      const response = NextResponse.json({
        success: true,
        message: 'Logged out from all applications',
      });
      return addCorsHeaders(request, response);
    } else {
      // Local logout: Revoke only this app's session
      // Get app_id from request header or query
      const appId = request.headers.get('x-app-id') || request.nextUrl.searchParams.get('app_id');

      if (!appId) {
        const response = NextResponse.json({ error: 'App ID required for local logout' }, { status: 400 });
        return addCorsHeaders(request, response);
      }

      await revokeAppSession(appId, targetUserId);

      const response = NextResponse.json({
        success: true,
        message: 'Logged out from this application',
      });
      return addCorsHeaders(request, response);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response = NextResponse.json({ error: 'Invalid request', details: error.message }, { status: 400 });
      return addCorsHeaders(request, response);
    }

    console.error('Error during logout:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    return addCorsHeaders(request, response);
  }
}
