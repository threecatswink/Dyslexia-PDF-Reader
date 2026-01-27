import { Switch } from '@headlessui/react';
import {
  SwitchStyle,
  SwitchKnobStyle,
  SettingsSpanStyle,
} from '../../../../../../styles/StylePresets.tsx';
import { useGlobalStates } from '../../../../../../states/global-states.tsx';

const HalfBoldToggle = () => {
  const halfBoldEnabled = useGlobalStates((s) => s.halfBoldEnabled);
  const setHalfBoldEnabled = useGlobalStates((s) => s.setHalfBoldEnabled);

  const halfBoldLabelId = 'half-bold-label';

  return (
    <div className="flex items-center gap-1 px-1 py-2">
      <Switch
        name="half-bold"
        checked={halfBoldEnabled}
        onChange={(v) => setHalfBoldEnabled(v)}
        className={SwitchStyle}
        aria-labelledby={halfBoldLabelId}
        aria-label="Half Bold"
      >
        <span aria-hidden="true" className={SwitchKnobStyle} />
      </Switch>

      <span id={halfBoldLabelId} className={SettingsSpanStyle}>
        Half Bold
      </span>
    </div>
  );
};

export default HalfBoldToggle;
