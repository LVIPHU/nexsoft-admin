import { createContext, useContext, type ReactNode } from 'react';
import type { SSOConfig } from './types/sso.types.js';

interface SSOContextValue {
  config: SSOConfig;
}

const SSOContext = createContext<SSOContextValue | null>(null);

export interface SSOProviderProps {
  config: SSOConfig;
  children: ReactNode;
}

/**
 * SSOProvider component - Provides SSO configuration to the app via React Context
 * This allows the library to work without reading env vars directly
 */
export function SSOProvider({ config, children }: SSOProviderProps) {
  return <SSOContext.Provider value={{ config }}>{children}</SSOContext.Provider>;
}

/**
 * Hook to access SSO configuration from Context
 * Returns null if used outside of SSOProvider
 */
export function useSSOContext(): SSOContextValue | null {
  return useContext(SSOContext);
}
