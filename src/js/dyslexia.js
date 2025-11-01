let dyslexiaEnabled = false;
let halfBoldEnabled = false;
// Elements
const overlay = document.createElement('div');
overlay.id = 'pdf-overlay';
overlay.style.position = 'absolute';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.justifyContent = 'Center';
overlay.style.pointerEvents = 'none';
overlay.style.whiteSpace = 'pre';
document.querySelector('.body-canvas').appendChild(overlay);
const canvas = document.getElementById('pdf-canvas');
const bodyCanvas = document.querySelector('.body-canvas');
// Dyslexia Mode
const toggleCheckbox = document.getElementById('toggle-dyslexia');
toggleCheckbox.addEventListener('change', () => {
    dyslexiaEnabled = toggleCheckbox.checked;
    applyDyslexiaMode(dyslexiaEnabled);
});
// Half Bold
const toggleHalfBold = document.getElementById("toggle-half-bold");
toggleHalfBold.addEventListener("click", () => {
    halfBoldEnabled = toggleHalfBold.checked;
});
function applyDyslexiaMode(enabled) {
    if (enabled) {
        document.body.classList.add('dyslexia-mode');
        document.body.style.backgroundColor = 'white';
        bodyCanvas.style.backgroundColor = 'white';
        canvas.style.display = 'none';
        overlay.style.display = 'block';
    }
    else {
        document.body.classList.remove('dyslexia-mode');
        document.body.style.backgroundColor = '#272727';
        bodyCanvas.style.backgroundColor = '#272727';
        canvas.style.display = 'block';
        overlay.style.display = 'none';
    }
}
export async function renderTextOverlay(page, scale) {
    // Hide the canvas during dyslexia mode
    if (dyslexiaEnabled) {
        canvas.style.display = 'none';
    }
    overlay.innerHTML = '';
    if (!dyslexiaEnabled)
        return;
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale });
    // Match overlay to canvas
    overlay.style.width = `${viewport.width}px`;
    overlay.style.height = `${viewport.height}px`;
    overlay.style.position = 'relative';
    const canvasRect = canvas.getBoundingClientRect();
    overlay.style.top = `${canvasRect.top + window.scrollY}px`;
    overlay.style.left = `${canvasRect.left + window.scrollX}px`;
    // Track spans per line to detect overlaps
    const lineMap = {};
    for (const item of textContent.items) {
        const span = document.createElement('span');
        const tx = item.transform[4];
        const ty = item.transform[5];
        const fontSize = Math.abs(item.transform[3]) * scale / 1.8;
        const x = tx * scale;
        const y = viewport.height - ty * scale;
        span.style.position = 'absolute';
        span.style.left = `${x}px`;
        span.style.top = `${y - fontSize}px`;
        span.style.fontSize = `${fontSize}px`;
        span.style.fontFamily = "OpenDyslexic";
        span.style.lineHeight = '1.5';
        span.style.color = '#000';
        span.style.whiteSpace = 'pre';
        if (halfBoldEnabled) {
            const words = item.str.split(" ").map((word) => {
                const half = Math.floor(word.length / 2);
                const firstHalf = word.slice(0, half);
                const secondHalf = word.slice(half);
                return `<span style="font-weight: bold">${firstHalf}</span>${secondHalf}`;
            });
            span.innerHTML = words.join(" ");
        }
        else {
            span.textContent = item.str;
        }
        overlay.appendChild(span);
    }
}
//# sourceMappingURL=dyslexia.js.map