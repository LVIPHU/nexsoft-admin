import type {
  SSOConfig,
  TokenResponse,
  TokenExchangeRequest,
  RefreshTokenRequest,
  SessionData,
  LogoutType,
} from '../types/sso.types.js';
import { SessionStorage } from '../utils/session.js';
import { validateRedirectUri } from '../config/sso-config.js';

export class SSOClient {
  private config: SSOConfig;
  private sessionStorage: SessionStorage;

  constructor(config: SSOConfig) {
    this.config = config;
    this.sessionStorage = new SessionStorage(config.tokenStorage);
  }

  /**
   * Initiate SSO login by redirecting to auth server
   */
  initiateLogin(redirectUri?: string): void {
    const finalRedirectUri = redirectUri || `${this.config.appUrl}${this.config.callbackPath}`;

    // Validate redirect URI
    const allowedOrigins = [this.config.appUrl];
    if (!validateRedirectUri(finalRedirectUri, allowedOrigins)) {
      throw new Error('Invalid redirect URI');
    }

    const loginUrl = new URL(`${this.config.authServerUrl}/sign-in`);
    loginUrl.searchParams.set('redirect_uri', finalRedirectUri);
    loginUrl.searchParams.set('app_id', this.config.appId);

    // Redirect to auth server
    if (typeof window !== 'undefined') {
      window.location.href = loginUrl.toString();
    }
  }

  /**
   * Exchange auth code for tokens
   */
  async exchangeCode(code: string, redirectUri: string): Promise<TokenResponse> {
    const request: TokenExchangeRequest = {
      code,
      redirect_uri: redirectUri,
    };

    const response = await fetch(`${this.config.authServerUrl}/api/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': this.config.appId,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Token exchange failed' }));
      throw new Error(error.message || 'Token exchange failed');
    }

    const tokenResponse = (await response.json()) as TokenResponse;
    this.saveSession(tokenResponse);

    return tokenResponse;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<TokenResponse> {
    const session = this.sessionStorage.getSession();
    if (!session || !session.refreshToken) {
      throw new Error('No refresh token available');
    }

    const request: RefreshTokenRequest = {
      refresh_token: session.refreshToken,
    };

    const response = await fetch(`${this.config.authServerUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': this.config.appId,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Token refresh failed' }));
      throw new Error(error.message || 'Token refresh failed');
    }

    const tokenResponse = (await response.json()) as TokenResponse;
    this.saveSession(tokenResponse);

    return tokenResponse;
  }

  /**
   * Save token response to session storage
   */
  private saveSession(tokenResponse: TokenResponse): void {
    const expiresAt =
      typeof tokenResponse.expires_in === 'number'
        ? tokenResponse.expires_in * 1000 // Unix seconds -> milliseconds
        : new Date(tokenResponse.expires_in).getTime();

    const session: SessionData = {
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresAt,
    };

    this.sessionStorage.saveSession(session);
  }

  /**
   * Get current session
   */
  getSession(): SessionData | null {
    return this.sessionStorage.getSession();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.sessionStorage.hasValidSession();
  }

  /**
   * Get access token (with auto-refresh if needed)
   */
  async getAccessToken(): Promise<string | null> {
    const session = this.sessionStorage.getSession();

    if (!session) {
      return null;
    }

    // Check if token is expired or about to expire (within 5 minutes)
    const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;
    if (session.expiresAt < fiveMinutesFromNow) {
      try {
        await this.refreshToken();
        const newSession = this.sessionStorage.getSession();
        return newSession?.accessToken || null;
      } catch (error) {
        console.error('Failed to refresh token:', error);
        await this.logout('local');
        return null;
      }
    }

    return session.accessToken;
  }

  /**
   * Logout (local or global)
   */
  async logout(type: LogoutType = 'local'): Promise<void> {
    const session = this.sessionStorage.getSession();

    if (session) {
      try {
        await fetch(`${this.config.authServerUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-app-id': this.config.appId,
          },
          body: JSON.stringify({
            type,
            refresh_token: session.refreshToken,
          }),
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }

    // Always clear local session
    this.sessionStorage.clearSession();

    // For global logout, redirect to auth server
    if (type === 'global' && typeof window !== 'undefined') {
      window.location.href = `${this.config.authServerUrl}/logout`;
    }
  }

  /**
   * Handle callback from auth server
   */
  async handleCallback(url: string): Promise<TokenResponse | null> {
    const urlObj = new URL(url);
    const code = urlObj.searchParams.get('code');
    const error = urlObj.searchParams.get('error');

    if (error) {
      throw new Error(`SSO error: ${error}`);
    }

    if (!code) {
      throw new Error('No auth code in callback URL');
    }

    const redirectUri = `${urlObj.origin}${urlObj.pathname}`;
    return await this.exchangeCode(code, redirectUri);
  }
}
