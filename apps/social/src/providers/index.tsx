import { LocaleProvider } from './locale.provider';
import { Toaster } from 'sonner';
import { SSOProvider, createSSOConfig } from '@nexsoft-admin/sso';
import { Outlet } from 'react-router';

export const Providers = () => {
  const ssoConfig = createSSOConfig({
    defaultAuthServerUrl: 'http://localhost:3000',
    defaultAppId: 'social',
    defaultAppUrl: typeof window !== 'undefined' ? window.location.origin : '',
  });

  return (
    <SSOProvider config={ssoConfig}>
      <LocaleProvider>
        <Outlet />
        <Toaster />
      </LocaleProvider>
    </SSOProvider>
  );
};
