import { useEffect, useRef } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useFileInformation, type OutlineItem } from '../../states/file-information';
import { useGlobalStates } from '../../states/global-states';
import Renderer from './Renderer';
import Overlay from './Overlay';

/**
 * Recursively processes PDF.js outline items and resolves page numbers
 */
const processOutlineItems = async (
  items: Record<string, unknown>[],
  pdfDoc: PDFDocumentProxy
): Promise<OutlineItem[]> => {
  const processed: OutlineItem[] = [];

  for (const item of items) {
    let pageNumber = 1; // Default fallback

    // Try to resolve the page number from the destination
    const itemDest = item.dest;
    if (itemDest && typeof itemDest === 'string') {
      const pageRef = await pdfDoc.getDestination(itemDest);
      if (pageRef && pageRef[0] !== undefined) {
        const pageIndex = await pdfDoc.getPageIndex(pageRef[0]);
        pageNumber = pageIndex + 1;
      }
    } else if (itemDest && Array.isArray(itemDest)) {
      const pageIndex = await pdfDoc.getPageIndex(itemDest[0]);
      pageNumber = pageIndex + 1;
    }

    const outlineItem: OutlineItem = {
      title: (item.title as string) || 'Untitled',
      page: pageNumber,
    };

    // Recursively process children
    const itemChildren = item.items as Record<string, unknown>[] | undefined;
    if (itemChildren && itemChildren.length > 0) {
      outlineItem.children = await processOutlineItems(itemChildren, pdfDoc);
    }

    processed.push(outlineItem);
  }

  return processed;
};

const Viewer = () => {
  const file = useFileInformation((s) => s.file);
  const setTotalPages = useFileInformation((s) => s.setTotalPages);
  const setOutline = useFileInformation((s) => s.setOutline);
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

      // Extract outline/bookmarks
      try {
        const outline = await pdfDoc.getOutline();
        if (outline && outline.length > 0) {
          const processedOutline = await processOutlineItems(outline, pdfDoc);
          setOutline(processedOutline);
        }
      } catch {
        // Some PDFs don't have an outline, which is fine
        setOutline([]);
      }
    })();
  }, [file, resetPdf, setPDF, setTotalPages, setOutline]);

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
