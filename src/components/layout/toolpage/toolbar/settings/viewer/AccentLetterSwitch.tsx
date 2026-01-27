import { Switch } from '@headlessui/react';
import {
  SwitchStyle,
  SwitchKnobStyle,
  SettingsSpanStyle,
} from '../../../../../../styles/StylePresets.tsx';
import { useGlobalStates } from '../../../../../../states/global-states.tsx';

const AccentLetterToggle = () => {
  const accentEnabled = useGlobalStates((s) => s.accentEnabled);
  const setAccentEnabled = useGlobalStates((s) => s.setAccentEnabled);

  const accentLabelId = 'accent-label';

  return (
    <>
      <div className="flex items-center gap-1 px-1 py-2">
        <Switch
          name="accent-letters"
          checked={accentEnabled}
          onChange={(v) => setAccentEnabled(v)}
          className={SwitchStyle}
          aria-labelledby={accentLabelId}
          aria-label="Accent Letters"
        >
          <span aria-hidden="true" className={SwitchKnobStyle} />
        </Switch>

        <span id={accentLabelId} className={SettingsSpanStyle}>
          Accent
        </span>
      </div>
    </>
  );
};

export default AccentLetterToggle;
