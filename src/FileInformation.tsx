import { create } from 'zustand';

type FileInformationState = {
  file: File | null;
  fileName: string;
  totalPages: number;
  currentPage: number;
  setFile: (file: File) => void;
  setTotalPages: (pages: number) => void;
  setCurrentPage: (page: number) => void;
};

export const UseFileInformation = create<FileInformationState>((set) => ({
  file: null,
  fileName: '',
  totalPages: 0,
  currentPage: 1,

  setFile: (file) =>
    set({
      file,
      fileName: file.name,
    }),

  setTotalPages: (totalPages) => set({ totalPages }),
  setCurrentPage: (currentPage) => set({ currentPage }),
}));
