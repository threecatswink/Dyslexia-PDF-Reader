import { type FC } from 'react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { Button } from '@headlessui/react';
import { ButtonStyle } from './Presets.tsx';

export const setSpeak = false;

interface ReaderProps {
  play: boolean;
  onPlayToggle: () => void;
  onForward: () => void;
  onBackward: () => void;
}

const Reader: FC<ReaderProps> = ({ play, onPlayToggle, onForward, onBackward }) => {
  return (
    <footer>
      <ul className="mx-auto mb-2 flex w-fit items-center justify-center gap-1 rounded-full bg-zinc-200 p-1 text-black shadow-lg dark:bg-zinc-800 dark:text-white">
        {/* Backward */}
        <Button
          onClick={onBackward}
          className={ButtonStyle}
          accessKey="b"
          title="Backward | Alt + b"
          aria-label="Backward"
        >
          <SkipBack />
        </Button>

        {/* Play / Pause */}
        <Button
          onClick={onPlayToggle}
          className={ButtonStyle}
          accessKey="p"
          title="Play / Pause | Alt + p"
          aria-label={play ? 'Pause' : 'Play'}
        >
          {play ? <Pause /> : <Play />}
        </Button>

        {/* Forward */}
        <Button
          onClick={onForward}
          className={ButtonStyle}
          accessKey="f"
          title="Forward | Alt + f"
          aria-label="Forward"
        >
          <SkipForward />
        </Button>
      </ul>
    </footer>
  );
};
export default Reader;
