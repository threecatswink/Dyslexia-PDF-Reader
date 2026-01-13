import type { PDFPageProxy } from 'pdfjs-dist';

export type PDFTextItem = {
  str: string;
  transform: number[];
};

export type RenderOptions = {
  page: PDFPageProxy;
  container: HTMLDivElement;
  zoom: number;
  halfBoldEnabled: boolean;
  accentEnabled: boolean;
  escapeHtml: (s: string) => string;
};

export const renderTextLayer = async ({
  page,
  container,
  zoom,
  halfBoldEnabled,
  accentEnabled,
  escapeHtml,
}: RenderOptions): Promise<void> => {
  const renderToken = Symbol();
  (container as any).__renderToken = renderToken;

  container.replaceChildren();

  const viewport = page.getViewport({ scale: zoom });
  const textContent = await page.getTextContent();

  if ((container as any).__renderToken !== renderToken) return;

  for (const item of textContent.items) {
    if ((container as any).__renderToken !== renderToken) return;

    if (!('str' in item)) continue;

    const textItem = item as PDFTextItem;

    const span = document.createElement('span');

    const [x, y] = viewport.convertToViewportPoint(textItem.transform[4], textItem.transform[5]);

    const fontSize = (Math.abs(textItem.transform[3]) * zoom) / 1.9;

    span.style.position = 'absolute';
    span.style.left = `${x}px`;
    span.style.top = `${y - fontSize}px`;
    span.style.fontSize = `${fontSize}px`;
    span.style.fontFamily = 'OpenDyslexic';
    span.style.lineHeight = '1.5';
    span.style.color = '#000';
    span.style.whiteSpace = 'pre';

    const accentSize = 4;

    const tokens: string[] = textItem.str.split(/(\s+)/);
    const words = tokens.map((token: string) => {
      if (/^\s+$/.test(token) || token.length === 0) return token;

      const len = token.length;
      const half = Math.floor(len / 2);
      const isLetter = /\p{L}/u.test(token[0]);

      if (!halfBoldEnabled && !accentEnabled) {
        return escapeHtml(token);
      }

      if (!halfBoldEnabled && accentEnabled) {
        if (len === 1 || !isLetter) {
          return `<span style="font-size:${fontSize + accentSize}px">${escapeHtml(token)}</span>`;
        }
        return `<span style="font-size:${fontSize + accentSize}px">${escapeHtml(
          token[0]
        )}</span>${escapeHtml(token.slice(1))}`;
      }

      if (halfBoldEnabled && !accentEnabled) {
        if (len <= 2 || !isLetter) {
          return `<span style="font-weight:bold">${escapeHtml(token)}</span>`;
        }
        return `<span style="font-weight:bold">${escapeHtml(
          token.slice(0, half)
        )}</span>${escapeHtml(token.slice(half))}`;
      }

      if (halfBoldEnabled && accentEnabled) {
        if (len === 1 || !isLetter) {
          return `<span style="font-size:${fontSize + accentSize}px; font-weight:bold">${escapeHtml(
            token
          )}</span>`;
        }
        if (len === 2) {
          return `<span style="font-size:${fontSize + accentSize}px; font-weight:bold">${escapeHtml(
            token[0]
          )}</span>${escapeHtml(token[1])}`;
        }

        const accented = `<span style="font-size:${fontSize + accentSize}px">${escapeHtml(
          token[0]
        )}</span>`;
        const boldPart = `<span style="font-weight:bold">${escapeHtml(
          token.slice(1, half)
        )}</span>`;
        const rest = escapeHtml(token.slice(half));

        return accented + boldPart + rest;
      }

      return escapeHtml(token);
    });
    span.innerHTML = words.join('');
    container.appendChild(span);
  }
};
