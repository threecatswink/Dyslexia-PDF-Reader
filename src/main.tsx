import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './components/ui/font-declarations.css';
import './components/ui/index.css';
import Viewer from './components/pdf/Viewer.tsx';
import Toolbar from './components/layout/toolbar/Toolbar.tsx';
import Reader from './components/layout/tts/Reader.tsx';

function App() {
  return (
    <>
      <header aria-labelledby="toolbar" className="fixed top-0 right-0 left-0 z-50">
        <Toolbar />
      </header>

      <main className="mt-13 h-[calc(100vh-50px)] overflow-y-auto shadow-2xl">
        <Viewer />
        <Reader />
      </main>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);