import { getRedisClient } from './client';

const AUTH_CODE_PREFIX = 'auth_code:';
const AUTH_CODE_EXPIRY = parseInt(process.env.AUTH_CODE_EXPIRY || '300', 10); // Default 5 minutes

export interface AuthCodeData {
  userId: string;
  redirectUri: string;
  expiresAt: number;
}

/**
 * Store auth code in Redis
 */
export async function storeAuthCode(code: string, data: AuthCodeData): Promise<void> {
  const redis = getRedisClient();
  const key = `${AUTH_CODE_PREFIX}${code}`;
  const value = JSON.stringify(data);

  await redis.setex(key, AUTH_CODE_EXPIRY, value);
}

/**
 * Get auth code data from Redis
 */
export async function getAuthCode(code: string): Promise<AuthCodeData | null> {
  const redis = getRedisClient();
  const key = `${AUTH_CODE_PREFIX}${code}`;
  const value = await redis.get(key);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AuthCodeData;
  } catch {
    return null;
  }
}

/**
 * Delete auth code from Redis (one-time use)
 */
export async function deleteAuthCode(code: string): Promise<void> {
  const redis = getRedisClient();
  const key = `${AUTH_CODE_PREFIX}${code}`;
  await redis.del(key);
}


