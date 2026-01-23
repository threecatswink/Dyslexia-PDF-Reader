import { useEffect, useRef, useState } from 'react';
import { Popover, PopoverButton, PopoverPanel, Switch } from '@headlessui/react';
import { Speech, MenuIcon, Heart } from 'lucide-react';
import {
  ButtonStyle,
  SwitchStyle,
  SwitchKnobStyle,
  SettingsSpanStyle,
  SVGStyle,
  InputStyle,
} from '../../../../styles/StylePresets.tsx';
import { useFileInformation } from '../../../../states/file-information.tsx';
import { useGlobalStates } from '../../../../states/global-states.tsx';

const ViewSettings = () => {
  const file = useFileInformation((s) => s.file);

  const dyslexiaEnabled = useGlobalStates((s) => s.dyslexiaEnabled);
  const setDyslexiaEnabled = useGlobalStates((s) => s.setDyslexiaEnabled);

  const halfBoldEnabled = useGlobalStates((s) => s.halfBoldEnabled);
  const setHalfBoldEnabled = useGlobalStates((s) => s.setHalfBoldEnabled);

  const accentEnabled = useGlobalStates((s) => s.accentEnabled);
  const setAccentEnabled = useGlobalStates((s) => s.setAccentEnabled);

  const speakEnabled = useGlobalStates((s) => s.speakEnabled);
  const setSpeakEnabled = useGlobalStates((s) => s.setSpeakEnabled);
  const overlayFontScale = useGlobalStates((s) => s.overlayFontScale);
  const setOverlayFontScale = useGlobalStates((s) => s.setOverlayFontScale);
  const accentSize = useGlobalStates((s) => s.accentSize);
  const setAccentSize = useGlobalStates((s) => s.setAccentSize);

  const [fontScaleInput, setFontScaleInput] = useState(overlayFontScale);
  const [accentSizeInput, setAccentSizeInput] = useState(accentSize);

  const fontScaleDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accentSizeDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setFontScaleInput(overlayFontScale);
  }, [overlayFontScale]);

  useEffect(() => {
    setAccentSizeInput(accentSize);
  }, [accentSize]);

  const viewerSettingsLabelId = 'viewer-settings-title';
  const openDyslexicLabelId = 'open-dyslexic-label';
  const halfBoldLabelId = 'half-bold-label';
  const accentLabelId = 'accent-label';
  const fontScaleLabelId = 'font-scale-label';
  const fontScaleDescId = 'font-scale-desc';
  const accentSizeLabelId = 'accent-size-label';
  const accentSizeDescId = 'accent-size-desc';

  return (
    <div
      role="group"
      aria-label="View Settings"
      className="flex flex-nowrap items-center justify-end gap-2 sm:gap-3"
    >
      {/* Screen Reader */}
      <button
        onClick={() => setSpeakEnabled(!speakEnabled)}
        aria-pressed={speakEnabled}
        disabled={!file}
        className={ButtonStyle}
        accessKey="r"
        title="Toggle Read Aloud | Access: r"
        aria-label="Toggle Read Aloud"
      >
        <Speech className={SVGStyle} />
      </button>

      {/* Dropdown */}
      <Popover className="relative" role="dialog" aria-label="Settings menu">
        {/* Settings Button */}
        <PopoverButton
          className={ButtonStyle}
          accessKey="s"
          title="Settings | Access: s"
          aria-label="Settings"
        >
          <MenuIcon />
        </PopoverButton>

        {/* Settings Panel */}
        <PopoverPanel
          focus
          role="dialog"
          aria-modal="true"
          aria-labelledby={viewerSettingsLabelId}
          transition
          className="absolute top-full right-0 z-50 mt-2.5 w-48 origin-top transform rounded border border-zinc-600 bg-zinc-200 p-2 shadow-lg transition duration-200 ease-in-out data-closed:-translate-y-1 data-closed:opacity-0 dark:bg-zinc-700"
        >
          <span id={viewerSettingsLabelId} className={`${SettingsSpanStyle} text-sm!`}>
            Viewer Settings
          </span>
          <div aria-hidden="true" className="my-2 h-px bg-zinc-300/80 dark:bg-zinc-600" />

          <div className="flex items-center gap-1 px-1 py-2">
            <Switch
              name="dyslexia-mode"
              checked={dyslexiaEnabled}
              onChange={(v) => setDyslexiaEnabled(v)}
              className={SwitchStyle}
              aria-labelledby={openDyslexicLabelId}
            >
              <span aria-hidden="true" className={SwitchKnobStyle} />
            </Switch>
            <span id={openDyslexicLabelId} className={SettingsSpanStyle}>
              OpenDyslexic
            </span>
          </div>

          <div className="flex items-center gap-1 px-1 py-2">
            <Switch
              name="half-bold"
              checked={halfBoldEnabled}
              onChange={(v) => setHalfBoldEnabled(v)}
              className={SwitchStyle}
              aria-labelledby={halfBoldLabelId}
            >
              <span aria-hidden="true" className={SwitchKnobStyle} />
            </Switch>

            <span id={halfBoldLabelId} className={SettingsSpanStyle}>
              Half Bold
            </span>
          </div>

          <div className="flex items-center gap-1 px-1 py-2">
            <Switch
              name="accent-letters"
              checked={accentEnabled}
              onChange={(v) => setAccentEnabled(v)}
              className={SwitchStyle}
              aria-labelledby={accentLabelId}
            >
              <span aria-hidden="true" className={SwitchKnobStyle} />
            </Switch>

            <span id={accentLabelId} className={SettingsSpanStyle}>
              Accent
            </span>
          </div>

          <span className={`${SettingsSpanStyle} mt-4! flex! justify-center! text-sm!`}>
            Advanced Settings
          </span>
          <div aria-hidden="true" className="my-2 h-px bg-zinc-300/80 dark:bg-zinc-600" />

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
          <span aria-hidden="true" className="flex h-5" />
          <div className="flex items-center justify-center gap-1 px-1 py-1">
            <button
              onClick={() => {
                window.open(
                  'https://github.com/sponsors/threecatswink',
                  '_blank',
                  'noopener,noreferrer'
                );
              }}
              className={ButtonStyle}
              title="Sponsor threecatswink"
              aria-label="Sponsor threecatswink"
            >
              <Heart className={SVGStyle} />
              <span aria-label="Label for sponsor button" className={SettingsSpanStyle}>
                Sponsor
              </span>
            </button>
          </div>
        </PopoverPanel>
      </Popover>
    </div>
  );
};

export default ViewSettings;
