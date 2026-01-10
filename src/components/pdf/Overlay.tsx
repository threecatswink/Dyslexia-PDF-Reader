import { useEffect, useRef } from 'react';
import { useFileInformation } from '../../states/file-information';
import { useGlobalStates } from '../../states/global-states';
import { renderTextLayer } from './TextHelper';

const Overlay = () => {
  const overlayRef = useRef<HTMLDivElement>(null);

  const page = useFileInformation((s) => s.page);
  const viewport = useFileInformation((s) => s.viewport);

  const currentZoom = useGlobalStates((s) => s.currentZoom);
  const dyslexiaEnabled = useGlobalStates((s) => s.dyslexiaEnabled);

  useEffect(() => {
    const container = overlayRef.current;
    if (!container || !page || !viewport) return;
    container.innerHTML = '';

    if (!dyslexiaEnabled) {
      container.replaceChildren();
      return;
    }


    container.style.width = `${viewport.width}px`;
    container.style.height = `${viewport.height}px`;

    renderTextLayer({
      page,
      container,
      viewportHeight: viewport.height,
      zoom: currentZoom,
    });
  }, [page, viewport, currentZoom, dyslexiaEnabled]);

  useEffect(() => {
    return () => {
      overlayRef.current?.replaceChildren();
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none absolute top-0 left-0 transition-opacity duration-200 bg-white"
      style={{ opacity: dyslexiaEnabled ? 1 : 0 }}
    />
  );
};

export default Overlay;