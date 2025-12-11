import { useState, useEffect, useCallback } from 'react';
import { SSOClient } from '../client/sso-client.js';
import { getSSOConfig } from '../config/sso-config.js';
import type { SSOConfig, SessionData, LogoutType } from '../types/sso.types.js';

export interface UseSSOReturn {
  client: SSOClient;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: SessionData | null;
  error: string | null;
  login: (redirectUri?: string) => void;
  logout: (type?: LogoutType) => Promise<void>;
  refreshToken: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

/**
 * React hook for SSO functionality
 */
export function useSSO(config?: Partial<SSOConfig>): UseSSOReturn {
  const [client] = useState(() => {
    const fullConfig = config ? { ...getSSOConfig(), ...config } : getSSOConfig();
    return new SSOClient(fullConfig);
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<SessionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on mount and when session changes
  useEffect(() => {
    const checkAuth = () => {
      try {
        const currentSession = client.getSession();
        const authenticated = client.isAuthenticated();

        setSession(currentSession);
        setIsAuthenticated(authenticated);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication check failed');
        setIsAuthenticated(false);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Check periodically (every 30 seconds) to catch token expiration
    const interval = setInterval(checkAuth, 30000);

    return () => clearInterval(interval);
  }, [client]);

  const login = useCallback(
    (redirectUri?: string) => {
      try {
        setError(null);
        client.initiateLogin(redirectUri);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed');
      }
    },
    [client],
  );

  const logout = useCallback(
    async (type: LogoutType = 'local') => {
      try {
        setError(null);
        await client.logout(type);
        setIsAuthenticated(false);
        setSession(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Logout failed');
      }
    },
    [client],
  );

  const refreshToken = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      await client.refreshToken();
      const newSession = client.getSession();
      setSession(newSession);
      setIsAuthenticated(newSession !== null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Token refresh failed');
      setIsAuthenticated(false);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  const getAccessToken = useCallback(async () => {
    try {
      return await client.getAccessToken();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get access token');
      return null;
    }
  }, [client]);

  return {
    client,
    isAuthenticated,
    isLoading,
    session,
    error,
    login,
    logout,
    refreshToken,
    getAccessToken,
  };
}
