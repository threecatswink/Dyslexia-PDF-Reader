import { useState, useEffect } from 'react';
import { useGlobalStates } from '../../../states/global-states';

const RulerOverlay = () => {
  const rulerEnabled = useGlobalStates((s) => s.rulerEnabled);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!rulerEnabled) return;

    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [rulerEnabled]);

  if (!rulerEnabled) return null;

  const rulerHeight = 60;
  const rulerWidth = '100vw';

  return (
    <>
      {/* Top overlay */}
      <div
        className="pointer-events-none fixed right-0 left-0 bg-black/30"
        style={{
          top: 0,
          height: `${position.y - rulerHeight / 2}px`,
        }}
        aria-hidden="true"
      />

      {/* Bottom overlay */}
      <div
        className="pointer-events-none fixed right-0 bottom-0 left-0 bg-black/30"
        style={{
          top: `${position.y + rulerHeight / 2}px`,
        }}
        aria-hidden="true"
      />

      {/* Clear reading area border (optional visual indicator) */}
      <div
        className="pointer-events-none fixed border-y-2"
        style={{
          top: `${position.y - rulerHeight / 2}px`,
          left: 0,
          width: rulerWidth,
          height: `${rulerHeight}px`,
        }}
        aria-hidden="true"
      />
    </>
  );
};

export default RulerOverlay;
