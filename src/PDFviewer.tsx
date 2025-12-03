import { useRef, useState, useEffect } from 'react';

import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

import Toolbar from './Toolbar';
import Reader from './Reader';

const PDFViewer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [fileName, setFileName] = useState<string>('');
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [fade, setFade] = useState(false);

  const [canPreviousPage, setCanPreviousPage] = useState(false);
  const [canNextPage, setCanNextPage] = useState(false);

  const [canZoomIn, setCanZoomIn] = useState(false);
  const [canZoomOut, setCanZoomOut] = useState(false);

  const [canSpeak, setCanSpeak] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const [dyslexiaEnabled, setDyslexiaEnabled] = useState(false);
  const [halfBoldEnabled, setHalfBoldEnabled] = useState(false);
  const [accentEnabled, setAccentEnabled] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);

  const minZoom = 0.25;
  const maxZoom = 6;

  const reader = new FileReader();

  // Handle File Select
  const handleFileSelected = (file: File) => {
    setFileName(file.name);
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result as ArrayBuffer);
      const loadedPdf = await pdfjsLib.getDocument(typedArray).promise;
      setPdfDoc(loadedPdf);
      setTotalPages(loadedPdf.numPages);
      setPageNum(1);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSpeakToggle = () => {
    setCanSpeak((s) => !s);
    console.log('Toggled Speak: ', canSpeak);
  };

  // Render PDF page to canvas
  const renderPage = async (num: number) => {
    if (!pdfDoc || !canvasRef.current) return;
    const page = await pdfDoc.getPage(num);
    const viewport = page.getViewport({ scale });

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport, canvas }).promise;

    return { page, viewport };
  };

  // Render Dyslexia Overlay Text
  const renderTextOverlay = async (page: any, viewport: any) => {
    if (!overlayRef.current) return;
    const overlay = overlayRef.current;
    overlay.innerHTML = '';

    const textContent = await page.getTextContent();

    for (const item of textContent.items) {
      const span = document.createElement('span');
      const tx = item.transform[4];
      const ty = item.transform[5];
      const fontSize = (Math.abs(item.transform[3]) * scale) / 1.9;

      const x = tx * scale;
      const y = viewport.height - ty * scale;

      span.style.position = 'absolute';
      span.style.left = `${x}px`;
      span.style.top = `${y - fontSize}px`;
      span.style.fontSize = `${fontSize}px`;
      span.style.fontFamily = 'OpenDyslexic';
      span.style.lineHeight = '1.5';
      span.style.color = '#000';
      span.style.whiteSpace = 'pre';

      const accentSize = 4;
      const tokens = item.str.split(/(\s+)/);
      const words = tokens.map((token: string) => {
        if (/^\s+$/.test(token) || token.length === 0) return token;

        const len = token.length;
        const half = Math.floor(len / 2);
        const isLetter = /\p{L}/u.test(token[0]);

        // Neither
        if (!halfBoldEnabled && !accentEnabled) return token;

        // Accent only
        if (!halfBoldEnabled && accentEnabled) {
          if (len === 1 || !isLetter) {
            return `<span style="font-size:${fontSize + accentSize}px">${escapeHtml(token)}</span>`;
          }
          return `<span style="font-size:${fontSize + accentSize}px">${escapeHtml(token[0])}</span>${escapeHtml(token.slice(1))}`;
        }

        // Half-bold only
        if (halfBoldEnabled && !accentEnabled) {
          if (len <= 2 || !isLetter)
            return `<span style="font-weight:bold">${escapeHtml(token)}</span>`;
          return `<span style="font-weight:bold">${escapeHtml(token.slice(0, half))}</span>${escapeHtml(token.slice(half))}`;
        }

        // Both accent + half-bold
        if (halfBoldEnabled && accentEnabled) {
          if (len === 1 || !isLetter) {
            return `<span style="font-size:${fontSize + accentSize}px; font-weight:bold">${escapeHtml(token)}</span>`;
          }
          if (len === 2) {
            return `<span style="font-size:${fontSize + accentSize}px; font-weight:bold">${escapeHtml(token[0])}</span>${escapeHtml(token[1])}`;
          }
          const accented = `<span style="font-size:${fontSize + accentSize}px">${escapeHtml(token[0])}</span>`;
          const boldPart = `<span style="font-weight:bold">${escapeHtml(token.slice(1, half))}</span>`;
          const rest = escapeHtml(token.slice(half));
          return accented + boldPart + rest;
        }

        return token;
      });

      span.innerHTML = words.join('');
      overlay.appendChild(span);
    }
  };

  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  // Page Rendering Logic
  useEffect(() => {
    if (!pdfDoc) return;

    const doRender = async () => {
      const { page, viewport } = (await renderPage(pageNum)) || {};

      if (!page || !viewport) return;

      // Size overlay to viewport BEFORE rendering text
      if (overlayRef.current) {
        overlayRef.current.style.width = `${viewport.width}px`;
        overlayRef.current.style.height = `${viewport.height}px`;
      }

      // Render overlay
      if (dyslexiaEnabled) {
        await renderTextOverlay(page, viewport);
      }

      setFade(false);
      requestAnimationFrame(() => setFade(true));
    };

    doRender();

    setCanPreviousPage(pageNum > 1);
    setCanNextPage(pageNum < totalPages);

    setCanZoomIn(scale < maxZoom);
    setCanZoomOut(scale > minZoom);
  }, [pdfDoc, pageNum, scale, dyslexiaEnabled, halfBoldEnabled, accentEnabled]);

  return (
    <div className="flex h-screen flex-col text-white">
      <Toolbar
        onFileSelected={handleFileSelected}
        filePathSpan={fileName}
        currentPage={pageNum}
        totalPages={totalPages}
        onPageChange={(p) => setPageNum(Math.min(Math.max(p, 1), totalPages))}
        onPreviousPage={() => setPageNum((p) => Math.max(p - 1, 1))}
        onNextPage={() => setPageNum((p) => Math.min(p + 1, totalPages))}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        onZoomOut={() => setScale((s) => Math.max(s - 0.25, minZoom))}
        onZoomChange={(z) => setScale(z)}
        currentZoom={scale}
        onZoomIn={() => setScale((s) => Math.min(s + 0.25, maxZoom))}
        canZoomIn={canZoomIn}
        canZoomOut={canZoomOut}
        onSpeak={handleSpeakToggle}
        onToggleDyslexiaMode={() => setDyslexiaEnabled((d) => !d)}
        onToggleHalfBold={() => setHalfBoldEnabled((h) => !h)}
        onToggleAccent={() => setAccentEnabled((a) => !a)}
      />

      <div className="flex w-full flex-1 justify-center overflow-auto p-4">
        <div
          className="relative mx-auto"
          style={{ width: canvasRef.current?.width, height: canvasRef.current?.height }}
        >
          {/* PDF Canvas */}
          <canvas
            ref={canvasRef}
            className={`absolute top-0 left-0 transition-opacity duration-300 ${fade && !dyslexiaEnabled ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Overlay */}
          <div
            ref={overlayRef}
            className={`pointer-events-none absolute top-0 left-0 bg-white whitespace-pre text-black ${dyslexiaEnabled ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
        {canSpeak && (
          <div
            className={`pointer-events-auto absolute bottom-6 left-1/2 z-50 -translate-x-1/2 ${canSpeak ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          >
            <Reader
              play={isReading}
              onPlayToggle={() => setIsReading((r) => !r)}
              onForward={() => console.log('forward')}
              onBackward={() => console.log('backward')}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default PDFViewer;
