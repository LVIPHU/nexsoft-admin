import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserIdFromToken } from '@/libs/jwt';
import { setUserIdCookie } from '@/libs/cookies';
import { generateAuthCode } from '@nexsoft-admin/sso/core';
import { storeAuthCode } from '@/libs/redis';
import { addCorsHeaders, createCorsPreflightResponse } from '@/libs/cors';
import { signInSchema } from '@nexsoft-admin/models';

/**
 * OPTIONS /api/auth/login
 * Handle CORS preflight request
 */
export async function OPTIONS(request: NextRequest) {
  const response = createCorsPreflightResponse(request);
  return response || new NextResponse(null, { status: 204 });
}

/**
 * POST /api/auth/login
 * Authenticate user with external API and set session cookie
 * If redirect_uri and app_id are provided, automatically create auth code and redirect to callback
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = signInSchema.parse(body);

    // Get redirect_uri and app_id from query params (for SSO flow)
    const searchParams = request.nextUrl.searchParams;
    const redirectUri = searchParams.get('redirect_uri');
    const appId = searchParams.get('app_id');

    // Get external API URL from environment
    const externalApiUrl = process.env.EXTERNAL_AUTH_API_URL || '';

    if (!externalApiUrl) {
      return NextResponse.json({ error: 'External auth API URL not configured' }, { status: 500 });
    }

    // Call external API to authenticate
    // Map identifier (from signInSchema) to username (for external API)
    // NOTE: Temporarily commented out for fake data testing
    const params = new URLSearchParams();
    params.append('username', validated.identifier);
    params.append('password', validated.password);

    const loginResponse = await fetch(`${externalApiUrl}/v1/admin/auth/login`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    console.log(loginResponse);

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json().catch(() => ({ message: 'Login failed' }));
      return NextResponse.json(
        { error: errorData.message || 'Invalid credentials' },
        { status: loginResponse.status === 401 ? 401 : 500 },
      );
    }

    // Get tokens from response
    const tokenData = (await loginResponse.json()) as {
      access_token: string;
      refresh_token: string;
      expires_in: string;
    };

    // Decode JWT to get userId (MOCK: currently uses sub as userId)
    const userId = getUserIdFromToken(tokenData.access_token);

    // If redirect_uri and app_id are provided, create auth code and return redirect URL
    if (redirectUri && appId) {
      // Generate secure auth code
      const code = generateAuthCode();

      // Calculate expiry time (5 minutes from now)
      const expiresAt = Date.now() + 5 * 60 * 1000;

      // Store auth code in Redis
      await storeAuthCode(code, {
        userId,
        redirectUri,
        expiresAt,
        appId,
      });

      // Build callback URL with code
      const callbackUrl = new URL(redirectUri);
      callbackUrl.searchParams.set('code', code);

      // Return JSON with redirect URL (client will handle redirect)
      const response = NextResponse.json({
        success: true,
        userId,
        redirect_url: callbackUrl.toString(),
      });

      // Set user_id cookie
      setUserIdCookie(response, userId);

      // Add CORS headers
      return addCorsHeaders(request, response);
    }

    // No redirect_uri, return JSON response (for direct login without SSO)
    const response = NextResponse.json({
      success: true,
      userId,
    });

    // Set user_id cookie
    setUserIdCookie(response, userId);

    // Add CORS headers
    return addCorsHeaders(request, response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response = NextResponse.json({ error: 'Invalid request', details: error.message }, { status: 400 });
      return addCorsHeaders(request, response);
    }

    console.error('Error during login:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    return addCorsHeaders(request, response);
  }
}
