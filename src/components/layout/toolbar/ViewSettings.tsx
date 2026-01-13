import { Button, Popover, PopoverButton, PopoverPanel, Switch } from '@headlessui/react';
import { Speech, MenuIcon } from 'lucide-react';
import { ButtonStyle, SwitchStyle, SwitchKnobStyle, SettingsSpanStyle } from '../../ui/Presets.tsx';
import { useFileInformation } from '../../../states/file-information.tsx';
import { useGlobalStates } from '../../../states/global-states.tsx';

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

  return (
    <div role="group" aria-label="View Settings" className="flex items-center justify-end gap-1">
      {/* Screen Reader */}
      <Button
        onClick={() => setSpeakEnabled(!speakEnabled)}
        disabled={!file}
        className={ButtonStyle}
        accessKey="r"
        title="Toggle Read Aloud | Access: r"
        aria-label="Toggle Read Aloud"
      >
        <Speech />
      </Button>

      {/* Dropdown */}
      <Popover className="relative">
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
          transition
          className="absolute right-0 z-50 mt-2.5 w-48 origin-top transform rounded border border-zinc-600 bg-zinc-200 p-2 shadow-lg transition duration-200 ease-in-out data-closed:-translate-y-1 data-closed:opacity-0 dark:bg-zinc-700"
        >
          <div className="flex items-center gap-1 px-1 py-2">
            <Switch
              name="dyslexia-mode"
              checked={dyslexiaEnabled}
              onChange={(v) => setDyslexiaEnabled(v)}
              className={SwitchStyle}
            >
              <span aria-hidden="true" className={SwitchKnobStyle} />
            </Switch>
            <span aria-readonly="true" className={SettingsSpanStyle}>
              OpenDyslexic
            </span>
          </div>

          <div className="flex items-center gap-1 px-1 py-2">
            <span aria-hidden="true" className="px-2" />
            <Switch
              name="half-bold"
              checked={halfBoldEnabled}
              onChange={(v) => setHalfBoldEnabled(v)}
              className={SwitchStyle}
            >
              <span aria-hidden="true" className={SwitchKnobStyle} />
            </Switch>

            <span aria-readonly="true" className={SettingsSpanStyle}>
              Half Bold
            </span>
          </div>

          <div className="flex items-center gap-1 px-1 py-2">
            <span aria-hidden="true" className="px-2" />
            <Switch
              name="accent-letters"
              checked={accentEnabled}
              onChange={(v) => setAccentEnabled(v)}
              className={SwitchStyle}
            >
              <span aria-hidden="true" className={SwitchKnobStyle} />
            </Switch>

            <span aria-readonly="true" className={SettingsSpanStyle}>
              Accent
            </span>
          </div>
          <span aria-hidden="true" className="flex h-5"/>
          <iframe
            src="https://github.com/sponsors/threecatswink/button"
            title="Sponsor threecatswink"
            className="flex justify-right px-1 w-42 h-8"
          />
        </PopoverPanel>
      </Popover>
    </div>
  );
};

export default ViewSettings;
