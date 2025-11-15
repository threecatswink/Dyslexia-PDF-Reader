import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PDFviewer from './PDFviewer.tsx'
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = `${import.meta.env.BASE_URL}${pdfjsWorker}`;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PDFviewer />
  </StrictMode>,
)
