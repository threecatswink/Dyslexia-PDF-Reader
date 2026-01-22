import { useEffect, useRef } from 'react';
import { useFileInformation } from '../../states/file-information';
import { useGlobalStates } from '../../states/global-states';
import Renderer from './Renderer';
import Overlay from './Overlay';

const Viewer = () => {
  const file = useFileInformation((s) => s.file);
  const setTotalPages = useFileInformation((s) => s.setTotalPages);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousZoomRef = useRef<number>(1);

  const currentPage = useGlobalStates((s) => s.currentPage);
  const currentZoom = useGlobalStates((s) => s.currentZoom);
  const dyslexiaEnabled = useGlobalStates((s) => s.dyslexiaEnabled);
  const halfBoldEnabled = useGlobalStates((s) => s.halfBoldEnabled);
  const accentEnabled = useGlobalStates((s) => s.accentEnabled);

  const pdf = useFileInformation((s) => s.pdf);
  const viewport = useFileInformation((s) => s.viewport);
  const setPDF = useFileInformation((s) => s.setPDF);
  const setPage = useFileInformation((s) => s.setPage);
  const resetPdf = useFileInformation((s) => s.reset);

  // Canvas should be hidden when any overlay feature is enabled
  const overlayActive = dyslexiaEnabled || halfBoldEnabled || accentEnabled;

  // Load PDF
  useEffect(() => {
    if (!file) {
      resetPdf();
      return;
    }
    (async () => {
      const buffer = await file.arrayBuffer();
      const { getDocument } = await import('pdfjs-dist');
      const pdfDoc = await getDocument(buffer).promise;
      setPDF(pdfDoc);
      setTotalPages(pdfDoc.numPages);
    })();
  }, [file, resetPdf, setPDF, setTotalPages]);

  // Load page
  useEffect(() => {
    if (!pdf) return;
    (async () => {
      const p = await pdf.getPage(currentPage);
      setPage(p, currentZoom);
    })();
  }, [pdf, currentPage, currentZoom, setPage]);

  // Maintain scroll position when zooming
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !viewport) return;

    const previousZoom = previousZoomRef.current;
    if (previousZoom === currentZoom) return;

    // Calculate center point of viewport before zoom
    const centerX = (container.scrollLeft + container.clientWidth / 2) / previousZoom;
    const centerY = (container.scrollTop + container.clientHeight / 2) / previousZoom;

    // Update ref for next zoom
    previousZoomRef.current = currentZoom;

    // After viewport updates, restore scroll position relative to zoom center
    requestAnimationFrame(() => {
      const newScrollLeft = centerX * currentZoom - container.clientWidth / 2;
      const newScrollTop = centerY * currentZoom - container.clientHeight / 2;

      container.scrollLeft = newScrollLeft;
      container.scrollTop = newScrollTop;
    });
  }, [currentZoom, viewport]);

  return (
    <div
      ref={scrollContainerRef}
      className="relative h-full w-full overflow-auto"
      role="region"
      aria-label="PDF page container"
    >
      {viewport && (
        <div
          id="canvas-element"
          aria-label="Canvas"
          className="page-wrapper relative mx-auto bg-white"
          style={{
            width: viewport.width,
            height: viewport.height,
          }}
        >
          <Renderer hidden={overlayActive} />
          <Overlay />
        </div>
      )}
    </div>
  );
};

export default Viewer;
