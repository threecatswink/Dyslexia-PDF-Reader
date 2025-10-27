let dyslexiaEnabled = false;

// Elements
const overlay = document.createElement('div');
overlay.id = 'pdf-overlay';
overlay.style.position = 'absolute';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.justifyContent = 'Center';
overlay.style.pointerEvents = 'none';
overlay.style.whiteSpace = 'pre';
document.querySelector('.body-canvas')!.appendChild(overlay);

const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
const bodyCanvas = document.querySelector('.body-canvas') as HTMLElement;

const toggleCheckbox = document.getElementById('toggle-dyslexia') as HTMLInputElement;
toggleCheckbox.addEventListener('change', () => {
  dyslexiaEnabled = toggleCheckbox.checked;
  applyDyslexiaMode(dyslexiaEnabled);
});

function applyDyslexiaMode(enabled: boolean) {
  if (enabled) {
    document.body.classList.add('dyslexia-mode');
    document.body.style.backgroundColor = 'white';
    bodyCanvas.style.backgroundColor = 'white';
    canvas.style.display = 'none';
    overlay.style.display = 'block';
  } else {
    document.body.classList.remove('dyslexia-mode');
    document.body.style.backgroundColor = '#272727';
    bodyCanvas.style.backgroundColor = '#272727';
    canvas.style.display = 'block';
    overlay.style.display = 'none';
  }
}

export async function renderTextOverlay(page: any, scale: number) {
  // Hide the canvas during dyslexia mode
  if (dyslexiaEnabled) {
    canvas.style.display = 'none';
  }

  overlay.innerHTML = '';
  if (!dyslexiaEnabled) return;

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
  const lineMap: Record<number, HTMLElement[]> = {};

  for (const item of textContent.items) {
    const span = document.createElement('span');
    span.textContent = item.str;

    const tx = item.transform[4];
    const ty = item.transform[5];
    const fontSize = Math.abs(item.transform[3]) * scale / 1.8;
    const x = tx * scale;
    const y = viewport.height - ty * scale;

    span.style.position = 'absolute';
    span.style.left = `${x}px`;
    span.style.top = `${y - fontSize}px`;
    span.style.fontSize = `${fontSize}px`;
    span.style.fontFamily = "'OpenDyslexic', Arial, sans-serif";
    span.style.lineHeight = '1.5';
    span.style.color = '#000';
    span.style.whiteSpace = 'pre';

    overlay.appendChild(span);
  }
}