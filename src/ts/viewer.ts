import { getDocument, GlobalWorkerOptions } from '../../pdfjs/build/pdf.mjs';
import { renderTextOverlay, isDyslexiaEnabled } from './dyslexia.js';

GlobalWorkerOptions.workerSrc = '../../pdfjs/build/pdf.worker.mjs';

// PDF.js objects
let pdfDoc: any = null;
let page: any = null;
let viewport: any = null;
let renderTask: any = null;

let pageNum: number = 0;
let scale: number = 1.0;

// Zoom limits and step
const MIN_SCALE = 0.25;
const MAX_SCALE = 6.0;
const ZOOM_STEP = 0.25;

// Canvas Setup
const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
canvas.style.display = "none";
const ctx = canvas.getContext('2d')!;

// Page Numbers
const pageTotal = document.getElementById('page-total') as HTMLElement;
const currentPage = document.getElementById('page-number') as HTMLInputElement;

// Render Page
async function renderPage(num: number) {
  if (!pdfDoc) return;

  if (!isDyslexiaEnabled()) {
    canvas.style.display = "inline-block";
  } else {
    canvas.style.display = "none";
  }

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

  updatePageTotal();
}

// Left Toolbar

// File Select Button
const fileButton = document.getElementById("select-file") as HTMLButtonElement;
fileButton.addEventListener("click", () => {
  fileInput.click();
});

// File Name Display
const fileInput = document.getElementById("file-input") as HTMLInputElement;
const filePath = document.getElementById("file-path") as HTMLElement;
fileInput.addEventListener('change', async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];
  filePath.textContent = file.name;

  const arrayBuffer = await file.arrayBuffer();
  pdfDoc = await getDocument({ data: arrayBuffer }).promise;

  pageNum = 1;

  updateZoomDisplay(scale);
  renderPage(pageNum);
  updatePageInput();
});

// Center Toolbar

// Previous Page Button
document.getElementById('prev-page')!.addEventListener('click', () => {
  if (pdfDoc && pageNum > 1) {
    pageNum--;
    renderPage(pageNum);
    updatePageInput();
  }
});

// Select Page
currentPage.addEventListener("change", () => {
  let page = parseInt(currentPage.value);
  if (page < 1) page = 1;
  if (page > pdfDoc.numPages) page = pdfDoc.numPages;

  updatePageInput();
});

// Next Page Button
document.getElementById('next-page')!.addEventListener('click', () => {
  if (pdfDoc && pageNum < pdfDoc.numPages) {
    pageNum++;
    renderPage(pageNum);
    updatePageInput();
  }
});

// Page Number Selector
currentPage.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    const desiredPage = parseInt(currentPage.value, 10);

    if (isNaN(desiredPage) || !pdfDoc) {
      updatePageInput();
      return;
    }

    const clamped = Math.max(1, Math.min(desiredPage, pdfDoc.numPages));

    pageNum = clamped;
    renderPage(pageNum);
  }
});

// Left Toolbar

// Zoom In Button
document.getElementById('zoom-in')!.addEventListener('click', () => {
  scale = Math.min(MAX_SCALE, scale + ZOOM_STEP);
  updateZoomDisplay(scale);
  if (pdfDoc) renderPage(pageNum);
});

// Change Zoom Selector
const zoomSelect = document.getElementById("zoom-select") as HTMLSelectElement;
zoomSelect.addEventListener("change", () => {
  const parsed = parseFloat(zoomSelect.value);
  if (isNaN(parsed)) return;
  scale = Math.max(MIN_SCALE, Math.min(parsed, MAX_SCALE));
  updateZoomDisplay(scale);
  if (pdfDoc) renderPage(pageNum);
});

// Zoom Out Button
document.getElementById('zoom-out')!.addEventListener('click', () => {
  scale = Math.max(MIN_SCALE, scale - ZOOM_STEP);
  updateZoomDisplay(scale);
  if (pdfDoc) renderPage(pageNum);
});

// Settings Dropdown
const settingsButton = document.getElementById("settings") as HTMLButtonElement;
const dropdown = document.querySelector(".settings-dropdown") as HTMLDivElement;

settingsButton.addEventListener("click", (event) => {
  event.stopPropagation();

  const isOpen = dropdown.style.display === "flex";
  dropdown.style.display = isOpen ? "none" : "flex";

  if (!isOpen) {
    const rect = settingsButton.getBoundingClientRect();
    const dropdownWidth = 180;
    const dropdownHeight = dropdown.offsetHeight;

    let top = rect.bottom + window.scrollY;
    let left = rect.left + window.scrollX;

    if (left + dropdownWidth > window.innerWidth) {
      left = window.innerWidth - dropdownWidth - 50;
    }

    if (top + dropdownHeight > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - dropdownHeight;
    }

    dropdown.style.position = "absolute";
    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;
  }
});

document.addEventListener("click", () => {
  dropdown.style.display = "none";
});

dropdown.addEventListener("click", (event) => {
  event.stopPropagation();
});

// Dyslexia Mode
const toggleCheckbox = document.getElementById('toggle-dyslexia') as HTMLInputElement;
toggleCheckbox.addEventListener('change', () => {
  renderPage(pageNum);
});

// Half Bold
const toggleHalfBold = document.getElementById("toggle-half-bold") as HTMLInputElement;
toggleHalfBold.addEventListener("click", () => {
  renderPage(pageNum);
});

// Accent Letter
const toggleAccent = document.getElementById("toggle-letter-accent") as HTMLInputElement;
toggleAccent.addEventListener("click", () => {
  renderPage(pageNum);
});

function updatePageTotal() {
  if (!pdfDoc) return;
  pageTotal.textContent = `/ ${pdfDoc.numPages}`;
}

function updatePageInput() {
  currentPage.value = pageNum.toString();
}

function updateZoomDisplay(scale: number) {
  const val = scale.toString();

  zoomSelect.value = val;

  if (zoomSelect.value !== val) {
    let dyn = zoomSelect.querySelector('option[data-dynamic]') as HTMLOptionElement | null;
    const label = `${Math.round(scale * 100)}%`;
    if (!dyn) {
      dyn = document.createElement('option');
      dyn.setAttribute('data-dynamic', 'true');
      zoomSelect.appendChild(dyn);
    }
    dyn.value = val;
    dyn.text = label;
    dyn.selected = true;
  } else {
    const prev = zoomSelect.querySelector('option[data-dynamic]') as HTMLOptionElement | null;
    if (prev) prev.remove();
  }
}