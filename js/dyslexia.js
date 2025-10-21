let dyslexiaEnabled = false;
let bgToggled = false;
// Elements
const overlay = document.createElement('div');
overlay.id = 'pdf-overlay';
overlay.style.position = 'absolute';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.pointerEvents = 'none';
overlay.style.whiteSpace = 'pre';
document.body.appendChild(overlay);
const toggleButton = document.getElementById('toggle-dyslexia');
const bgButton = document.getElementById('toggle-bg');
const canvas = document.getElementById('pdf-canvas');
// Toggle Dyslexia Mode
toggleButton.addEventListener('click', () => {
    dyslexiaEnabled = !dyslexiaEnabled;
    document.body.classList.toggle('dyslexia-mode', dyslexiaEnabled);
    overlay.style.display = dyslexiaEnabled ? 'block' : 'none';
});
// Toggle background color
bgButton.addEventListener('click', () => {
    bgToggled = !bgToggled;
    canvas.style.backgroundColor = bgToggled ? '#f7f7f7' : '#ffffff';
    overlay.style.backgroundColor = bgToggled ? '#f7f7f7' : 'transparent';
});
// Function to render text overlay on top of the canvas
export async function renderTextOverlay(page, scale) {
    overlay.innerHTML = ''; // clear previous content
    if (!dyslexiaEnabled) {
        overlay.style.display = 'none';
        return;
    }
    overlay.style.display = 'block';
    const textContent = await page.getTextContent();
    for (const item of textContent.items) {
        const span = document.createElement('span');
        span.textContent = item.str;
        // PDF.js uses a transform matrix [a, b, c, d, e, f]
        const [a, b, c, d, e, f] = item.transform;
        const x = e * scale;
        const y = f * scale - item.height * scale; // adjust vertical
        const fontSize = item.height * scale;
        span.style.position = 'absolute';
        span.style.left = `${x}px`;
        span.style.top = `${y}px`;
        span.style.fontSize = `${fontSize}px`;
        span.style.lineHeight = '1';
        overlay.appendChild(span);
    }
    // Match overlay size to canvas
    overlay.style.width = `${canvas.width}px`;
    overlay.style.height = `${canvas.height}px`;
}
//# sourceMappingURL=dyslexia.js.map