import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router';
import { Providers } from '@/providers';
import { ErrorPage } from '@/pages/error/page';
import { RootLayout } from '@/pages/layout';
import { AdminLayout } from '@/pages/admin/layout';
import { DashboardPage } from '@/pages/admin/dashboard/page';
import { CallbackPage } from '@/pages/callback/page';
import { AuthGuard } from '@/router/guards/auth.guard';
import { AdminManagementPage } from '@/pages/admin/account-management/admin-management/page';
import { AccountManagementLayout } from '@/pages/admin/account-management/layout';
import { MyAccountPage } from '@/pages/admin/account-management/my-account/page';
import { RolesAndPermissionsPage } from '@/pages/admin/account-management/roles-and-permissions/page';
import { GasManagementLayout } from '@/pages/admin/gas-management/layout';
import { ReportMetricsPage } from '@/pages/admin/gas-management/report-metrics/page';
import { ActivityHistoryPage } from '@/pages/admin/gas-management/activity-history/page';

export const routes = createRoutesFromElements(
  <Route element={<Providers />}>
    <Route element={<RootLayout />}>
      <Route errorElement={<ErrorPage />}>
        <Route element={<AuthGuard />}>
          <Route element={<AdminLayout />}>
            <Route path='dashboard' element={<DashboardPage />} />

            {/* Gas Management */}
            <Route path='gas-management' element={<GasManagementLayout />}>
              <Route path='report-metrics' element={<ReportMetricsPage />} />
              <Route path='activity-history' element={<ActivityHistoryPage />} />
              <Route index element={<Navigate replace to='/gas-management/report-metrics' />} />
            </Route>

            {/* Account Management */}
            <Route path='account-management' element={<AccountManagementLayout />}>
              <Route path='my-account' element={<MyAccountPage />} />
              <Route path='admin-management' element={<AdminManagementPage />} />
              <Route path='roles-and-permissions' element={<RolesAndPermissionsPage />} />
              <Route index element={<Navigate replace to='/account-management/my-account' />} />
            </Route>

            <Route index element={<Navigate replace to='/dashboard' />} />
          </Route>
        </Route>

        <Route path='callback' element={<CallbackPage />} />
      </Route>
    </Route>
  </Route>,
);

export const router = createBrowserRouter(routes);
