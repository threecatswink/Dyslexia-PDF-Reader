import Viewer from '../components/pdf/Viewer.tsx';
import Toolbar from '../components/layout/toolpage/toolbar/Toolbar.tsx';
import Reader from '../components/layout/toolpage/tts/Reader.tsx';

function ToolPage() {
  return (
    <div role="application" aria-label="PDF Reader">
      <header aria-label="PDF document controls" className="fixed top-0 right-0 left-0 z-50">
        <Toolbar />
      </header>

      <main
        aria-label="Canvas area"
        className="mt-14 h-[calc(100vh-50px)] overflow-y-auto shadow-2xl"
      >
        <Viewer />
        <Reader />
      </main>
    </div>
  );
}

export default ToolPage;
