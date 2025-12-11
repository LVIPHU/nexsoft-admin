import { NextRequest, NextResponse } from 'next/server';
import { logoutRequestSchema } from '@nexsoft-admin/models';
import { revokeAllSessions, revokeAppSession, getAllAppSessions } from '@/libs/redis';
import { z } from 'zod';

/**
 * POST /api/auth/logout
 * Logout endpoint supporting both local and global logout
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = logoutRequestSchema.parse(body);

    // Get userId from session/cookie or from refresh_token
    // In a real implementation, you'd decode the refresh_token or get from session
    const userId = request.cookies.get('user_id')?.value;

    if (!userId && !validated.refresh_token) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // For now, we'll use a mock userId if not available
    // In production, decode refresh_token to get userId
    const targetUserId = userId || 'mock_user_id';

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

      return NextResponse.json({
        success: true,
        message: 'Logged out from all applications',
      });
    } else {
      // Local logout: Revoke only this app's session
      // Get app_id from request header or query
      const appId = request.headers.get('x-app-id') || request.nextUrl.searchParams.get('app_id');

      if (!appId) {
        return NextResponse.json({ error: 'App ID required for local logout' }, { status: 400 });
      }

      await revokeAppSession(appId, targetUserId);

      return NextResponse.json({
        success: true,
        message: 'Logged out from this application',
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.message }, { status: 400 });
    }

    console.error('Error during logout:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
