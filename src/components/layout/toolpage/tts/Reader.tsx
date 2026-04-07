import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { Button, Transition } from '@headlessui/react';
import { useCallback, useEffect, useRef } from 'react';
import { IconWrapper } from '../../../icons/IconWrapper';
import { ButtonStyle, SVGStyle } from '../../../../styles/StylePresets';
import { useGlobalStates } from '../../../../states/global-states';
import { tts } from './TTS.tsx';
import { useFileInformation } from '../../../../states/file-information';

const Reader = () => {
  const playEnabled = useGlobalStates((s) => s.playEnabled);
  const setPlayEnabled = useGlobalStates((s) => s.setPlayEnabled);

  const page = useFileInformation((s) => s.page);
  const setExtractedText = useGlobalStates((s) => s.setExtractedText);

  const speakEnabled = useGlobalStates((s) => s.speakEnabled);
  const isPlayingRef = useRef(false);
  const playTokenRef = useRef(0);

  useEffect(() => {
    isPlayingRef.current = playEnabled;
  }, [playEnabled]);

  const sentences = useGlobalStates((s) => s.sentences);
  const currentSentenceIndex = useGlobalStates((s) => s.currentSentenceIndex);
  const setCurrentSentenceIndex = useGlobalStates((s) => s.setCurrentSentenceIndex);
  const setCurrentWordIndex = useGlobalStates((s) => s.setCurrentWordIndex);
  const setSentenceWordRange = useGlobalStates((s) => s.setSentenceWordRange);

  const clearHighlight = useCallback(() => {
    setCurrentWordIndex(-1);
    setSentenceWordRange(-1, -1);
  }, [setCurrentWordIndex, setSentenceWordRange]);

  useEffect(() => {
    if (!page) return;
    setExtractedText(page);
  }, [page, setExtractedText]);

  useEffect(() => {
    if (speakEnabled) return;
    tts.stop();
    setPlayEnabled(false);
    clearHighlight();
  }, [speakEnabled, setPlayEnabled, clearHighlight]);

  useEffect(() => {
    return () => {
      tts.stop();
      setPlayEnabled(false);
      clearHighlight();
    };
  }, [setPlayEnabled, clearHighlight]);

  const playSentence = (index: number) => {
    if (!sentences || sentences.length === 0) return;
    if (!sentences[index]) return;

    tts.stop();
    playTokenRef.current += 1;
    const token = playTokenRef.current;
    const sentenceText = sentences[index];

    clearHighlight();

    tts.speak(sentenceText, undefined, () => {
      if (playTokenRef.current !== token) return;
      if (!isPlayingRef.current) {
        return;
      }
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

    // If currently speaking, pause
    if (playEnabled && tts.isSpeaking()) {
      tts.pause();
      setPlayEnabled(false);
      return;
    }

    // If paused, resume current utterance
    if (!playEnabled && tts.isPaused()) {
      tts.resume();
      setPlayEnabled(true);
      return;
    }

    // Otherwise start fresh and chain sentences
    playSentence(currentSentenceIndex);
    setPlayEnabled(true);
  };

  const onForward = () => {
    if (!sentences || sentences.length === 0) return;

    tts.stop();
    const nextIndex = Math.min(currentSentenceIndex + 1, sentences.length - 1);
    setCurrentSentenceIndex(nextIndex);
    clearHighlight();
    if (playEnabled) {
      playSentence(nextIndex);
    }
  };

  const onBackward = () => {
    if (!sentences || sentences.length === 0) return;

    tts.stop();
    const prevIndex = Math.max(currentSentenceIndex - 1, 0);
    setCurrentSentenceIndex(prevIndex);
    clearHighlight();
    if (playEnabled) {
      playSentence(prevIndex);
    }
  };

  return (
    <footer role="group" aria-label="Text-to-speech controls" aria-hidden={!speakEnabled}>
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
          className="fixed inset-x-0 bottom-10 z-50 mx-auto mb-2 flex w-fit items-center gap-2 rounded-lg border border-zinc-300/80 bg-zinc-200 p-2 shadow-md duration-500 ease-in-out dark:border-zinc-600 dark:bg-zinc-800"
        >
          <Button
            onClick={onBackward}
            className={ButtonStyle}
            aria-label="Skip backward to the last sentence"
          >
            <IconWrapper lucideIcon={<SkipBack />} fallbackName="skip-back" className={SVGStyle} />
          </Button>

          <Button
            onClick={onPlayPause}
            className={ButtonStyle}
            aria-pressed={playEnabled}
            aria-label={playEnabled ? 'Pause reading' : 'Start reading'}
          >
            {playEnabled ? (
              <IconWrapper lucideIcon={<Pause />} fallbackName="pause" className={SVGStyle} />
            ) : (
              <IconWrapper lucideIcon={<Play />} fallbackName="play" className={SVGStyle} />
            )}
          </Button>

          <Button
            onClick={onForward}
            className={ButtonStyle}
            aria-label="Skip forward to the next sentence"
          >
            <IconWrapper
              lucideIcon={<SkipForward />}
              fallbackName="skip-forward"
              className={SVGStyle}
            />
          </Button>
        </div>
      </Transition>
    </footer>
  );
};

export default Reader;
