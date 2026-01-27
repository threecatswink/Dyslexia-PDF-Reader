import { useEffect, useRef, useState } from 'react';
import { SettingsSpanStyle, InputStyle } from '../../../../../../styles/StylePresets.tsx';
import { useGlobalStates } from '../../../../../../states/global-states.tsx';

const TextSettings = () => {
  const overlayFontScale = useGlobalStates((s) => s.overlayFontScale);
  const setOverlayFontScale = useGlobalStates((s) => s.setOverlayFontScale);

  const [fontScaleInput, setFontScaleInput] = useState(overlayFontScale);
  const fontScaleDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const accentSize = useGlobalStates((s) => s.accentSize);
  const setAccentSize = useGlobalStates((s) => s.setAccentSize);

  const [accentSizeInput, setAccentSizeInput] = useState(accentSize);
  const accentSizeDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setAccentSizeInput(accentSize);
  }, [accentSize]);

  useEffect(() => {
    setFontScaleInput(overlayFontScale);
  }, [overlayFontScale]);

  const fontScaleLabelId = 'font-scale-label';
  const fontScaleDescId = 'font-scale-desc';
  const accentSizeLabelId = 'accent-size-label';
  const accentSizeDescId = 'accent-size-desc';

  return (
    <div className="mt-1 flex flex-col gap-1 rounded-md bg-zinc-50/50 p-2 dark:bg-zinc-800/40">
      <label id={fontScaleLabelId} className={SettingsSpanStyle}>
        Overlay Font Size
      </label>
      <span id={fontScaleDescId} className="sr-only">
        Adjust overlay text scale to align highlights
      </span>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={0.5}
          max={1.8}
          step={0.05}
          value={fontScaleInput}
          aria-labelledby={fontScaleLabelId}
          aria-describedby={fontScaleDescId}
          onChange={(e) => {
            const next = parseFloat(e.target.value);
            setFontScaleInput(next);
            if (fontScaleDebounce.current) clearTimeout(fontScaleDebounce.current);
            fontScaleDebounce.current = setTimeout(() => setOverlayFontScale(next), 50);
          }}
          className="w-full accent-zinc-600 dark:accent-zinc-300"
        />
        <input
          type="number"
          min={0.5}
          max={1.8}
          step={0.05}
          value={fontScaleInput.toFixed(2)}
          onChange={(e) => {
            const parsed = parseFloat(e.target.value);
            if (isNaN(parsed)) return;
            const next = parsed;
            setFontScaleInput(next);
            if (fontScaleDebounce.current) clearTimeout(fontScaleDebounce.current);
            fontScaleDebounce.current = setTimeout(() => setOverlayFontScale(next), 50);
          }}
          aria-labelledby={fontScaleLabelId}
          aria-describedby={fontScaleDescId}
          className={`w-16 text-center ${InputStyle}`}
        />
      </div>

      <div className="mt-2 flex flex-col gap-1 rounded-md bg-zinc-50/50 p-2 dark:bg-zinc-800/40">
        <label id={accentSizeLabelId} className={SettingsSpanStyle}>
          Accent Size
        </label>
        <span id={accentSizeDescId} className="sr-only">
          Adjust first-letter accent size
        </span>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0.25}
            max={12}
            step={0.25}
            value={accentSizeInput}
            aria-labelledby={accentSizeLabelId}
            aria-describedby={accentSizeDescId}
            onChange={(e) => {
              const next = parseFloat(e.target.value);
              setAccentSizeInput(next);
              if (accentSizeDebounce.current) clearTimeout(accentSizeDebounce.current);
              accentSizeDebounce.current = setTimeout(() => setAccentSize(next), 50);
            }}
            className="w-full accent-zinc-600 dark:accent-zinc-300"
          />
          <input
            type="number"
            min={0.25}
            max={12}
            step={0.25}
            value={accentSizeInput.toFixed(2)}
            onChange={(e) => {
              const parsed = parseFloat(e.target.value);
              if (isNaN(parsed)) return;
              const next = parsed;
              setAccentSizeInput(next);
              if (accentSizeDebounce.current) clearTimeout(accentSizeDebounce.current);
              accentSizeDebounce.current = setTimeout(() => setAccentSize(next), 50);
            }}
            aria-labelledby={accentSizeLabelId}
            aria-describedby={accentSizeDescId}
            className={`w-16 text-center ${InputStyle}`}
          />
        </div>
      </div>
    </div>
  );
};

export default TextSettings;
