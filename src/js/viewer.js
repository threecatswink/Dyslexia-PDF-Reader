import { getDocument, GlobalWorkerOptions } from '../../pdfjs/build/pdf.mjs';
import { renderTextOverlay } from './dyslexia.js';
GlobalWorkerOptions.workerSrc = '../../pdfjs/build/pdf.worker.mjs';
// PDF.js objects
let pdfDoc = null;
let page = null;
let viewport = null;
let renderTask = null;
let pageNum = 1;
let scale = 1.5;
// Canvas Setup
const canvas = document.getElementById('pdf-canvas');
canvas.style.display = "none";
const ctx = canvas.getContext('2d');
// Page Numbers
const pageTotal = document.getElementById('page-total');
const currentPage = document.getElementById('page-number');
// Render Page
async function renderPage(num) {
    if (!pdfDoc)
        return;
    canvas.style.display = "block";
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
    }
    catch (err) {
        if (err?.name === 'RenderingCancelledException') {
        }
        else {
            throw err;
        }
    }
    renderTask = null;
    await renderTextOverlay(page, scale);
    updatePageTotal();
}
// Left Toolbar
// File Select Button
const fileButton = document.getElementById("select-file");
fileButton.addEventListener("click", () => {
    fileInput.click();
});
// File Name Display
const fileInput = document.getElementById("file-input");
const filePath = document.getElementById("file-path");
fileInput.addEventListener('change', async (e) => {
    const target = e.target;
    if (!target.files || target.files.length === 0)
        return;
    const file = target.files[0];
    filePath.textContent = file.name;
    const arrayBuffer = await file.arrayBuffer();
    pdfDoc = await getDocument({ data: arrayBuffer }).promise;
    pageNum = 1;
    renderPage(pageNum);
    updatePageInput();
});
// Center Toolbar
// Previous Page Button
document.getElementById('prev-page').addEventListener('click', () => {
    if (pdfDoc && pageNum > 1) {
        pageNum--;
        renderPage(pageNum);
        updatePageInput();
    }
});
// Select Page
currentPage.addEventListener("change", () => {
    let page = parseInt(currentPage.value);
    if (page < 1)
        page = 1;
    if (page > pdfDoc.numPages)
        page = pdfDoc.numPages;
    updatePageInput();
});
// Next Page Button
document.getElementById('next-page').addEventListener('click', () => {
    if (pdfDoc && pageNum < pdfDoc.numPages) {
        pageNum++;
        renderPage(pageNum);
        updatePageInput();
    }
});
// Page Number Selector
currentPage.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        let desiredPage = parseInt(currentPage.value, pdfDoc.numPages);
        if (isNaN(desiredPage)) {
            updatePageInput();
            return;
        }
        // Clamp to valid range
        desiredPage = Math.max(1, Math.min(desiredPage, parseInt(currentPage.value)));
        pageNum = desiredPage;
        renderPage(pageNum);
    }
});
// Left Toolbar
// Zoom In Button
document.getElementById('zoom-in').addEventListener('click', () => {
    scale += 0.25;
    if (pdfDoc)
        renderPage(pageNum);
});
// Change Zoom Selector
const zoomSelect = document.getElementById("zoom-select");
zoomSelect.addEventListener("change", () => {
    const scale = parseFloat(zoomSelect.value);
    pdfDoc.currentScale = scale;
});
// Zoom Out Button
document.getElementById('zoom-out').addEventListener('click', () => {
    scale = Math.max(0.25, scale - 0.25);
    if (pdfDoc)
        renderPage(pageNum);
});
// Settings Dropdown
const settingsButton = document.getElementById("settings");
const dropdown = document.querySelector(".settings-dropdown");
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
function updatePageTotal() {
    if (!pdfDoc)
        return;
    pageTotal.textContent = `/ ${pdfDoc.numPages}`;
}
function updatePageInput() {
    currentPage.value = pageNum.toString();
}
function updateZoomDisplay(scale) {
    zoomSelect.value = scale.toString();
}
//# sourceMappingURL=viewer.js.map