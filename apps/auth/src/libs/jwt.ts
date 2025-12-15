import { decodeJwt } from 'jose';

/**
 * JWT Payload structure from external API
 */
export interface JWTPayload {
  sub: string; // username (ví dụ: "foden_ngo")
  cid: string; // client ID (ví dụ: "backoffice.tbchat.io")
  iat: number; // issued at timestamp
  nbf: number; // not before timestamp
  exp: number; // expiration timestamp
  roles: string[]; // array of roles (ví dụ: ["Super Admin"])
  metadata: {
    avatar_url: string | null;
    name: string;
    thumbnail_url: string | null;
  };
}

/**
 * Decode JWT token without verification
 * Note: Token is already verified by external API, we just need to decode it
 */
export function decodeJWT(token: string): JWTPayload {
  try {
    const decoded = decodeJwt(token) as JWTPayload;

    // Validate required fields
    if (!decoded.sub) {
      throw new Error('Invalid JWT: missing sub field');
    }

    return decoded;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to decode JWT: ${error.message}`);
    }
    throw new Error('Failed to decode JWT: unknown error');
  }
}

/**
 * Get userId from JWT token
 * 
 * Currently MOCK: Returns `sub` (username) as userId
 * TODO: In the future, this can be changed to lookup userId from database using `sub`
 * 
 * @param token - JWT token string
 * @returns userId (currently returns sub/username)
 */
export function getUserIdFromToken(token: string): string {
  const payload = decodeJWT(token);
  // MOCK: Use sub as userId for now
  // TODO: Lookup actual userId from database/API using sub
  return payload.sub;
}


