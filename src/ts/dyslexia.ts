let dyslexiaEnabled = false;
let halfBoldEnabled = false;
let accentLetterEnabled = false;

// Elements
const overlay = document.createElement('div');
overlay.id = 'pdf-overlay';
overlay.style.position = 'absolute';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.justifyContent = 'center';
overlay.style.pointerEvents = 'none';
overlay.style.whiteSpace = 'pre';
overlay.style.backgroundColor = 'white';
overlay.style.zIndex = '10000';
overlay.style.display = 'none';
document.querySelector('.body-canvas')!.appendChild(overlay);

const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
const bodyCanvas = document.querySelector('.body-canvas') as HTMLElement;

// Dyslexia Mode
const toggleCheckbox = document.getElementById('toggle-dyslexia') as HTMLInputElement;
toggleCheckbox.addEventListener('change', () => {
  dyslexiaEnabled = toggleCheckbox.checked;
  applyDyslexiaMode(dyslexiaEnabled);
});

// Half Bold
const toggleHalfBold = document.getElementById("toggle-half-bold") as HTMLInputElement;
toggleHalfBold.addEventListener("click", () => {
  halfBoldEnabled = toggleHalfBold.checked;
});

const toggleAccent = document.getElementById("toggle-letter-accent") as HTMLInputElement;
toggleAccent.addEventListener("click", () => {
  accentLetterEnabled = toggleAccent.checked;
});

function applyDyslexiaMode(enabled: boolean) {
  if (enabled) {
    document.body.classList.add('dyslexia-mode');
    document.body.style.backgroundColor = 'white';
    bodyCanvas.style.backgroundColor = 'white';
    canvas.style.display = 'none';
    overlay.style.display = 'inline-block';
    overlay.style.position = 'relative';
  } else {
    document.body.classList.remove('dyslexia-mode');
    document.body.style.backgroundColor = '#272727';
    bodyCanvas.style.backgroundColor = '#272727';
    canvas.style.display = 'inline-block';
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

  const canvasRect = canvas.getBoundingClientRect();
  overlay.style.top = `${canvasRect.top + window.scrollY}px`;
  overlay.style.left = `${canvasRect.left + window.scrollX}px`;

  for (const item of textContent.items) {
    const span = document.createElement('span');
    const tx = item.transform[4];
    const ty = item.transform[5];
    const fontSize = Math.abs(item.transform[3]) * scale / 1.9;
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

    const a = item.transform[0];
    const b = item.transform[1];
    const c = item.transform[2];
    const d = item.transform[3];

    const isVertical = Math.abs(b) > 0.01 || Math.abs(c) > 0.01;
    if (isVertical) {
      span.innerText = item.str;
      overlay.appendChild(span);
      continue;
    }

    const accentSize = 4;
    const tokens = item.str.split(/(\s+)/);
    const words = tokens.map((token: string) => {
      if (/^\s+$/.test(token) || token.length === 0) return token;
      const isLetter = /\p{L}/u.test(token[0]);

      const len = token.length;
      const half = Math.floor(len / 2);

      // Neither
      if (!halfBoldEnabled && !accentLetterEnabled) return token;

      // Accent
      if (!halfBoldEnabled && accentLetterEnabled) {
        if (len === 1 || !isLetter) {
          return `<span style="font-size:${fontSize + accentSize}px">${escapeHtml(token)}</span>`;
        }
        return `<span style="font-size:${fontSize + accentSize}px">${escapeHtml(token[0])}</span>${escapeHtml(token.slice(1))}`;
      }

      // Half-bold
      if (halfBoldEnabled && !accentLetterEnabled) {
        if (len <= 2 || !isLetter) {
          return `<span style="font-weight:bold">${escapeHtml(token)}</span>`;
        }
        return `<span style="font-weight:bold">${escapeHtml(token.slice(0, half))}</span>${escapeHtml(token.slice(half))}`;
      }

      // Both
      if (len === 1 || !isLetter) {
        return `<span style="font-size:${fontSize + accentSize}px; font-weight:bold">${escapeHtml(token)}</span>`;
      }

      if (len === 2) {
        return `<span style="font-size:${fontSize + accentSize}px; font-weight:bold">${escapeHtml(token[0])}</span>` +
         `${escapeHtml(token[1])}`;
      }

      const accented = `<span style="font-size:${fontSize + accentSize}px">${escapeHtml(token[0])}</span>`;
      const boldPart = `<span style="font-weight:bold">${escapeHtml(token.slice(1, half))}</span>`;
      const rest = escapeHtml(token.slice(half));
      return accented + boldPart + rest;
    });

    span.innerHTML = words.join('');
    overlay.appendChild(span);
  }
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function isDyslexiaEnabled() {
  return dyslexiaEnabled;
}