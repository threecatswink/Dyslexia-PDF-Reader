import { create } from 'zustand';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

type FileInformationState = {
  /** The file that the user selected. */
  file: File | null;
  /** The name of the file selected. */
  fileName: string;
  /** The total number of pages in the file. */
  totalPages: number;
  /** The PDF document. */
  pdf: PDFDocumentProxy | null;
  /** The PDF page. */
  page: PDFPageProxy | null;
  /** The page viewport. */
  viewport: { width: number; height: number; scale: number } | null;

  /**
   * @description Sets the file to be viewed.
   * @param {File} file - The file to be set.
   */
  setFile: (file: File) => void;

  /**
   * @description Sets the total number of pages.
   * @param {number} pages - The number of total pages to set.
   */
  setTotalPages: (pages: number) => void;

  /**
   * @description Sets the PDF document.
   * @param pdf - The PDF to be set.
   */
  setPDF: (pdf: PDFDocumentProxy) => void;

  /**
   * @description Sets the page to render.
   * @param page - The page on the document to render.
   * @param zoom - The zoom value to apply on the page.
   */
  setPage: (page: PDFPageProxy, zoom: number) => void;

  /** Resets the PDF values. */
  reset: () => void;
};

/**
 * @description Stores specifically file information.
 * @param set
 */
export const useFileInformation = create<FileInformationState>((set) => ({
  file: null,
  fileName: '',
  totalPages: 0,
  pdf: null,
  page: null,
  viewport: null,

  setFile: async (file) => {
    set({
      file,
      fileName: file.name,
    });
  },

  setTotalPages: (totalPages) => set({ totalPages }),

  setPDF: (pdf) => set({ pdf }),

  setPage: (page, zoom) => {
    const vp = page.getViewport({ scale: zoom });
    set({
      page,
      viewport: { width: vp.width, height: vp.height, scale: vp.scale },
    });
  },

  reset: () => set({ pdf: null, page: null, viewport: null }),
}));
