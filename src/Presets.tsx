import { type LucideIcon } from 'lucide-react';
import type { FC } from 'react';

// Button Element Props
interface ButtonElementProps {
  onClick: () => void;
  disabled?: boolean;
  icon: LucideIcon;
  title: string;
  accessKey?: string;
  ariaLabel?: string;
}

// Button Element Component for Referencing
export const ButtonElement: FC<ButtonElementProps> = ({
  onClick,
  disabled,
  icon: Icon,
  title,
  accessKey,
  ariaLabel,
}) => (
  <button
    onClick={onClick}
    title={title}
    disabled={disabled}
    aria-label={ariaLabel}
    accessKey={accessKey}
    className={disabled ? ButtonDisabled : ButtonEnabled}
  >
    <Icon className={ButtonImage} />
  </button>
);

// Button Styling
const ButtonEnabled = `
    px-2.5 py-2.5 rounded flex items-center max-w-full min-w-10 justify-center select-none cursor-pointer
    transition duration-150 ease-in-out
    invert-20 hover:invert-0 hover:scale-110 active:scale-95
`;

const ButtonDisabled = `
    px-2.5 py-2.5 rounded flex items-center max-w-full min-w-10 justify-center select-none cursor-not-allowed
    invert-70 transition duration-150 ease-in-out
`;

const ButtonImage = `
    w-6 h-6
    transition
    duration-150
    ease-in-out
`;
