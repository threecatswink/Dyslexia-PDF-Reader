import { create } from 'zustand';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

type FileInformationState = {
  /** The file that the user selected. */
  file: File | null;
  /** The name of the file selected. */
  fileName: string;
  /** The total number of pages in the file. */
  totalPages: number;
  
  pdf: PDFDocumentProxy | null;

  page: PDFPageProxy | null;

  viewport: { width: number; height: number; scale: number } | null;



  /**
   * @description Sets the file to be viewed
   * @param {File} file - The file to be set
   */
  setFile: (file: File) => void;

  /**
   * @description Sets the total number of pages.
   * @param {number} pages - The number of total pages to set
   */
  setTotalPages: (pages: number) => void;

  setPDF: (pdf: PDFDocumentProxy) => void;

  setPage: (page: PDFPageProxy, zoom: number) => void;

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
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.log("Problem setting file:", error);
    } finally {
      console.log("Loaded PDF");
    }
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
  reset: () => set({ pdf: null, page: null, viewport: null}),
}));
