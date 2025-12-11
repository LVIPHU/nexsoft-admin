import { getRedisClient } from './client';

const SESSION_PREFIX = 'session:';
const APP_SESSION_PREFIX = 'app_session:';
const SESSION_EXPIRY = parseInt(process.env.ACCESS_TOKEN_EXPIRY || '3600', 10); // Default 1 hour

export interface SessionData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  appId?: string;
}

/**
 * Store user session in Redis (for global logout)
 */
export async function storeSession(userId: string, data: SessionData): Promise<void> {
  const redis = getRedisClient();
  const key = `${SESSION_PREFIX}${userId}`;
  const value = JSON.stringify(data);

  await redis.setex(key, SESSION_EXPIRY, value);
}

/**
 * Store app-specific session in Redis (for local logout)
 */
export async function storeAppSession(appId: string, userId: string, data: SessionData): Promise<void> {
  const redis = getRedisClient();
  const key = `${APP_SESSION_PREFIX}${appId}:${userId}`;
  const value = JSON.stringify(data);

  await redis.setex(key, SESSION_EXPIRY, value);
}

/**
 * Get user session from Redis
 */
export async function getSession(userId: string): Promise<SessionData | null> {
  const redis = getRedisClient();
  const key = `${SESSION_PREFIX}${userId}`;
  const value = await redis.get(key);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as SessionData;
  } catch {
    return null;
  }
}

/**
 * Get app-specific session from Redis
 */
export async function getAppSession(appId: string, userId: string): Promise<SessionData | null> {
  const redis = getRedisClient();
  const key = `${APP_SESSION_PREFIX}${appId}:${userId}`;
  const value = await redis.get(key);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as SessionData;
  } catch {
    return null;
  }
}

/**
 * Revoke all sessions for a user (global logout)
 */
export async function revokeAllSessions(userId: string): Promise<void> {
  const redis = getRedisClient();
  const sessionKey = `${SESSION_PREFIX}${userId}`;
  const appSessionPattern = `${APP_SESSION_PREFIX}*:${userId}`;

  // Delete main session
  await redis.del(sessionKey);

  // Delete all app sessions
  const keys = await redis.keys(appSessionPattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

/**
 * Revoke app-specific session (local logout)
 */
export async function revokeAppSession(appId: string, userId: string): Promise<void> {
  const redis = getRedisClient();
  const key = `${APP_SESSION_PREFIX}${appId}:${userId}`;
  await redis.del(key);
}

/**
 * Get all app sessions for a user (for global logout notification)
 */
export async function getAllAppSessions(userId: string): Promise<Array<{ appId: string; session: SessionData }>> {
  const redis = getRedisClient();
  const pattern = `${APP_SESSION_PREFIX}*:${userId}`;
  const keys = await redis.keys(pattern);

  const sessions: Array<{ appId: string; session: SessionData }> = [];

  for (const key of keys) {
    const value = await redis.get(key);
    if (value) {
      try {
        const session = JSON.parse(value) as SessionData;
        // Extract appId from key: app_session:{appId}:{userId}
        const parts = key.split(':');
        const appId = parts[1];
        sessions.push({ appId, session });
      } catch {
        // Skip invalid sessions
      }
    }
  }

  return sessions;
}
