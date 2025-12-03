import { type FC } from 'react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { ButtonElement } from './Presets.tsx';

interface ReaderProps {
  play: boolean;
  onPlayToggle: () => void;
  onForward: () => void;
  onBackward: () => void;
}

const Reader: FC<ReaderProps> = ({ play, onPlayToggle, onForward, onBackward }) => {
  return (
    <div className="mx-auto mb-2 flex w-fit items-center justify-center gap-1 rounded-full bg-zinc-800 p-1 shadow-lg">
      {/* Backward */}
      <ButtonElement
        onClick={onBackward}
        title="Backward"
        ariaLabel="Backward the reader"
        accessKey="B"
        icon={SkipBack}
      />

      {/* Play / Pause */}
      <ButtonElement
        onClick={onPlayToggle}
        title={play ? 'Pause' : 'Play'}
        ariaLabel={play ? 'Pause the reader' : 'Play the reader'}
        accessKey="P"
        icon={play ? Pause : Play}
      />

      {/* Forward */}
      <ButtonElement
        onClick={onForward}
        title="Forward"
        ariaLabel="Forward the reader"
        accessKey="F"
        icon={SkipForward}
      />
    </div>
  );
};
export default Reader;
