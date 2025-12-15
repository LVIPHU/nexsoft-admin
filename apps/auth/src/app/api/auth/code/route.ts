import { NextRequest, NextResponse } from 'next/server';
import { generateAuthCode } from '@nexsoft-admin/sso/core';
import { storeAuthCode } from '@/libs/redis';
import { authCodeRequestSchema } from '@nexsoft-admin/models';
import { z } from 'zod';

/**
 * POST /api/auth/code
 * Create auth_code after successful login
 * This endpoint should be called after user successfully logs in
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = authCodeRequestSchema.parse(body);

    // Generate secure auth code
    const code = generateAuthCode();

    // Get userId from session/cookie (assume it's set after login)
    // In a real implementation, you'd get this from the authenticated session
    const userId = request.cookies.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Calculate expiry time (5 minutes from now)
    const expiresAt = Date.now() + 5 * 60 * 1000;

    // Store auth code in Redis
    await storeAuthCode(code, {
      userId,
      redirectUri: validated.redirect_uri,
      expiresAt,
      appId: validated.app_id,
    });

    return NextResponse.json({
      code,
      redirect_uri: validated.redirect_uri,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.message }, { status: 400 });
    }

    console.error('Error creating auth code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
