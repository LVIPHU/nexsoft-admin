import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from '@/router';
import { initializeLingui } from '@/libs/lingui';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

await initializeLingui();

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
