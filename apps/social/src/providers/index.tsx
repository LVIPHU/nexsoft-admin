import { type ReactNode } from 'react';
import { LocaleProvider } from './locale.provider';
import { Toaster } from 'sonner';
import { SSOProvider, createSSOConfig } from '@nexsoft-admin/sso';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  const ssoConfig = createSSOConfig({
    defaultAuthServerUrl: 'http://localhost:3000',
    defaultAppId: 'social',
    defaultAppUrl: typeof window !== 'undefined' ? window.location.origin : '',
  });

  return (
    <SSOProvider config={ssoConfig}>
      <LocaleProvider>
        {children}
        <Toaster />
      </LocaleProvider>
    </SSOProvider>
  );
};
