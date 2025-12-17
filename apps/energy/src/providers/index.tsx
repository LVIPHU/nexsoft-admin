import { Toaster } from 'sonner';
import { Outlet } from 'react-router';
import { TooltipProvider } from '@nexsoft-admin/ui/tooltip';
import { SSOProvider, createSSOConfig } from '@nexsoft-admin/sso';
import { LocaleProvider } from '@/providers/locale.provider';
import { ThemeProvider } from '@/providers/theme.provider';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/libs/query-client';

export const Providers = () => {
  const ssoConfig = createSSOConfig({
    defaultAuthServerUrl: 'http://localhost:3000',
    defaultAppId: 'energy',
    defaultAppUrl: typeof window !== 'undefined' ? window.location.origin : '',
  });

  return (
    <SSOProvider config={ssoConfig}>
      <QueryClientProvider client={queryClient}>
        <LocaleProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Outlet />
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </LocaleProvider>
      </QueryClientProvider>
    </SSOProvider>
  );
};
