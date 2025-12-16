import { StrictMode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import * as ReactDOM from 'react-dom/client';
import { Test1 } from '@/pages/test1';

async function initApp() {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

  root.render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path='/callback' element={<Test1 />} />
          <Route path='/dashboard' element={<Test1 />} />
          <Route index element={<Navigate replace to='/dashboard' />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>,
  );
}

void initApp();
