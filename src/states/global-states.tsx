import { create } from 'zustand';
import { useFileInformation } from './file-information.tsx';

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
  /** Current page number */
  currentPage: number;
  /** Current zoom number (float typically in increments of 0.25) */
  currentZoom: number;

  /** Sets dyslexiaEnabled to true/false. */
  setDyslexiaEnabled: (state: boolean) => void;
  /** Sets halfBoldEnabled to true/false. */
  setHalfBoldEnabled: (state: boolean) => void;
  /** Sets accentEnabled to true/false. */
  setAccentEnabled: (state: boolean) => void;
  /** Sets speakEnabled to true/false. */
  setSpeakEnabled: (state: boolean) => void;

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
};

/**
 * @description Stores the global states for the web app.
 * @param set
 */
export const useGlobalStates = create<GlobalState>((set) => ({
  dyslexiaEnabled: false,
  halfBoldEnabled: false,
  accentEnabled: false,
  speakEnabled: false,
  currentPage: 1,
  currentZoom: 1,

  setDyslexiaEnabled: (dyslexiaEnabled) => set({ dyslexiaEnabled }),
  setHalfBoldEnabled: (halfBoldEnabled) => set({ halfBoldEnabled }),
  setAccentEnabled: (accentEnabled) => set({ accentEnabled }),
  setSpeakEnabled: (speakEnabled) => set({ speakEnabled }),

  setCurrentPage: (page: number) => {
    const totalPages = useFileInformation.getState().totalPages;
    if (page > totalPages) {
      set({ currentPage: totalPages });
    } else if (page < 1) {
      set({ currentPage: 1 });
    } else {
      set({ currentPage: page });
    }
  },

  setCurrentZoom: (zoom: number) => {
    if (zoom > maxZoom || zoom < minZoom) return;
    set({ currentZoom: zoom });
  },
}));
