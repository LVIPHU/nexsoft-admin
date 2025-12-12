import type { SSOConfig } from '../types/sso.types.js';

/**
 * Type guard to check if import.meta is available (Vite environment)
 */
function hasImportMeta(): boolean {
  try {
    return typeof import.meta !== 'undefined' && 'env' in import.meta;
  } catch {
    return false;
  }
}

/**
 * Type guard to check if process is available (Node.js/Next.js environment)
 */
function hasProcess(): boolean {
  try {
    return typeof process !== 'undefined' && process.env !== undefined;
  } catch {
    return false;
  }
}

/**
 * Helper function to get environment variable from both import.meta.env (Vite) and process.env (Next.js)
 * Supports both VITE_ and NEXT_PUBLIC_ prefixes, as well as no prefix
 * Priority order:
 * 1. import.meta.env.VITE_* (Vite client-side)
 * 2. import.meta.env.* (Vite without prefix)
 * 3. process.env.NEXT_PUBLIC_* (Next.js client-side)
 * 4. process.env.* (Node.js/Next.js server-side)
 */
function getEnvVar(key: string, fallback = ''): string {
  // Try to access import.meta.env (Vite environment)
  if (hasImportMeta()) {
    // Type assertion is safe here because we've checked import.meta exists
    const viteEnv = import.meta.env as Record<string, string | undefined>;

    // Try VITE_ prefix first (Vite convention for client-side variables)
    const viteKey = `VITE_${key}`;
    const viteValue = viteEnv[viteKey];
    if (viteValue && typeof viteValue === 'string' && viteValue.trim() !== '') {
      return viteValue;
    }

    // Try without prefix (for backward compatibility)
    const directValue = viteEnv[key];
    if (directValue && typeof directValue === 'string' && directValue.trim() !== '') {
      return directValue;
    }
  }

  // Fallback to process.env (Next.js/Node.js environment)
  // Only access process.env if it's available (not in browser-only Vite builds)
  if (hasProcess()) {
    // Try NEXT_PUBLIC_ prefix first (Next.js convention for client-side variables)
    const nextPublicKey = `NEXT_PUBLIC_${key}`;
    const nextPublicValue = process.env[nextPublicKey];
    if (nextPublicValue && nextPublicValue.trim() !== '') {
      return nextPublicValue;
    }

    // Try without prefix (for server-side or backward compatibility)
    const processValue = process.env[key];
    if (processValue && processValue.trim() !== '') {
      return processValue;
    }
  }

  return fallback;
}

/**
 * Create SSO configuration from environment variables
 * This function should be called at app level, not library level
 * Automatically supports both Vite (import.meta.env) and Next.js (process.env)
 *
 * @param options - Optional configuration with fallback values
 */
export function createSSOConfig(options?: {
  defaultAuthServerUrl?: string;
  defaultAppId?: string;
  defaultAppUrl?: string;
}): SSOConfig {
  const authServerUrl =
    getEnvVar('AUTH_SERVER_URL') ||
    options?.defaultAuthServerUrl ||
    (typeof window !== 'undefined' ? 'http://localhost:3000' : '');
  const appUrl =
    getEnvVar('APP_URL') || options?.defaultAppUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  const appId = getEnvVar('APP_ID') || options?.defaultAppId || '';
  const callbackPath = getEnvVar('SSO_CALLBACK_PATH', '/callback');
  const tokenStorage = getEnvVar('TOKEN_STORAGE', 'localStorage');

  if (!authServerUrl) {
    throw new Error(
      'AUTH_SERVER_URL is required. Please set VITE_AUTH_SERVER_URL or AUTH_SERVER_URL environment variable.',
    );
  }

  if (!appId) {
    throw new Error('APP_ID is required. Please set VITE_APP_ID or APP_ID environment variable.');
  }

  return {
    authServerUrl,
    appUrl,
    appId,
    callbackPath,
    tokenStorage: tokenStorage as 'localStorage' | 'sessionStorage' | 'cookie' | 'memory',
  };
}

/**
 * Get SSO configuration from environment variables
 * Automatically supports both Vite (import.meta.env) and Next.js (process.env)
 * @deprecated Use createSSOConfig() instead. This function is kept for backward compatibility.
 */
export function getSSOConfig(): SSOConfig {
  return createSSOConfig();
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
