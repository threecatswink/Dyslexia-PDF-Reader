import type { PDFPageProxy } from 'pdfjs-dist';
import type { TextContent } from 'pdfjs-dist/types/src/display/api';

export type PDFTextItem = {
  str: string;
  transform: number[];
  width: number;
  height: number;
  dir?: string;
  fontName?: string;
  hasEOL?: boolean;
};

export type RenderOptions = {
  page: PDFPageProxy;
  container: HTMLDivElement;
  zoom: number;
  overlayFontScale: number;
  accentSize: number;
  currentWordIndex: number;
  sentenceWordStart: number;
  sentenceWordEnd: number;
  halfBoldEnabled: boolean;
  accentEnabled: boolean;
  fontFamily: 'default' | 'opendyslexic' | 'lexend';
  escapeHtml: (s: string) => string;
  textContent?: TextContent;
};

export const renderTextLayer = async ({
  page,
  container,
  zoom,
  overlayFontScale,
  accentSize,
  currentWordIndex,
  sentenceWordStart,
  sentenceWordEnd,
  halfBoldEnabled,
  accentEnabled,
  fontFamily,
  escapeHtml,
  textContent,
}: RenderOptions): Promise<void> => {
  const renderToken = Symbol();
  const containerWithToken = container as unknown as { __renderToken?: symbol };
  containerWithToken.__renderToken = renderToken;

  const viewport = page.getViewport({ scale: zoom });
  const resolvedTextContent = textContent ?? (await page.getTextContent());

  if (containerWithToken.__renderToken !== renderToken) return;

  let wordCounter = 0;
  const fragment = document.createDocumentFragment();
  const seenItems = new Set<string>();
  const round = (value: number) => Math.round(value * 1000) / 1000;

  for (const item of resolvedTextContent.items) {
    if (containerWithToken.__renderToken !== renderToken) return;

    if (!('str' in item)) continue;

    const textItem = item as PDFTextItem;

    if (textItem.str.trim() === '') continue;

    const roundedTransform = textItem.transform.map((value) => round(value));
    const itemKey = `${textItem.str}|${roundedTransform.join(',')}|${round(textItem.width)}|${round(textItem.height)}|${textItem.fontName ?? ''}|${textItem.dir ?? ''}`;
    if (seenItems.has(itemKey)) continue;
    seenItems.add(itemKey);

    const span = document.createElement('span');

    const [x, y] = viewport.convertToViewportPoint(textItem.transform[4], textItem.transform[5]);

    const rawSize = Math.abs(textItem.transform[3]) * zoom;
    const baseScale = fontFamily !== 'default' ? 0.53 : 0.83; // preserves prior visual tuning
    const fontSize = rawSize * baseScale * overlayFontScale;

    span.style.position = 'absolute';
    span.style.left = `${x}px`;
    span.style.top = `${y - fontSize}px`;
    span.style.fontSize = `${fontSize}px`;
    span.style.lineHeight = '1.5';
    span.style.color = '#000';
    span.style.whiteSpace = 'pre';
    if (fontFamily === 'opendyslexic') {
      span.style.fontFamily = 'OpenDyslexic';
    } else if (fontFamily === 'lexend') {
      span.style.fontFamily = 'Lexend';
    } else {
      // Use a readable sans-serif font when no dyslexia font is selected
      span.style.fontFamily = 'Arial, sans-serif';
    }

    const tokens: string[] = textItem.str.split(/(\s+)/);
    const tokenHtml = tokens.map((token: string) => {
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
        // General case: first letter is accented AND bold
        const accented = `<span style="font-size:${fontSize + accentSize}px; font-weight:bold">${escapeHtml(
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

    // Apply TTS highlighting based on global word indices
    const shouldHighlightSentence = sentenceWordStart >= 0 && sentenceWordEnd >= sentenceWordStart;

    let localWordIndex = 0;
    const decoratedTokens = tokenHtml.map((html, idx) => {
      const token = tokens[idx] ?? '';
      const isWord = !/^\s+$/.test(token) && token.length > 0;
      if (!isWord) return html;

      const currentIndex = wordCounter + localWordIndex;
      localWordIndex += 1;

      let style = '';
      const inSentence =
        shouldHighlightSentence &&
        currentIndex >= sentenceWordStart &&
        currentIndex <= sentenceWordEnd;
      const isCurrentWord =
        currentWordIndex >= sentenceWordStart &&
        currentWordIndex <= sentenceWordEnd &&
        currentIndex === currentWordIndex;

      if (inSentence) {
        style = 'background-color: rgba(250, 204, 21, 0.25);'; // amber-300/25
      }
      if (isCurrentWord) {
        style = 'background-color: rgba(74, 222, 128, 0.4);'; // green-300/40 for the active word
      }

      if (!style) return html;
      return `<span style="${style}">${html}</span>`;
    });

    span.innerHTML = decoratedTokens.join('');
    fragment.appendChild(span);

    wordCounter += localWordIndex;
  }

  container.replaceChildren(fragment);
};
