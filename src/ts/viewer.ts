import { getDocument, GlobalWorkerOptions } from '../../pdfjs/build/pdf.mjs';
import { renderTextOverlay } from './dyslexia.js';

GlobalWorkerOptions.workerSrc = '../../pdfjs/build/pdf.worker.mjs';

// PDF.js objects
let pdfDoc: any = null;
let page: any = null;
let viewport: any = null;
let renderTask: any = null;

let pageNum: number = 1;
let scale: number = 1.5;

// Canvas setup
const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const pageCounter = document.getElementById('page-counter')!;

// Render a page
async function renderPage(num: number) {
  if (!pdfDoc) return;

  page = await pdfDoc.getPage(num);
  viewport = page.getViewport({ scale });

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  if (renderTask) {
    renderTask.cancel();
  }

  renderTask = page.render({ canvasContext: ctx, viewport });

  try {
    await renderTask.promise;
  } catch (err: any) {
    if (err?.name === 'RenderingCancelledException') {
    } else {
      throw err;
    }
  }
  renderTask = null;

  await renderTextOverlay(page, scale);

  updatePageCounter();
}

// Update page counter
function updatePageCounter() {
  if (!pdfDoc) return;
  pageCounter.textContent = `${pageNum} / ${pdfDoc.numPages}`;
}

// File input
const fileInput = document.getElementById('file-input') as HTMLInputElement;
fileInput.addEventListener('change', async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const arrayBuffer = await target.files[0].arrayBuffer();
  pdfDoc = await getDocument({ data: arrayBuffer }).promise;

  pageNum = 1;
  renderPage(pageNum);
});



// Zoom controls
document.getElementById('zoom-in')!.addEventListener('click', () => {
  scale += 0.25;
  if (pdfDoc) renderPage(pageNum);
});
document.getElementById('zoom-out')!.addEventListener('click', () => {
  scale = Math.max(0.25, scale - 0.25);
  if (pdfDoc) renderPage(pageNum);
});

// Page navigation
document.getElementById('prev-page')!.addEventListener('click', () => {
  if (pdfDoc && pageNum > 1) {
    pageNum--;
    renderPage(pageNum);
  }
});
document.getElementById('next-page')!.addEventListener('click', () => {
  if (pdfDoc && pageNum < pdfDoc.numPages) {
    pageNum++;
    renderPage(pageNum);
  }
});



// Background toggle
let bgToggled = false;
document.getElementById('toggle-bg')!.addEventListener('click', () => {
  bgToggled = !bgToggled;
  canvas.style.backgroundColor = bgToggled ? '#f7f7f7' : '#ffffff';
});