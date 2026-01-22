let currentUtterance: SpeechSynthesisUtterance | null = null;

export const tts = {
  speak: (
    text: string,
    onBoundary?: (charIndex: number, boundaryType: SpeechSynthesisEvent['name']) => void,
    onEnd?: () => void
  ) => {
    if (!window.speechSynthesis) return null;

    // Always cancel queued/active utterances before starting a new one
    window.speechSynthesis.cancel();
    currentUtterance = null;

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onboundary = (event) => {
      if (typeof event.charIndex === 'number') {
        onBoundary?.(event.charIndex, event.name);
      }
    };

    utterance.onend = () => {
      currentUtterance = null;
      onEnd?.();
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return utterance;
  },

  pause() {
    if (!currentUtterance) return;
    window.speechSynthesis.pause();
  },

  resume() {
    if (!currentUtterance) return;
    window.speechSynthesis.resume();
  },

  stop() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    currentUtterance = null;
  },

  isSpeaking() {
    return !!window.speechSynthesis && window.speechSynthesis.speaking;
  },

  isPaused() {
    return !!window.speechSynthesis && window.speechSynthesis.paused;
  },
};
