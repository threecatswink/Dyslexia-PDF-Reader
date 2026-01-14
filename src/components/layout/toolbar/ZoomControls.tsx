import { Button } from '@headlessui/react';
import { ZoomOut, ZoomIn } from 'lucide-react';
import { useGlobalStates, minZoom, maxZoom } from '../../../states/global-states.tsx';
import { useFileInformation } from '../../../states/file-information.tsx';
import { ButtonStyle, InputStyle } from '../../ui/Presets.tsx';

const ZoomControls = () => {
  const file = useFileInformation((s) => s.file);

  const currentZoom = useGlobalStates((s) => s.currentZoom);
  const setCurrentZoom = useGlobalStates((s) => s.setCurrentZoom);

  const zoomOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6];
  const mergedZoomOptions = zoomOptions.includes(currentZoom!)
    ? zoomOptions
    : [...zoomOptions, currentZoom!].sort((a, b) => a - b);

  return (
    <div
      role="group"
      aria-label="Zoom Options"
      className="flex flex-1 items-center justify-end gap-1"
    >
      {/* Zoom Out */}
      <Button
        className={ButtonStyle}
        disabled={currentZoom <= minZoom || !file}
        onClick={() => setCurrentZoom(currentZoom - 0.25)}
        accessKey="-"
        title="Zoom Out | Access: -"
        aria-label="Zoom Out"
      >
        <ZoomOut />
      </Button>

      {/* Zoom Selector */}
      <select
        title="Zoom Amount"
        id="zoom-selector"
        name="zoom-select"
        aria-label="Zoom Selector"
        value={currentZoom}
        onChange={(e) => setCurrentZoom?.(parseFloat(e.target.value))}
        disabled={!file}
        className={`h-10 w-18 ${InputStyle}`}
      >
        {mergedZoomOptions.map((v) => (
          <option key={v} value={v}>
            {Math.round(v * 100)}%
          </option>
        ))}
      </select>

      {/* Zoom In */}
      <Button
        className={ButtonStyle}
        disabled={currentZoom >= maxZoom || !file}
        onClick={() => setCurrentZoom(currentZoom + 0.25)}
        accessKey="="
        title="Zoom In | Access: ="
        aria-label="Zoom In"
      >
        <ZoomIn />
      </Button>
    </div>
  );
};

export default ZoomControls;
