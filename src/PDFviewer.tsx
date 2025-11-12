import { useRef, useState, useEffect } from "react";

import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

import Toolbar from "./Toolbar";

const PDFViewer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1);

  const [canPreviousPage, setCanPreviousPage] = useState(false)
  const [canNextPage, setCanNextPage] = useState(false)

  const [canZoomIn, setCanZoomIn] = useState(true);
  const [canZoomOut, setCanZoomOut] = useState(true);

  const minZoom = 0.25;
  const maxZoom = 6;

  // Select file
  const handleFileSelected = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result as ArrayBuffer);
      const loadedPdf = await pdfjsLib.getDocument(typedArray).promise;
      setPdfDoc(loadedPdf);
      setTotalPages(loadedPdf.numPages);
      setPageNum(1);
    };
    reader.readAsArrayBuffer(file);
  };

  // Render page
  const renderPage = async (num: number) => {
    if (!pdfDoc || !canvasRef.current) return;
    const page = await pdfDoc.getPage(num);
    const viewport = page.getViewport({ scale });

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = { canvasContext: context, viewport, canvas };
    await page.render(renderContext).promise;
  };

  useEffect(() => {
    if (pdfDoc) renderPage(pageNum);

    setCanPreviousPage(pageNum > 1)
    setCanNextPage(pageNum < totalPages)

    setCanZoomIn(scale < maxZoom);
    setCanZoomOut(scale > minZoom);
  }, [pdfDoc, pageNum, scale]);



  return (
    <div className="flex flex-col h-screen text-white">
      {/* Handle toolbar */}
      <Toolbar
        /* File select handling */
        onFileSelected={handleFileSelected}
        currentPage={pageNum}
        totalPages={totalPages}



        /* Page select handling */
        onPreviousPage={() => setPageNum(p => Math.max(p - 1, 1))}
        onNextPage={() => setPageNum(p => Math.min(p + 1, totalPages))}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}

        /* Zoom handling */
        onZoomOut={() => setScale(s => Math.max(s - 0.25, minZoom))}
        onZoomIn={() => setScale(s => Math.min(s + 0.25, maxZoom))}
        canZoomIn={canZoomIn}
        canZoomOut={canZoomOut}
      />

      {/* Handle PDF canvas */}
      <div className="flex-1 overflow-auto p-4 flex justify-center items-start">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default PDFViewer;