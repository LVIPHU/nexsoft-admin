import { LocaleProvider } from './locale.provider';
import { Toaster } from 'sonner';
import { Outlet } from 'react-router-dom';

export const Providers = () => (
  <LocaleProvider>
    <Outlet />
    <Toaster />
  </LocaleProvider>
);
