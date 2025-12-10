import { NextRequest, NextResponse } from 'next/server';
import { refreshTokenRequestSchema, type RefreshTokenResponseDto } from '@nexsoft-admin/models';
import { z } from 'zod';

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh_token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = refreshTokenRequestSchema.parse(body);

    // Call external API to refresh tokens
    const externalApiUrl = process.env.EXTERNAL_AUTH_API_URL || '';

    if (!externalApiUrl) {
      // Fallback: Return mock tokens (in production, always call external API)
      const expiresIn = new Date(Date.now() + 3600 * 1000).toISOString();
      const response: RefreshTokenResponseDto = {
        access_token: `mock_access_token_refreshed_${Date.now()}`,
        refresh_token: `mock_refresh_token_${Date.now()}`,
        expires_in: expiresIn,
      };

      return NextResponse.json(response);
    }

    // Call external API to refresh tokens
    try {
      const tokenResponse = await fetch(`${externalApiUrl}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: validated.refresh_token,
        }),
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.json().catch(() => ({ message: 'Token refresh failed' }));
        return NextResponse.json(
          { error: error.message || 'Token refresh failed' },
          { status: tokenResponse.status }
        );
      }

      const tokens = (await tokenResponse.json()) as RefreshTokenResponseDto;
      return NextResponse.json(tokens);
    } catch (error) {
      console.error('Error calling external refresh API:', error);
      return NextResponse.json(
        { error: 'Failed to refresh token' },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.message },
        { status: 400 }
      );
    }

    console.error('Error refreshing token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


