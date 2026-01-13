import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useFileInformation } from './file-information.tsx';
import type { PDFPageProxy } from 'pdfjs-dist';
import type { PDFTextItem } from '../components/pdf/overlay_components/TextHelper.tsx';

/** The maximum possible zoom value. */
export const maxZoom = 6;
/** The minimum possible zoom value. */
export const minZoom = 0.25;

type GlobalState = {
  /** Enables the OpenDyslexic font overlay */
  dyslexiaEnabled: boolean;
  /** Enables half bolded words */
  halfBoldEnabled: boolean;
  /** Enables increasing font size for the first letter of words. */
  accentEnabled: boolean;
  /** Enables a screen reader to read words aloud. */
  speakEnabled: boolean;
  /** Current page number. */
  currentPage: number;
  /** Current zoom number (float typically in increments of 0.25). */
  currentZoom: number;
  /** Whether the reader is reading. */
  playEnabled: boolean;
  /** The text from the page. */
  extractedText: string;
  /** List of sentences. */
  sentences: string[];
  /** Current sentence number. */
  currentSentenceIndex: number;

  /** Sets dyslexiaEnabled to true/false. */
  setDyslexiaEnabled: (state: boolean) => void;
  /** Sets halfBoldEnabled to true/false. */
  setHalfBoldEnabled: (state: boolean) => void;
  /** Sets accentEnabled to true/false. */
  setAccentEnabled: (state: boolean) => void;
  /** Sets speakEnabled to true/false. */
  setSpeakEnabled: (state: boolean) => void;
  /** Set playEnabled to true/false. */
  setPlayEnabled: (state: boolean) => void;
  /** Sets the currentSentenceIndex. */
  setCurrentSentenceIndex: (index: number) => void;

  /**
   * @description Sets the current page to view.
   * @param {number} page - Number page to set currentPage to.
   * ! Page will not be set if outside of range.
   */
  setCurrentPage: (page: number) => void;

  /**
   * @description Sets the current zoom level for the PDF.
   * @param {number} zoom - The new zoom to apply.
   * ! Zoom will not set if outside of minZoom and maxZoom.
   */
  setCurrentZoom: (zoom: number) => void;

  /** Reset current page and zoom. */
  reset: () => void;

  setExtractedText: (page: PDFPageProxy) => void;
};

/**
 * @description Stores the global states for the web app.
 * @param set - Sets values.
 */
export const useGlobalStates = create<GlobalState>()(
  persist(
    (set) => ({
      dyslexiaEnabled: false,
      halfBoldEnabled: false,
      accentEnabled: false,
      speakEnabled: false,
      playEnabled: false,
      currentPage: 1,
      currentZoom: 1,

      extractedText: '',
      sentences: [],
      currentSentenceIndex: 0,

      setDyslexiaEnabled: (dyslexiaEnabled) => set({ dyslexiaEnabled }),
      setHalfBoldEnabled: (halfBoldEnabled) => set({ halfBoldEnabled }),
      setAccentEnabled: (accentEnabled) => set({ accentEnabled }),
      setSpeakEnabled: (speakEnabled) => set({ speakEnabled }),
      setPlayEnabled: (playEnabled) => set({ playEnabled }),
      setCurrentSentenceIndex: (currentSentenceIndex) => set({ currentSentenceIndex }),

      setCurrentPage: (page) => {
        const totalPages = useFileInformation.getState().totalPages;
        if (page > totalPages) set({ currentPage: totalPages });
        else if (page < 1) set({ currentPage: 1 });
        else set({ currentPage: page });
      },

      setCurrentZoom: (zoom) => {
        if (zoom < minZoom || zoom > maxZoom) return;
        set({ currentZoom: zoom });
      },

      reset: () =>
        set({
          currentPage: 1,
          currentZoom: 1,
          extractedText: '',
          sentences: [],
          currentSentenceIndex: 0,
        }),

      setExtractedText: async (page) => {
        const content = await page.getTextContent();
        const text = (content.items as PDFTextItem[])
          .map((item) => item.str)
          .join(' ');

        const sentences =
          text.match(/[^.!?]+[.!?]+[\])'"`’”]*|.+$/g) || [];

        set({
          extractedText: text,
          sentences,
          currentSentenceIndex: 0,
        });
      },
    }),
    {
      name: 'global-reader-state',
      version: 1,

      partialize: (state) => ({
        dyslexiaEnabled: state.dyslexiaEnabled,
        halfBoldEnabled: state.halfBoldEnabled,
        accentEnabled: state.accentEnabled,
      }),
    }
  )
);