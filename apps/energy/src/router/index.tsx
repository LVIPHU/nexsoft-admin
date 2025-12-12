import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router';
import { Providers } from '@/providers';
import { ErrorPage } from '@/pages/error/page';
import { RootLayout } from '@/pages/layout';
import { DashboardPage } from '@/pages/dashboard/page';

export const routes = createRoutesFromElements(
    <Route element={<Providers />}>
      <Route errorElement={<ErrorPage />}>
        <Route element={<RootLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route index element={<Navigate replace to="/dashboard" />} />
        </Route>
      </Route>
    </Route>
)

export const router = createBrowserRouter(routes);
