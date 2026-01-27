import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { Check } from 'lucide-react';
import { IconWrapper } from '../../../../../icons/IconWrapper.tsx';
import { SettingsSpanStyle } from '../../../../../../styles/StylePresets.tsx';
import { useGlobalStates } from '../../../../../../states/global-states.tsx';

const FontList = () => {
  const fontFamily = useGlobalStates((s) => s.fontFamily);
  const setFontFamily = useGlobalStates((s) => s.setFontFamily);

  const fontOptions = [
    { value: 'default' as const, label: 'Standard', fontFamily: 'inherit' },
    { value: 'opendyslexic' as const, label: 'OpenDyslexic', fontFamily: 'OpenDyslexic' },
    { value: 'lexend' as const, label: 'Lexend', fontFamily: 'Lexend' },
  ];

  const getCurrentFontLabel = () =>
    fontOptions.find((opt) => opt.value === fontFamily)?.label || 'Standard';
  const getCurrentFontFamily = () =>
    fontOptions.find((opt) => opt.value === fontFamily)?.fontFamily || 'inherit';

  const openDyslexicLabelId = 'open-dyslexic-label';

  return (
    <>
      <span id={openDyslexicLabelId} className={`${SettingsSpanStyle} items-center px-1`}>
        Font Family
      </span>
      <div className="flex items-center gap-1 px-1 py-2">
        <Listbox value={fontFamily} onChange={setFontFamily}>
          <div className="relative">
            <ListboxButton
              className="w-40 rounded border border-zinc-400 bg-zinc-100 px-2 py-1 text-left text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
              aria-labelledby={openDyslexicLabelId}
              style={{ fontFamily: getCurrentFontFamily() }}
            >
              {getCurrentFontLabel()}
            </ListboxButton>
            <ListboxOptions
              className="absolute top-full right-0 left-0 z-9999 mt-1 rounded border border-zinc-400 bg-zinc-100 shadow-lg dark:border-zinc-600 dark:bg-zinc-700"
              portal={false}
            >
              {fontOptions.map((option) => (
                <ListboxOption
                  key={option.value}
                  value={option.value}
                  className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-600"
                  style={{ fontFamily: option.fontFamily }}
                >
                  {({ selected }) => (
                    <>
                      {selected && (
                        <IconWrapper
                          lucideIcon={<Check />}
                          fallbackName="check"
                          className="h-4 w-4"
                        />
                      )}
                      {!selected && <span className="w-4" />}
                      <span>{option.label}</span>
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>
    </>
  );
};

export default FontList;
