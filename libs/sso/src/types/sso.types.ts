export interface SSOConfig {
  authServerUrl: string;
  appUrl: string;
  appId: string;
  callbackPath?: string;
  tokenStorage?: 'localStorage' | 'sessionStorage' | 'cookie' | 'memory';
}

export interface AuthCodeResponse {
  code: string;
  redirectUri: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  /** ISO 8601 string or Unix timestamp in seconds */
  expires_in: string | number;
}

export interface TokenExchangeRequest {
  code: string;
  redirect_uri: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface SessionData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp
  userId?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  session: SessionData | null;
  error: string | null;
}

export type LogoutType = 'local' | 'global';
