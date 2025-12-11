import { NextRequest, NextResponse } from 'next/server';
import { getAuthCode, deleteAuthCode } from '@/libs/redis';
import { tokenExchangeRequestSchema, type TokenExchangeResponseDto } from '@nexsoft-admin/models';
import { z } from 'zod';

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
      return NextResponse.json({ error: 'Invalid or expired auth code' }, { status: 400 });
    }

    // Validate redirect_uri matches
    if (authCodeData.redirectUri !== validated.redirect_uri) {
      return NextResponse.json({ error: 'Redirect URI mismatch' }, { status: 400 });
    }

    // Check if code is expired
    if (authCodeData.expiresAt < Date.now()) {
      await deleteAuthCode(validated.code);
      return NextResponse.json({ error: 'Auth code expired' }, { status: 400 });
    }

    // Call external API to get tokens
    // In a real implementation, you'd call your existing login API
    // For now, we'll simulate it
    const externalApiUrl = process.env.EXTERNAL_AUTH_API_URL || '';

    if (!externalApiUrl) {
      // Fallback: Return mock tokens (in production, always call external API)
      const expiresIn = new Date(Date.now() + 3600 * 1000).toISOString();
      const response: TokenExchangeResponseDto = {
        access_token: `mock_access_token_${Date.now()}`,
        refresh_token: `mock_refresh_token_${Date.now()}`,
        expires_in: expiresIn,
      };

      // Delete auth code (one-time use)
      await deleteAuthCode(validated.code);

      return NextResponse.json(response);
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

      // Delete auth code (one-time use)
      await deleteAuthCode(validated.code);

      return NextResponse.json(tokens);
    } catch (error) {
      console.error('Error calling external auth API:', error);
      return NextResponse.json({ error: 'Failed to exchange code for tokens' }, { status: 500 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.message }, { status: 400 });
    }

    console.error('Error exchanging token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
