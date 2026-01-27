import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { Speech, MenuIcon } from 'lucide-react';
import { IconWrapper } from '../../../../icons/IconWrapper.tsx';
import { ButtonStyle, SettingsSpanStyle, SVGStyle } from '../../../../../styles/StylePresets.tsx';
import { useFileInformation } from '../../../../../states/file-information.tsx';
import { useGlobalStates } from '../../../../../states/global-states.tsx';

import FontList from '../settings/viewer/FontListBox.tsx';
import HalfBoldToggle from '../settings/viewer/HalfBoldSwitch.tsx';
import AccentLetterToggle from '../settings/viewer/AccentLetterSwitch.tsx';
import TextSettings from '../settings/advanced/TextSettings.tsx';
import Ruler from '../settings/viewer/RulerSwitch.tsx';
import SponsorButton from '../settings/SponsorButton.tsx';

const ViewSettings = () => {
  const file = useFileInformation((s) => s.file);
  const speakEnabled = useGlobalStates((s) => s.speakEnabled);
  const setSpeakEnabled = useGlobalStates((s) => s.setSpeakEnabled);

  const viewerSettingsLabelId = 'viewer-settings-title';

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
        <IconWrapper lucideIcon={<Speech />} fallbackName="speech" className={SVGStyle} />
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
          <IconWrapper lucideIcon={<MenuIcon />} fallbackName="menu" className={SVGStyle} />
        </PopoverButton>

        {/* Settings Panel */}
        <PopoverPanel
          focus
          role="dialog"
          aria-modal="true"
          aria-labelledby={viewerSettingsLabelId}
          transition
          className="absolute top-full right-0 z-10 mt-2.5 w-48 origin-top transform rounded border border-zinc-700 bg-zinc-200 p-2 shadow-lg transition duration-200 ease-in-out data-closed:-translate-y-1 data-closed:opacity-0 dark:bg-zinc-800"
        >
          <span id={viewerSettingsLabelId} className={`${SettingsSpanStyle} text-sm!`}>
            Viewer Settings
          </span>
          <div aria-hidden="true" className="my-2 h-px bg-zinc-300/80 dark:bg-zinc-600" />

          <FontList />

          <HalfBoldToggle />

          <AccentLetterToggle />

          <Ruler />

          <span className={`${SettingsSpanStyle} mt-4! flex! justify-center! text-sm!`}>
            Advanced Settings
          </span>
          <div aria-hidden="true" className="my-2 h-px bg-zinc-300/80 dark:bg-zinc-600" />

          <TextSettings />

          <span aria-hidden="true" className="flex h-5" />
          <SponsorButton />
        </PopoverPanel>
      </Popover>
    </div>
  );
};

export default ViewSettings;
