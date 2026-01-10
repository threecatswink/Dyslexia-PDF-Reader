import type { PDFPageProxy } from 'pdfjs-dist';

export async function renderTextLayer({
  page,
  container,
  viewportHeight,
  zoom,
  fontFamily = 'OpenDyslexic',
}: {
  page: PDFPageProxy;
  container: HTMLElement;
  viewportHeight: number;
  zoom: number;
  fontFamily?: string;
}) {
  container.replaceChildren();

  const textContent = await page.getTextContent();

  for (const item of textContent.items) {
    if (!('str' in item)) continue;

    const span = document.createElement('span');
    const [, , , scaleY, tx, ty] = item.transform;

    const fontSize = (Math.abs(scaleY) * zoom) / 1.9;
    const x = tx * zoom;
    const y = viewportHeight - ty * zoom;

    span.textContent = item.str; // SAFE, no HTML injection
    span.style.position = 'absolute';
    span.style.left = `${x}px`;
    span.style.top = `${y - fontSize}px`;
    span.style.fontSize = `${fontSize}px`;
    span.style.fontFamily = fontFamily;
    span.style.lineHeight = '1.5';
    span.style.whiteSpace = 'pre';
    span.style.color = '#000';

    container.appendChild(span);
  }
}
