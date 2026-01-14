import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { Button, Transition } from '@headlessui/react';
import { ButtonStyle } from '../../ui/Presets.tsx';
import { useGlobalStates } from '../../../states/global-states';
import { tts } from './TTS.tsx';
import { useFileInformation } from '../../../states/file-information.tsx';
import { useEffect } from 'react';

const Reader = () => {
  const playEnabled = useGlobalStates((s) => s.playEnabled);
  const setPlayEnabled = useGlobalStates((s) => s.setPlayEnabled);

  const page = useFileInformation((s) => s.page);
  const setExtractedText = useGlobalStates((s) => s.setExtractedText);

  const speakEnabled = useGlobalStates((s) => s.speakEnabled);

  const sentences = useGlobalStates((s) => s.sentences);
  const currentSentenceIndex = useGlobalStates((s) => s.currentSentenceIndex);
  const setCurrentSentenceIndex = useGlobalStates((s) => s.setCurrentSentenceIndex);

  useEffect(() => {
    if (!page) return;
    setExtractedText(page);
  }, [page]);

  const playSentence = (index: number) => {
    if (!sentences || sentences.length === 0) return;
    if (!sentences[index]) return;

    tts.stop();
    tts.speak(sentences[index], () => {
      const nextIndex = index + 1;
      if (nextIndex < sentences.length) {
        setCurrentSentenceIndex(nextIndex);
        playSentence(nextIndex);
      } else {
        setPlayEnabled(false);
      }
    });
  };

  const onPlayPause = () => {
    if (!sentences || sentences.length === 0) return;

    if (!playEnabled) {
      tts.speak(sentences[currentSentenceIndex]);
    } else {
      tts.pause();
    }

    setPlayEnabled(!playEnabled);
  };

  const onForward = () => {
    if (!sentences || sentences.length === 0) return;

    const nextIndex = Math.min(currentSentenceIndex + 1, sentences.length - 1);
    setCurrentSentenceIndex(nextIndex);
    if (playEnabled) playSentence(nextIndex);
  };

  const onBackward = () => {
    if (!sentences || sentences.length === 0) return;

    tts.stop();
    const prevIndex = Math.max(currentSentenceIndex - 1, 0);
    setCurrentSentenceIndex(prevIndex);
    tts.speak(sentences[prevIndex]);
    setPlayEnabled(true);
  };

  return (
    <footer aria-labelledby="tts-controls" aria-hidden={!speakEnabled}>
      <Transition
        show={speakEnabled}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          id="tts-controls"
          role="group"
          aria-label="Text-to-speech controls"
          className={`fixed inset-x-0 bottom-10 z-50 mx-auto mb-2 flex w-fit items-center gap-1 rounded-full bg-zinc-200 p-1 shadow-xl duration-500 ease-in-out dark:bg-zinc-800`}
        >
          <Button
            onClick={onBackward}
            className={ButtonStyle}
            aria-label="Skip backward to the last sentence"
          >
            <SkipBack />
          </Button>

          <Button
            onClick={onPlayPause}
            className={ButtonStyle}
            aria-pressed={playEnabled}
            aria-label={playEnabled ? 'Pause reading' : 'Start reading'}
          >
            {playEnabled ? <Pause /> : <Play />}
          </Button>

          <Button
            onClick={onForward}
            className={ButtonStyle}
            aria-label="Skip forward to the next sentence"
          >
            <SkipForward />
          </Button>
        </div>
      </Transition>
    </footer>
  );
};

export default Reader;
