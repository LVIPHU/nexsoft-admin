import { Toaster } from 'sonner';
import { Outlet } from 'react-router';
import { LocaleProvider } from '@/providers/locale.provider';
import { SSOProvider, createSSOConfig } from '@nexsoft-admin/sso';

export const Providers = () => {
  const ssoConfig = createSSOConfig({
    defaultAuthServerUrl: 'http://localhost:3000',
    defaultAppId: 'energy',
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
