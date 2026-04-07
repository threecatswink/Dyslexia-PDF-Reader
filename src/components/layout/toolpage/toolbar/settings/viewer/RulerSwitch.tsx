import { Switch } from '@headlessui/react';
import {
  SwitchStyle,
  SwitchKnobStyle,
  SettingsSpanStyle,
} from '../../../../../../styles/StylePresets';
import { useGlobalStates } from '../../../../../../states/global-states';

const RulerToggle = () => {
  const rulerEnabled = useGlobalStates((s) => s.rulerEnabled);
  const setRulerEnabled = useGlobalStates((s) => s.setRulerEnabled);

  const rulerLabelId = 'ruler-label';

  return (
    <div className="flex items-center gap-1 px-1 py-2">
      <Switch
        name="ruler"
        checked={rulerEnabled}
        onChange={(v) => setRulerEnabled(v)}
        className={SwitchStyle}
        aria-labelledby={rulerLabelId}
        aria-label="Ruler"
      >
        <span aria-hidden="true" className={SwitchKnobStyle} />
      </Switch>

      <span id={rulerLabelId} className={SettingsSpanStyle}>
        Ruler
      </span>
    </div>
  );
};

export default RulerToggle;
