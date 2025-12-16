import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router';
import { Providers } from '@/providers';
import { Test1 } from '@/pages/test1';


export const routes = createRoutesFromElements(
  <Route element={<Providers />}>
      <Route path='callback' element={<Test1 />} />
      <Route path='dashboard' element={<Test1 />} />
      <Route index element={<Navigate replace to='/dashboard' />} />
  </Route>,
);

export const router = createBrowserRouter(routes);
