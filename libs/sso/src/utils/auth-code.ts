/**
 * Generate a secure random auth code
 */
export function generateAuthCode(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // Browser or Node.js 18+ with Web Crypto API
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  // Fallback for older Node.js versions
  if (typeof require !== 'undefined') {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }

  // Last resort fallback (not secure, but better than nothing)
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Parse auth code from URL query parameters
 */
export function parseAuthCodeFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('code');
  } catch {
    return null;
  }
}

/**
 * Parse error from URL query parameters
 */
export function parseErrorFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('error');
  } catch {
    return null;
  }
}
