import Viewer from '../components/pdf/Viewer';
import Toolbar from '../components/layout/toolpage/toolbar/Toolbar';
import Reader from '../components/layout/toolpage/tts/Reader';
import PDFOutlineSidebar from '../components/layout/toolpage/toolbar/left/OutlineSidebar';
import RulerOverlay from '../components/layout/toolpage/RulerOverlay';
import { useGlobalStates } from '../states/global-states';

function ToolPage() {
  const outlineEnabled = useGlobalStates((s) => s.outlineEnabled);
  const sidebarWidth = useGlobalStates((s) => s.sidebarWidth);

  return (
    <div role="application" aria-label="PDF Reader">
      <header aria-label="PDF document controls" className="fixed top-0 right-0 left-0 z-20">
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
          className="z-18 overflow-hidden transition-[width] duration-300 ease-in-out"
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

      <RulerOverlay />
    </div>
  );
}

export default ToolPage;
