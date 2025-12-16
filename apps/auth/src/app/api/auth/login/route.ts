import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserIdFromToken } from '@/libs/jwt';
import { setUserIdCookie } from '@/libs/cookies';
import { generateAuthCode } from '@nexsoft-admin/sso/core';
import { storeAuthCode } from '@/libs/redis';
import { addCorsHeaders, createCorsPreflightResponse } from '@/libs/cors';
// import { signInSchema } from '@nexsoft-admin/models';

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
    // const body = await request.json();
    // const validated = signInSchema.parse(body);

    // Get redirect_uri and app_id from query params (for SSO flow)
    const searchParams = request.nextUrl.searchParams;
    const redirectUri = searchParams.get('redirect_uri');
    const appId = searchParams.get('app_id');

    // Get external API URL from environment
    // const externalApiUrl = process.env.EXTERNAL_AUTH_API_URL || '';

    // if (!externalApiUrl) {
    //   return NextResponse.json({ error: 'External auth API URL not configured' }, { status: 500 });
    // }

    // Call external API to authenticate
    // Map identifier (from signInSchema) to username (for external API)
    // NOTE: Temporarily commented out for fake data testing
    // const loginResponse = await fetch(`/v1/public/login.json`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     username: validated.identifier,
    //     password: validated.password,
    //   }),
    // });

    // if (!loginResponse.ok) {
    //   const errorData = await loginResponse.json().catch(() => ({ message: 'Login failed' }));
    //   return NextResponse.json(
    //     { error: errorData.message || 'Invalid credentials' },
    //     { status: loginResponse.status === 401 ? 401 : 500 },
    //   );
    // }

    // Get tokens from response
    // const tokenData = (await loginResponse.json()) as {
    //   access_token: string;
    //   refresh_token: string;
    //   expires_in: string;
    // };

    // FAKE DATA: Hard coded response for testing
    const tokenData = {
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkJlYXJlcitKV1QiLCJjdHkiOiJKU09OIn0.eyJzdWIiOiJmb2Rlbl9uZ28iLCJjaWQiOiJiYWNrb2ZmaWNlLnRiY2hhdC5pbyIsImlhdCI6MTc2MzAyMzAwMiwibmJmIjoxNzYzMDIzMDAyLCJleHAiOjE3NjMxMDk0MDIsInJvbGVzIjpbIlN1cGVyIEFkbWluIl0sIm1ldGFkYXRhIjp7ImF2YXRhcl91cmwiOm51bGwsIm5hbWUiOiJmb2Rlbl9uZ28iLCJ0aHVtYm5haWxfdXJsIjpudWxsfX0.qdhIst6oAJ6km6kE-u1UW44DFAT1iSI-mmwlzhy_okwiXCp-cXKqByysIiZKmuOoPSHQKJ-qU2Y7oAFZ-XZiZ8-BaTLWWpF2p655oipxP8ddj_93EQQ83QLKJ2YE8Qm0HF6aku-PlPrmy-5f-x5n9cC5BAObHXXUX1XpFIznZk-x76kD8euZ8MOEN8JfQ_t5kIu5XNovzfjHt7kTM7UjLptm_AJ6ScIaTc60NPYQ8Q4e0QhueODuc2Btu9jVOEP4eTboA9b92GE2eo_2CGCfmoPlK7PX-WilAGrSWGgIMOu7u1m7qcdMy9mPGgOId2JJuEDOiD8htTMNUys7KfzdjQ',
      refresh_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkJlYXJlcitKV1QiLCJjdHkiOiJKU09OIn0.eyJzdWIiOiJmb2Rlbl9uZ28iLCJjaWQiOiJiYWNrb2ZmaWNlLnRiY2hhdC5pbyIsImlhdCI6MTc2MzAyMzAwMiwibmJmIjoxNzYzMDIzMDAyLCJleHAiOjE3NjMxOTU4MDIsInJvbGVzIjpbIlN1cGVyIEFkbWluIl0sIm1ldGFkYXRhIjp7ImF2YXRhcl91cmwiOm51bGwsIm5hbWUiOiJmb2Rlbl9uZ28iLCJ0aHVtYm5haWxfdXJsIjpudWxsfX0.Efm9oOV0poztxVZZjz9l8Kyeyk3srLiM5GOGTG3loyV3BPOdy9ao92ukKNmlE5GxThkmJdZ98PkF7aE_hwPPX0aFJKKGKHUQ2hw9pI06oI0lw1ualRrHUMcUdqi5n1abYvShytub9o7IpSJz4M7Rw2XDMQ10c8GSNMsJk3n0AA9-d9TuHQTV1ztc5HVnuIiaQ-MaPTYX0TnOxpRB1S9mx5SKrL3vY3c66YwDQFDbloC0zjuQeWadmWP-ALvcgQNwcw2IwEPZC04qg2JXz2jMfKnj9FjbVlycc-MTSWiyzykt0SFllEgbqlDDMTDW8nfjtFQ4oPHEOU5397Dv4mjv_g',
      expires_in: '2026-11-14T15:36:42.458586+07:00',
    } as {
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
