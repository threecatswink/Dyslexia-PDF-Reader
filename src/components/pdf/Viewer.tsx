import { useEffect } from 'react';
import { useFileInformation } from '../../states/file-information';
import { useGlobalStates } from '../../states/global-states';
import Renderer from './Renderer';
import Overlay from './Overlay';

const Viewer = () => {
  const file = useFileInformation((s) => s.file);
  const setTotalPages = useFileInformation((s) => s.setTotalPages);

  const currentPage = useGlobalStates((s) => s.currentPage);
  const currentZoom = useGlobalStates((s) => s.currentZoom);
  const dyslexiaEnabled = useGlobalStates((s) => s.dyslexiaEnabled);

  const pdf = useFileInformation((s) => s.pdf);
  const viewport = useFileInformation((s) => s.viewport);
  const setPDF = useFileInformation((s) => s.setPDF);
  const setPage = useFileInformation((s) => s.setPage);
  const resetPdf = useFileInformation((s) => s.reset);

  const sentences = useGlobalStates((s) => s.sentences);
  const currentSentenceIndex = useGlobalStates((s) => s.currentSentenceIndex);

  // Load PDF
  useEffect(() => {
    if (!file) {
      resetPdf();
      return;
    }
    (async () => {
      const buffer = await file.arrayBuffer();
      const { getDocument } = await import('pdfjs-dist');
      const pdfDoc = await getDocument(buffer).promise;
      setPDF(pdfDoc);
      setTotalPages(pdfDoc.numPages);
    })();
  }, [file]);

  // Load page
  useEffect(() => {
    if (!pdf) return;
    (async () => {
      const p = await pdf.getPage(currentPage);
      setPage(p, currentZoom);
    })();
  }, [pdf, currentPage, currentZoom]);

  return (
    <div className="relative h-full w-full overflow-auto">
      {viewport && (
        <div
          className="page-wrapper relative mx-auto bg-white"
          style={{
            width: viewport.width,
            height: viewport.height,
          }}
        >
          {!dyslexiaEnabled && <Renderer />}
          <Overlay />
        </div>
      )}
    </div>
  );
};

export default Viewer;
