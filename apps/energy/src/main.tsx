import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from '@/router';
import { initializeLingui } from '@/libs/lingui';

async function initApp() {
  await initializeLingui();

  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}

void initApp();
