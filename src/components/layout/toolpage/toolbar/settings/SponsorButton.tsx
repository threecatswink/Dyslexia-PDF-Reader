import { ButtonStyle } from '../../../../../styles/StylePresets.tsx';
import { SettingsSpanStyle, SVGStyle } from '../../../../../styles/StylePresets.tsx';
import { IconWrapper } from '../../../../icons/IconWrapper.tsx';
import { Heart } from 'lucide-react';

const SponsorButton = () => {
  return (
    <div className="flex items-center justify-center gap-1 px-1 py-1">
      <button
        onClick={() => {
          window.open('https://github.com/sponsors/threecatswink', '_blank', 'noopener,noreferrer');
        }}
        className={ButtonStyle}
        title="Sponsor threecatswink"
        aria-label="Sponsor threecatswink"
      >
        <IconWrapper lucideIcon={<Heart />} fallbackName="heart" className={SVGStyle} />
        <span className={SettingsSpanStyle}>Sponsor</span>
      </button>
    </div>
  );
};

export default SponsorButton;
