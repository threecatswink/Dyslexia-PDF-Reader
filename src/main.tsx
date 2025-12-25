import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import PDFviewer from './PDFviewer.tsx';
import Toolbar from './Toolbar.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <header aria-labelledby="toolbar">
      <Toolbar />
    </header>

    <main>
      <PDFviewer />
    </main>
  </StrictMode>
);
