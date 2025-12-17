import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router';
import { Providers } from '@/providers';
import { ErrorPage } from '@/pages/error/page';
import { RootLayout } from '@/pages/layout';
import { DashboardPage } from '@/pages/dashboard/page';
import { CallbackPage } from '@/pages/callback/page';
import { AuthGuard } from '@/router/guards/auth.guard';

export const routes = createRoutesFromElements(
  <Route element={<Providers />}>
    <Route errorElement={<ErrorPage />}>
      <Route path='callback' element={<CallbackPage />} />
      <Route element={<AuthGuard />}>
        <Route element={<RootLayout />}>
          <Route path='dashboard' element={<DashboardPage />} />
          <Route index element={<Navigate replace to='/dashboard' />} />
        </Route>
      </Route>
    </Route>
  </Route>,
);

export const router = createBrowserRouter(routes);
