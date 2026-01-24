import Viewer from '../components/pdf/Viewer.tsx';
import Toolbar from '../components/layout/toolpage/toolbar/Toolbar.tsx';
import Reader from '../components/layout/toolpage/tts/Reader.tsx';
import PDFOutlineSidebar from '../components/layout/toolpage/toolbar/OutlineSidebar.tsx';
import { useGlobalStates } from '../states/global-states.tsx';

function ToolPage() {
  const outlineEnabled = useGlobalStates((s) => s.outlineEnabled);
  const sidebarWidth = useGlobalStates((s) => s.sidebarWidth);

  return (
    <div role="application" aria-label="PDF Reader">
      <header aria-label="PDF document controls" className="fixed top-0 right-0 left-0 z-50">
        <Toolbar />
      </header>

      <main
        aria-label="Main content area"
        className="mt-14 flex h-[calc(100vh-50px)] overflow-hidden"
      >
        <div
          style={{
            width: outlineEnabled ? `${sidebarWidth}px` : '0px',
          }}
          className="overflow-hidden transition-[width] duration-300 ease-in-out"
        >
          <PDFOutlineSidebar />
        </div>
        <div
          role="region"
          aria-label="Canvas area"
          className="flex flex-1 flex-col overflow-y-auto shadow-lg"
        >
          <Viewer />
          <Reader />
        </div>
      </main>
    </div>
  );
}

export default ToolPage;
