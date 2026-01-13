import { useEffect, useRef } from 'react';
import { useFileInformation } from '../../states/file-information';
import { useGlobalStates } from '../../states/global-states';
import { renderTextLayer } from './overlay_components/TextHelper';

const Overlay = () => {
  const overlayRef = useRef<HTMLDivElement>(null);

  const page = useFileInformation((s) => s.page);
  const viewport = useFileInformation((s) => s.viewport);
  const zoom = useGlobalStates((s) => s.currentZoom);

  const dyslexiaEnabled = useGlobalStates((s) => s.dyslexiaEnabled);
  const halfBoldEnabled = useGlobalStates((s) => s.halfBoldEnabled);
  const accentEnabled = useGlobalStates((s) => s.accentEnabled);

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

    if (!dyslexiaEnabled) {
      container.replaceChildren();
      return;
    }

    renderTextLayer({
      page,
      container,
      zoom,
      halfBoldEnabled,
      accentEnabled,
      escapeHtml,
    });
  }, [page, viewport, zoom, dyslexiaEnabled, halfBoldEnabled, accentEnabled]);

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none absolute top-0 left-0"
      style={{ opacity: dyslexiaEnabled ? 1 : 0 }}
    />
  );
};

export default Overlay;
