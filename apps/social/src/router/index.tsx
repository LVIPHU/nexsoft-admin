import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router';
import { Providers } from '@/providers';
import { ErrorPage } from '@/pages/error/page';
import { RootLayout } from '@/pages/layout';
import { AdminLayout } from '@/pages/admin/layout';
import { DashboardPage } from '@/pages/admin/dashboard/page';
import { CallbackPage } from '@/pages/callback/page';
import { AuthGuard } from '@/router/guards/auth.guard';
import { SettingsLayout } from '@/pages/admin/settings/layout';
import { GeneralPage } from '@/pages/admin/settings/general/page';
import { ProfilePage } from '@/pages/admin/settings/profile/page';
import { UsersPage } from '@/pages/admin/users/page';

export const routes = createRoutesFromElements(
  <Route element={<Providers />}>
    <Route element={<RootLayout />}>
      <Route errorElement={<ErrorPage />}>
        <Route path='callback' element={<CallbackPage />} />
        <Route element={<AuthGuard />}>
          <Route element={<AdminLayout />}>
            <Route path='dashboard' element={<DashboardPage />} />
            <Route path='users' element={<UsersPage />} />
            <Route path='settings' element={<SettingsLayout />}>
              <Route path='general' element={<GeneralPage />} />
              <Route path='profile' element={<ProfilePage />} />
              <Route index element={<Navigate replace to='/settings/general' />} />
            </Route>
            <Route index element={<Navigate replace to='/dashboard' />} />
            {/* Catch-all route for 404 - must be inside AuthGuard to check auth first */}
            <Route path='*' element={<ErrorPage />} />
          </Route>
        </Route>
      </Route>
    </Route>
  </Route>,
);

export const router = createBrowserRouter(routes);
