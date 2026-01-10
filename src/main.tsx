import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './components/ui/font-declarations.css';
import './components/ui/index.css';
import Viewer from './components/pdf/Viewer.tsx';
import Toolbar from './components/layout/toolbar/Toolbar.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <header aria-labelledby="toolbar" className="fixed top-0 right-0 left-0 z-50">
      <Toolbar />
    </header>

    <main className="mt-13 h-[calc(100vh-50px)] overflow-y-auto">
      <Viewer />
    </main>
  </StrictMode>
);
