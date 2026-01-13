import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './components/ui/font-declarations.css';
import './components/ui/index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename="/Dyslexia-PDF-Reader">
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
