import { useSSO } from './use-sso.js';
import type { UseSSOReturn } from './use-sso.js';

/**
 * Alias for useSSO - provides authentication state and methods
 * This is a convenience hook that wraps useSSO with a more auth-focused name
 */
export function useAuth(config?: Parameters<typeof useSSO>[0]): UseSSOReturn {
  return useSSO(config);
}
