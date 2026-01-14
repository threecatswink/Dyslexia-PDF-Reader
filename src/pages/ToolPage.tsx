import { Helmet } from 'react-helmet-async';
import Viewer from '../components/pdf/Viewer.tsx';
import Toolbar from '../components/layout/toolbar/Toolbar.tsx';
import Reader from '../components/layout/tts/Reader.tsx';

function ToolPage() {
  return (
    <>
      <Helmet>
        <title>Dyslexia PDF Reader | Free Open-Source Accessible Web Tool</title>
        <meta
          name="description"
          content="A free, open-source, accessible PDF reader designed for people with dyslexia and reading disabilities. Read PDFs with OpenDyslexic fonts in high contrast with added features, and accessibility-first layouts—no ads or paywalls"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://threecatswink.github.io/Dyslexia-PDF-Reader/" />
      </Helmet>
      <header aria-labelledby="toolbar" className="fixed top-0 right-0 left-0 z-50">
        <Toolbar />
      </header>

      <main
        aria-label="Canvas area"
        className="mt-13 h-[calc(100vh-50px)] overflow-y-auto shadow-2xl"
      >
        <Viewer />
        <Reader />
      </main>
    </>
  );
}

export default ToolPage;
