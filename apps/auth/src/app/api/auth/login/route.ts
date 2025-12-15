import { NextRequest, NextResponse } from 'next/server';
import { signInSchema } from '@nexsoft-admin/models';
import { z } from 'zod';
import { getUserIdFromToken } from '@/libs/jwt';
import { setUserIdCookie } from '@/libs/cookies';

/**
 * POST /api/auth/login
 * Authenticate user with external API and set session cookie
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = signInSchema.parse(body);

    // Get external API URL from environment
    const externalApiUrl = process.env.EXTERNAL_AUTH_API_URL || '';

    if (!externalApiUrl) {
      return NextResponse.json({ error: 'External auth API URL not configured' }, { status: 500 });
    }

    // Call external API to authenticate
    // Map identifier (from signInSchema) to username (for external API)
    const loginResponse = await fetch(`${externalApiUrl}/v1/public/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: validated.identifier,
        password: validated.password,
      }),
    });

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

    // Create response
    const response = NextResponse.json({
      success: true,
      userId,
    });

    // Set user_id cookie
    setUserIdCookie(response, userId);

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.message }, { status: 400 });
    }

    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


