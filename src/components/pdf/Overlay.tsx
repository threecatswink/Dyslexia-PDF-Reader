import { useEffect, useRef } from 'react';
import { useFileInformation } from '../../states/file-information';
import { useGlobalStates } from '../../states/global-states';
import { renderTextLayer } from './TextHelper';
import type { PDFPageProxy } from 'pdfjs-dist';
import type { TextContent } from 'pdfjs-dist/types/src/display/api';

const Overlay = () => {
  const overlayRef = useRef<HTMLDivElement>(null);

  const page = useFileInformation((s) => s.page);
  const viewport = useFileInformation((s) => s.viewport);
  const zoom = useGlobalStates((s) => s.currentZoom);
  const overlayFontScale = useGlobalStates((s) => s.overlayFontScale);
  const accentSize = useGlobalStates((s) => s.accentSize);
  const currentWordIndex = useGlobalStates((s) => s.currentWordIndex);
  const sentenceWordStart = useGlobalStates((s) => s.sentenceWordStart);
  const sentenceWordEnd = useGlobalStates((s) => s.sentenceWordEnd);

  const textContentCache = useRef<{ page: PDFPageProxy | null; content: TextContent } | null>(null);

  const dyslexiaEnabled = useGlobalStates((s) => s.dyslexiaEnabled);
  const halfBoldEnabled = useGlobalStates((s) => s.halfBoldEnabled);
  const accentEnabled = useGlobalStates((s) => s.accentEnabled);
  const settingsVersion = useGlobalStates((s) => s.settingsVersion);

  // Overlay should render if any feature is enabled or TTS highlight is active
  const ttsHighlightActive = currentWordIndex >= 0 || sentenceWordStart >= 0;
  const shouldRenderOverlay =
    dyslexiaEnabled || halfBoldEnabled || accentEnabled || ttsHighlightActive;

  const escapeHtml = (s: string) => {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  };

  useEffect(() => {
    const container = overlayRef.current;
    if (!container || !page || !viewport) return;

    container.style.width = `${viewport.width}px`;
    container.style.height = `${viewport.height}px`;

    if (!shouldRenderOverlay) {
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';
      return;
    }

    const useCached = textContentCache.current?.page === page;

    const render = async () => {
      const content = useCached ? textContentCache.current!.content : await page.getTextContent();

      if (!useCached) {
        textContentCache.current = { page, content };
      }

      // Ensure DOM sizing is committed before rendering text layer for immediate update
      requestAnimationFrame(() => {
        renderTextLayer({
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
          openDyslexicEnabled: dyslexiaEnabled,
          escapeHtml,
          textContent: content,
        });
        container.style.opacity = '1';
        container.style.pointerEvents = 'auto';
      });
    };

    render();
  }, [
    page,
    viewport,
    zoom,
    overlayFontScale,
    accentSize,
    currentWordIndex,
    sentenceWordStart,
    sentenceWordEnd,
    dyslexiaEnabled,
    halfBoldEnabled,
    accentEnabled,
    shouldRenderOverlay,
    settingsVersion,
  ]);

  return (
    <div
      role="img"
      aria-label="Overlay for the PDF"
      aria-hidden={!shouldRenderOverlay}
      ref={overlayRef}
      className="absolute top-0 left-0 select-text"
      style={{
        opacity: shouldRenderOverlay ? 1 : 0,
        pointerEvents: shouldRenderOverlay ? 'auto' : 'none',
      }}
    />
  );
};

export default Overlay;
