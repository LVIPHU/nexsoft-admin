import type { SSOConfig } from '../types/sso.types.js';

/**
 * Get SSO configuration from environment variables
 */
export function getSSOConfig(): SSOConfig {
  const authServerUrl = process.env.NEXT_PUBLIC_AUTH_SERVER_URL || process.env.AUTH_SERVER_URL || '';
  const appUrl = 
    process.env.NEXT_PUBLIC_APP_URL || 
    process.env.APP_URL || 
    (typeof window !== 'undefined' ? window.location.origin : '');
  const appId = process.env.NEXT_PUBLIC_APP_ID || process.env.APP_ID || '';

  if (!authServerUrl) {
    throw new Error('AUTH_SERVER_URL is required');
  }

  if (!appId) {
    throw new Error('APP_ID is required');
  }

  return {
    authServerUrl,
    appUrl,
    appId,
    callbackPath: process.env.NEXT_PUBLIC_SSO_CALLBACK_PATH || '/callback',
    tokenStorage: (process.env.NEXT_PUBLIC_TOKEN_STORAGE as 'localStorage' | 'sessionStorage' | 'cookie' | 'memory') || 'localStorage',
  };
}

/**
 * Validate redirect URI to prevent open redirect attacks
 */
export function validateRedirectUri(uri: string, allowedOrigins: string[]): boolean {
  try {
    const url = new URL(uri);
    return allowedOrigins.some((origin) => url.origin === origin);
  } catch {
    return false;
  }
}

