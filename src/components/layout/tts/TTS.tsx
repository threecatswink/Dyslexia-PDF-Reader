export const tts = {
  speak: (text: string, onBoundary?: (charIndex: number) => void, onEnd?: () => void) => {
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onboundary = (event) => {
      if (typeof event.charIndex === 'number') {
        onBoundary?.(event.charIndex);
      }
    };

    utterance.onend = () => {
      if (onEnd) onEnd;
    };

    window.speechSynthesis.speak(utterance);
  },

  pause() {
    window.speechSynthesis.pause();
  },

  resume() {
    window.speechSynthesis.resume();
  },

  stop() {
    window.speechSynthesis.cancel();
  },

  isSpeaking() {
    return window.speechSynthesis.speaking;
  },
};
