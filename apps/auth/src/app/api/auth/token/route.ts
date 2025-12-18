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
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkJlYXJlcitKV1QiLCJjdHkiOiJKU09OIn0.eyJzdWIiOiJmb2Rlbl9uZ28iLCJjaWQiOiJiYWNrb2ZmaWNlLnRiY2hhdC5pbyIsImlhdCI6MTc2MzAyMzAwMiwibmJmIjoxNzYzMDIzMDAyLCJleHAiOjE3NjMxMDk0MDIsInJvbGVzIjpbIlN1cGVyIEFkbWluIl0sIm1ldGFkYXRhIjp7ImF2YXRhcl91cmwiOm51bGwsIm5hbWUiOiJmb2Rlbl9uZ28iLCJ0aHVtYm5haWxfdXJsIjpudWxsfX0.qdhIst6oAJ6km6kE-u1UW44DFAT1iSI-mmwlzhy_okwiXCp-cXKqByysIiZKmuOoPSHQKJ-qU2Y7oAFZ-XZiZ8-BaTLWWpF2p655oipxP8ddj_93EQQ83QLKJ2YE8Qm0HF6aku-PlPrmy-5f-x5n9cC5BAObHXXUX1XpFIznZk-x76kD8euZ8MOEN8JfQ_t5kIu5XNovzfjHt7kTM7UjLptm_AJ6ScIaTc60NPYQ8Q4e0QhueODuc2Btu9jVOEP4eTboA9b92GE2eo_2CGCfmoPlK7PX-WilAGrSWGgIMOu7u1m7qcdMy9mPGgOId2JJuEDOiD8htTMNUys7KfzdjQ',
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkJlYXJlcitKV1QiLCJjdHkiOiJKU09OIn0.eyJzdWIiOiJmb2Rlbl9uZ28iLCJjaWQiOiJiYWNrb2ZmaWNlLnRiY2hhdC5pbyIsImlhdCI6MTc2MzAyMzAwMiwibmJmIjoxNzYzMDIzMDAyLCJleHAiOjE3NjMxOTU4MDIsInJvbGVzIjpbIlN1cGVyIEFkbWluIl0sIm1ldGFkYXRhIjp7ImF2YXRhcl91cmwiOm51bGwsIm5hbWUiOiJmb2Rlbl9uZ28iLCJ0aHVtYm5haWxfdXJsIjpudWxsfX0.Efm9oOV0poztxVZZjz9l8Kyeyk3srLiM5GOGTG3loyV3BPOdy9ao92ukKNmlE5GxThkmJdZ98PkF7aE_hwPPX0aFJKKGKHUQ2hw9pI06oI0lw1ualRrHUMcUdqi5n1abYvShytub9o7IpSJz4M7Rw2XDMQ10c8GSNMsJk3n0AA9-d9TuHQTV1ztc5HVnuIiaQ-MaPTYX0TnOxpRB1S9mx5SKrL3vY3c66YwDQFDbloC0zjuQeWadmWP-ALvcgQNwcw2IwEPZC04qg2JXz2jMfKnj9FjbVlycc-MTSWiyzykt0SFllEgbqlDDMTDW8nfjtFQ4oPHEOU5397Dv4mjv_g',
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
