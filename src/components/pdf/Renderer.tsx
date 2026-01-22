import { useEffect, useRef, useState } from 'react';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import type { RenderTask } from 'pdfjs-dist/types/src/display/api';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';

import { useFileInformation } from '../../states/file-information';
import { useGlobalStates } from '../../states/global-states';

GlobalWorkerOptions.workerSrc = pdfjsWorker;

type RendererProps = {
  hidden: boolean;
};

const Renderer = ({ hidden }: RendererProps) => {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const bufferCanvasRef = useRef<HTMLCanvasElement>(null);
  const [activeCanvas, setActiveCanvas] = useState<'main' | 'buffer'>('main');
  const renderTaskRef = useRef<RenderTask | null>(null);
  const activeCanvasRef = useRef<'main' | 'buffer'>('main');

  const page = useFileInformation((s) => s.page);
  const viewport = useFileInformation((s) => s.viewport);
  const currentZoom = useGlobalStates((s) => s.currentZoom);

  // Keep ref in sync with state
  useEffect(() => {
    activeCanvasRef.current = activeCanvas;
  }, [activeCanvas]);

  useEffect(() => {
    if (!page || !viewport) return;

    // Cancel any ongoing render
    renderTaskRef.current?.cancel();

    // Determine which canvas to render to (use the non-visible one)
    const currentActive = activeCanvasRef.current;
    const targetCanvas = currentActive === 'main' ? bufferCanvasRef.current : mainCanvasRef.current;
    if (!targetCanvas) return;

    const ctx = targetCanvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Use device pixel ratio for rendering high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    const pageViewport = page.getViewport({ scale: currentZoom * dpr });

    // Set canvas internal resolution (high-res)
    targetCanvas.width = pageViewport.width;
    targetCanvas.height = pageViewport.height;

    // Scale context to match DPR
    ctx.scale(dpr, dpr);

    renderTaskRef.current = page.render({
      canvas: targetCanvas,
      canvasContext: ctx,
      viewport: page.getViewport({ scale: currentZoom }),
    });

    renderTaskRef.current.promise
      .then(() => {
        // Render complete - swap to the newly rendered canvas
        setActiveCanvas(currentActive === 'main' ? 'buffer' : 'main');
      })
      .catch((err) => {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Render error:', err);
        }
      });

    return () => {
      renderTaskRef.current?.cancel();
    };
  }, [page, viewport, currentZoom]);

  return (
    <div
      className="absolute inset-0"
      aria-label="PDF Renderer"
      aria-hidden={hidden}
      style={{ visibility: hidden ? 'hidden' : 'visible', pointerEvents: hidden ? 'none' : 'auto' }}
    >
      <canvas
        ref={mainCanvasRef}
        aria-label="PDF Canvas"
        className="absolute top-0 left-0"
        style={{
          display: activeCanvas === 'main' ? 'block' : 'none',
          width: viewport ? `${viewport.width}px` : 'auto',
          height: viewport ? `${viewport.height}px` : 'auto',
        }}
      />
      <canvas
        ref={bufferCanvasRef}
        aria-label="PDF Canvas"
        className="absolute top-0 left-0"
        style={{
          display: activeCanvas === 'buffer' ? 'block' : 'none',
          width: viewport ? `${viewport.width}px` : 'auto',
          height: viewport ? `${viewport.height}px` : 'auto',
        }}
      />
    </div>
  );
};

export default Renderer;
