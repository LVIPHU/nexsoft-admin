import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { I18nProvider } from './components/I18nProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider locale="en">
      <App />
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>
);
