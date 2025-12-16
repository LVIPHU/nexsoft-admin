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

    // Call external API to get tokens
    // In a real implementation, you'd call your existing login API
    // For now, we'll simulate it
    const externalApiUrl = process.env.EXTERNAL_AUTH_API_URL || '';

    // Get userId and appId from auth code data
    const userId = authCodeData.userId;
    const appId = authCodeData.appId;

    if (!externalApiUrl) {
      // Fallback: Return mock tokens (in production, always call external API)
      const expiresIn = new Date(Date.now() + 3600 * 1000).toISOString();
      const response: TokenExchangeResponseDto = {
        access_token: `mock_access_token_${Date.now()}`,
        refresh_token: `mock_refresh_token_${Date.now()}`,
        expires_in: expiresIn,
      };

      // Convert expires_in (ISO 8601 string) to timestamp (milliseconds)
      const expiresAt = new Date(expiresIn).getTime();

      // Store session in Redis
      const sessionData = {
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        expiresAt,
        appId,
      };

      // Store for global logout
      await storeSession(userId, sessionData);

      // Store for local logout (if appId exists)
      if (appId) {
        await storeAppSession(appId, userId, sessionData);
      }

      // Delete auth code (one-time use)
      await deleteAuthCode(validated.code);

      const jsonResponse = NextResponse.json(response);
      return addCorsHeaders(request, jsonResponse);
    }

    // Call external API to get tokens
    try {
      const tokenResponse = await fetch(`${externalApiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: authCodeData.userId,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get tokens from external API');
      }

      const tokens = (await tokenResponse.json()) as TokenExchangeResponseDto;

      // Convert expires_in (ISO 8601 string) to timestamp (milliseconds)
      const expiresAt = new Date(tokens.expires_in).getTime();

      // Store session in Redis
      const sessionData = {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt,
        appId,
      };

      // Store for global logout
      await storeSession(userId, sessionData);

      // Store for local logout (if appId exists)
      if (appId) {
        await storeAppSession(appId, userId, sessionData);
      }

      // Delete auth code (one-time use)
      await deleteAuthCode(validated.code);

      const jsonResponse = NextResponse.json(tokens);
      return addCorsHeaders(request, jsonResponse);
    } catch (error) {
      console.error('Error calling external auth API:', error);
      const response = NextResponse.json({ error: 'Failed to exchange code for tokens' }, { status: 500 });
      return addCorsHeaders(request, response);
    }
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
