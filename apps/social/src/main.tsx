import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';

async function initApp() {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

  root.render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
}

void initApp();
