import { NextRequest, NextResponse } from 'next/server';
import { getAuthCode, deleteAuthCode } from '@/libs/redis';
import { storeSession, storeAppSession } from '@/libs/redis';
import { tokenExchangeRequestSchema, type TokenExchangeResponseDto } from '@nexsoft-admin/models';
import { addCorsHeaders, createCorsPreflightResponse } from '@/libs/cors';
import { z } from 'zod';

/**
 * OPTIONS /api/auth/token
 * Handle CORS preflight request
 */
export async function OPTIONS(request: NextRequest) {
  const response = createCorsPreflightResponse(request);
  return response || new NextResponse(null, { status: 204 });
}

/**
 * POST /api/auth/token
 * Exchange auth_code for access_token and refresh_token
 * This is a server-to-server call from relying parties
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = tokenExchangeRequestSchema.parse(body);

    // Get auth code data from Redis
    const authCodeData = await getAuthCode(validated.code);

    console.log('authCodeData', authCodeData);

    if (!authCodeData) {
      const response = NextResponse.json({ error: 'Invalid or expired auth code' }, { status: 400 });
      return addCorsHeaders(request, response);
    }

    // Validate redirect_uri matches
    if (authCodeData.redirectUri !== validated.redirect_uri) {
      const response = NextResponse.json({ error: 'Redirect URI mismatch' }, { status: 400 });
      return addCorsHeaders(request, response);
    }

    // Check if code is expired
    if (authCodeData.expiresAt < Date.now()) {
      await deleteAuthCode(validated.code);
      const response = NextResponse.json({ error: 'Auth code expired' }, { status: 400 });
      return addCorsHeaders(request, response);
    }

    // Use tokens from auth code (stored during login via external API /v1/admin/auth/login)
    if (!authCodeData.access_token || !authCodeData.refresh_token || !authCodeData.expires_in) {
      const response = NextResponse.json({ error: 'Invalid auth code data' }, { status: 400 });
      return addCorsHeaders(request, response);
    }

    const userId = authCodeData.userId;
    const appId = authCodeData.appId;

    const tokens: TokenExchangeResponseDto = {
      access_token: authCodeData.access_token,
      refresh_token: authCodeData.refresh_token,
      expires_in: authCodeData.expires_in,
    };

    const expiresAt = new Date(authCodeData.expires_in).getTime();
    const sessionData = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
      appId,
    };

    await storeSession(userId, sessionData);
    if (appId) {
      await storeAppSession(appId, userId, sessionData);
    }

    await deleteAuthCode(validated.code);

    return addCorsHeaders(request, NextResponse.json(tokens));
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response = NextResponse.json({ error: 'Invalid request', details: error.message }, { status: 400 });
      return addCorsHeaders(request, response);
    }

    console.error('Error exchanging token:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    return addCorsHeaders(request, response);
  }
}
