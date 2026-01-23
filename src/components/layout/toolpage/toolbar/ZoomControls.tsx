import { ZoomOut, ZoomIn } from 'lucide-react';
import { useGlobalStates, minZoom, maxZoom } from '../../../../states/global-states.tsx';
import { useFileInformation } from '../../../../states/file-information.tsx';
import { ButtonStyle, InputStyle, SVGStyle } from '../../../../styles/StylePresets.tsx';

const ZoomControls = () => {
  const file = useFileInformation((s) => s.file);

  const currentZoom = useGlobalStates((s) => s.currentZoom);
  const setCurrentZoom = useGlobalStates((s) => s.setCurrentZoom);

  const zoomOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6];
  const hasCustomZoom = !zoomOptions.includes(currentZoom!);

  return (
    <div
      role="group"
      aria-label="Zoom Options"
      className="flex flex-1 flex-nowrap items-center justify-end gap-2 sm:gap-3"
    >
      <span id="zoom-percent-desc" className="sr-only">
        Select zoom percentage
      </span>
      <label htmlFor="zoom-selector" className="sr-only">
        Zoom level
      </label>
      {/* Zoom Out */}
      <button
        className={ButtonStyle}
        disabled={currentZoom <= minZoom || !file}
        onClick={() => setCurrentZoom(currentZoom - 0.25)}
        accessKey="-"
        title="Zoom Out | Access: -"
        aria-label="Zoom Out"
      >
        <ZoomOut className={SVGStyle} />
      </button>

      {/* Zoom Selector */}
      <select
        title="Zoom Amount"
        id="zoom-selector"
        name="zoom-select"
        aria-label="Zoom Selector"
        aria-describedby="zoom-percent-desc"
        value={currentZoom}
        onChange={(e) => setCurrentZoom?.(parseFloat(e.target.value))}
        disabled={!file}
        className={`h-10 w-18 ${InputStyle}`}
      >
        <optgroup label="Preset zoom levels">
          {zoomOptions.map((v) => (
            <option key={v} value={v}>
              {Math.round(v * 100)}%
            </option>
          ))}
        </optgroup>
        {hasCustomZoom && (
          <optgroup label="Current zoom">
            <option value={currentZoom}>{Math.round(currentZoom * 100)}% </option>
          </optgroup>
        )}
      </select>

      {/* Zoom In */}
      <button
        className={ButtonStyle}
        disabled={currentZoom >= maxZoom || !file}
        onClick={() => setCurrentZoom(currentZoom + 0.25)}
        accessKey="="
        title="Zoom In | Access: ="
        aria-label="Zoom In"
      >
        <ZoomIn className={SVGStyle} />
      </button>
    </div>
  );
};

export default ZoomControls;
