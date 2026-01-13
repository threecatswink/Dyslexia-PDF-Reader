import { useEffect, useRef } from 'react';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import type { RenderTask } from 'pdfjs-dist/types/src/display/api';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';

import { useFileInformation } from '../../states/file-information';
import { useGlobalStates } from '../../states/global-states';

GlobalWorkerOptions.workerSrc = pdfjsWorker;

const Renderer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const page = useFileInformation((s) => s.page);
  const viewport = useFileInformation((s) => s.viewport);
  const currentZoom = useGlobalStates((s) => s.currentZoom);

  useEffect(() => {
    if (!canvasRef.current || !page || !viewport) return;

    let renderTask: RenderTask | null = null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const pageViewport = page.getViewport({ scale: currentZoom });

    renderTask = page.render({
      canvas,
      canvasContext: ctx,
      viewport: pageViewport,
    });

    renderTask.promise.catch((err) => {
      if (err?.name !== 'RenderingCancelledException') {
        console.error(err);
      }
    });

    return () => {
      renderTask?.cancel();
    };
  }, [page, viewport, currentZoom]);

  return <canvas ref={canvasRef} className="block transition-opacity duration-200" />;
};

export default Renderer;