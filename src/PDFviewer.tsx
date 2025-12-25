import { useRef, useState, useEffect } from 'react';

import * as pdfjsLib from 'pdfjs-dist';
import { getDocument } from 'pdfjs-dist';
import type { PDFPageProxy, PageViewport } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

import { currentZoom } from './Toolbar';
import { UseFileInformation } from './FileInformation.tsx';

export const dyslexiaEnabled = false;
export const halfBoldEnabled = false;
export const accentEnabled = false;

const PDFViewer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [fade, setFade] = useState(false);

  const setTotalPages = UseFileInformation((s) => s.setCurrentPage);
  const file = UseFileInformation((s) => s.file);
  const loadedFileRef = useRef<File | null>(null);

  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Render PDF page to canvas
  const renderPage = async (num: number) => {
    if (!pdfDoc || !canvasRef.current) return;
    const page = await pdfDoc.getPage(num);
    const viewport = page.getViewport({ scale: currentZoom });

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport, canvas }).promise;

    return { page, viewport };
  };

  // Render Dyslexia Overlay Text
  const renderTextOverlay = async (page: PDFPageProxy, viewport: PageViewport) => {
    if (!overlayRef.current) return;
    const overlay = overlayRef.current;
    overlay.innerHTML = '';

    const textContent = await page.getTextContent();

    for (const item of textContent.items) {
      if (!('str' in item)) continue;
      const span = document.createElement('span');
      const tx = item.transform[4];
      const ty = item.transform[5];
      const fontSize = (Math.abs(item.transform[3]) * currentZoom) / 1.9;

      const x = tx * currentZoom;
      const y = viewport.height - ty * currentZoom;

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
    if (!file || loadedFileRef.current === file) return;
    loadedFileRef.current = file;

    const load = async () => {
      const reader = new FileReader();

      reader.onload = async () => {
        const data = reader.result;
        if (!data) return;

        const pdf = await getDocument({ data }).promise;
        setTotalPages(pdf.numPages);
        setPdfDoc(pdf);
        setPageNum(1);
      };

      reader.readAsArrayBuffer(file);
    };

    load();

    const doRender = async () => {
      const { page, viewport } = (await renderPage(pageNum)) || {};

      if (!page || !viewport) return;

      // Size overlay to viewport before rendering text
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
  }, [file, setTotalPages, pdfDoc, pageNum, renderPage, renderTextOverlay]);

  return (
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
  );
};
export default PDFViewer;
