// Client
export { SSOClient } from './client/sso-client.js';
export type {
  SSOConfig,
  TokenResponse,
  TokenExchangeRequest,
  RefreshTokenRequest,
  SessionData,
  AuthState,
  LogoutType,
} from './types/sso.types.js';

// Hooks
export { useSSO } from './hooks/use-sso.js';
export { useAuth } from './hooks/use-auth.js';
export type { UseSSOReturn } from './hooks/use-sso.js';

// Utils
export { SessionStorage } from './utils/session.js';
export { generateAuthCode, parseAuthCodeFromUrl, parseErrorFromUrl } from './utils/auth-code.js';

// Config
export { getSSOConfig, validateRedirectUri } from './config/sso-config.js';
