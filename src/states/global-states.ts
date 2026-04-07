import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useFileInformation } from './file-information';
import type { PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
import type { PDFTextItem } from '../components/pdf/TextHelper';

/** The maximum possible zoom value. */
export const maxZoom = 6;
/** The minimum possible zoom value. */
export const minZoom = 0.25;

type GlobalState = {
  /** Selected font family for overlay: 'default' | 'opendyslexic' | 'lexend' */
  fontFamily: 'default' | 'opendyslexic' | 'lexend';
  /** Enables half bolded words */
  halfBoldEnabled: boolean;
  /** Enables increasing font size for the first letter of words. */
  accentEnabled: boolean;
  /** Enables a screen reader to read words aloud. */
  speakEnabled: boolean;
  /** Enables the PDF outline/bookmark sidebar. */
  outlineEnabled: boolean;
  /** Width of the PDF outline sidebar in pixels. */
  sidebarWidth: number;
  /** Enables the reading ruler guide. */
  rulerEnabled: boolean;
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
  /** Global word index currently highlighted by TTS (-1 when idle). */
  currentWordIndex: number;
  /** Word range (start/end indices) for the active sentence; -1 when idle. */
  sentenceWordStart: number;
  sentenceWordEnd: number;
  /** Per-sentence word counts to map sentences to global indices. */
  sentenceWordCounts: number[];

  /** Accent size in px applied to first letter when accent is enabled. */
  accentSize: number;

  /** Multiplier applied to overlay text sizing for alignment tuning. */
  overlayFontScale: number;

  /** Incremented when any visual setting changes to force overlay rerenders */
  settingsVersion: number;

  /** Sets fontFamily to selected option. */
  setFontFamily: (family: 'default' | 'opendyslexic' | 'lexend') => void;
  /** Sets halfBoldEnabled to true/false. */
  setHalfBoldEnabled: (state: boolean) => void;
  /** Sets accentEnabled to true/false. */
  setAccentEnabled: (state: boolean) => void;
  /** Sets speakEnabled to true/false. */
  setSpeakEnabled: (state: boolean) => void;
  /** Sets outlineEnabled to true/false. */
  setOutlineEnabled: (state: boolean) => void;
  /** Sets sidebarWidth in pixels. */
  setSidebarWidth: (width: number) => void;
  /** Sets rulerEnabled to true/false. */
  setRulerEnabled: (state: boolean) => void;
  /** Set playEnabled to true/false. */
  setPlayEnabled: (state: boolean) => void;
  /** Sets the currentSentenceIndex. */
  setCurrentSentenceIndex: (index: number) => void;
  /** Sets the current highlighted word index. */
  setCurrentWordIndex: (index: number) => void;
  /** Sets the active sentence word range. */
  setSentenceWordRange: (start: number, end: number) => void;
  /** Bumps settingsVersion to trigger overlay rerender */
  bumpSettingsVersion: () => void;
  /** Sets overlayFontScale and triggers overlay rerender */
  setOverlayFontScale: (scale: number) => void;
  /** Sets accentSize and triggers overlay rerender */
  setAccentSize: (size: number) => void;

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
      fontFamily: 'default',
      halfBoldEnabled: false,
      accentEnabled: false,
      speakEnabled: false,
      outlineEnabled: true,
      sidebarWidth: 256,
      rulerEnabled: false,
      playEnabled: false,
      currentPage: 1,
      currentZoom: 1,

      extractedText: '',
      sentences: [],
      sentenceWordCounts: [],
      currentSentenceIndex: 0,
      currentWordIndex: -1,
      sentenceWordStart: -1,
      sentenceWordEnd: -1,
      overlayFontScale: 1,
      accentSize: 4,
      settingsVersion: 0,

      setFontFamily: (fontFamily) =>
        set((s) => ({ fontFamily, settingsVersion: s.settingsVersion + 1 })),
      setHalfBoldEnabled: (halfBoldEnabled) =>
        set((s) => ({ halfBoldEnabled, settingsVersion: s.settingsVersion + 1 })),
      setAccentEnabled: (accentEnabled) =>
        set((s) => ({ accentEnabled, settingsVersion: s.settingsVersion + 1 })),
      setSpeakEnabled: (speakEnabled) => set({ speakEnabled }),
      setOutlineEnabled: (outlineEnabled) => set({ outlineEnabled }),
      setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),
      setRulerEnabled: (rulerEnabled) => set({ rulerEnabled }),
      setPlayEnabled: (playEnabled) => set({ playEnabled }),
      setCurrentSentenceIndex: (currentSentenceIndex) => set({ currentSentenceIndex }),
      setCurrentWordIndex: (currentWordIndex) => set({ currentWordIndex }),
      setSentenceWordRange: (sentenceWordStart, sentenceWordEnd) =>
        set({ sentenceWordStart, sentenceWordEnd }),
      bumpSettingsVersion: () => set((s) => ({ settingsVersion: s.settingsVersion + 1 })),
      setOverlayFontScale: (overlayFontScale) =>
        set((s) => ({
          overlayFontScale: Math.min(Math.max(overlayFontScale, 0.5), 1.8),
          settingsVersion: s.settingsVersion + 1,
        })),
      setAccentSize: (accentSize) =>
        set((s) => ({
          accentSize: Math.min(Math.max(accentSize, 0), 12),
          settingsVersion: s.settingsVersion + 1,
        })),

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
          currentWordIndex: -1,
          sentenceWordStart: -1,
          sentenceWordEnd: -1,
        }),

      setExtractedText: async (page) => {
        const content = await page.getTextContent();
        const items = content.items as PDFTextItem[];
        const seen = new Set<string>();
        const round = (value: number) => Math.round(value * 1000) / 1000;
        const parts: string[] = [];

        items.forEach((item) => {
          if (!item.str || item.str.trim() === '') return;
          const roundedTransform = item.transform.map((value) => round(value));
          const key = `${item.str}|${roundedTransform.join(',')}|${round(item.width)}|${round(item.height)}|${item.fontName ?? ''}|${item.dir ?? ''}`;
          if (seen.has(key)) return;
          seen.add(key);
          parts.push(item.str);
        });

        const text = parts.join(' ');

        const sentences = text.match(/[^.!?]+[.!?]+[\])'"`’”]*|.+$/g) || [];
        const wordCounts = sentences.map((s) => (s.match(/\S+/g) || []).length);

        set({
          extractedText: text,
          sentences,
          sentenceWordCounts: wordCounts,
          currentSentenceIndex: 0,
        });
      },
    }),
    {
      name: 'global-reader-state',
      version: 3,

      partialize: (state) => ({
        fontFamily: state.fontFamily,
        halfBoldEnabled: state.halfBoldEnabled,
        accentEnabled: state.accentEnabled,
        rulerEnabled: state.rulerEnabled,
        outlineEnabled: state.outlineEnabled,
        sidebarWidth: state.sidebarWidth,
        overlayFontScale: state.overlayFontScale,
        accentSize: state.accentSize,
      }),
    }
  )
);
