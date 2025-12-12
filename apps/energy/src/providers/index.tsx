import { Toaster } from 'sonner';
import { Outlet } from 'react-router';
import { LocaleProvider } from '@/providers/locale.provider';

export const Providers = () => (
  <LocaleProvider>
    <Outlet />
    <Toaster />
  </LocaleProvider>
);
