import { SSOClient } from '@nexsoft-admin/sso';
import type { SSOConfig } from '@nexsoft-admin/sso';

let ssoClientInstance: SSOClient | null = null;

/**
 * Get or create SSO client instance
 */
export function getSSOClient(): SSOClient {
  if (ssoClientInstance) {
    return ssoClientInstance;
  }

  const config: SSOConfig = {
    authServerUrl: import.meta.env.VITE_AUTH_SERVER_URL || import.meta.env.AUTH_SERVER_URL || 'http://localhost:3000',
    appUrl: import.meta.env.VITE_APP_URL || import.meta.env.APP_URL || window.location.origin,
    appId: import.meta.env.VITE_APP_ID || import.meta.env.APP_ID || 'energy',
    callbackPath: import.meta.env.VITE_SSO_CALLBACK_PATH || '/callback',
    tokenStorage: (import.meta.env.VITE_TOKEN_STORAGE as 'localStorage' | 'sessionStorage' | 'cookie' | 'memory') || 'localStorage',
  };

  ssoClientInstance = new SSOClient(config);
  return ssoClientInstance;
}


