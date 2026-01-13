import { useEffect, useState } from 'react';
import { Button } from '@headlessui/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useGlobalStates } from '../../../states/global-states.tsx';
import { useFileInformation } from '../../../states/file-information.tsx';
import { ButtonStyle, InputStyle, SpanStyle } from '../../ui/Presets.tsx';

const PageControls = () => {
  const file = useFileInformation((s) => s.file);

  const totalPages = useFileInformation((s) => s.totalPages);

  const currentPage = useGlobalStates((s) => s.currentPage);
  const setCurrentPage = useGlobalStates((s) => s.setCurrentPage);

  const [pageInput, setPageInput] = useState('');

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage, setPageInput]);

  return (
    <div
      role="group"
      aria-label="Page Selector Options"
      className="flex flex-1 items-center justify-center gap-2"
    >
      {/* Previous Page */}
      <Button
        className={ButtonStyle}
        disabled={currentPage <= 1 || !file}
        onClick={() => setCurrentPage(currentPage - 1)}
        accessKey="["
        title="Previous Page | Access: ["
        aria-label="Previous Page"
      >
        <ChevronLeft />
      </Button>

      {/* Page Selector */}
      <input
        name="page-selector"
        id="page-selector"
        type="number"
        title="Enter page number | Access: p"
        min={1}
        max={totalPages || 0}
        accessKey="p"
        disabled={totalPages <= 0}
        value={pageInput}
        aria-label="Page number select"
        onChange={(e) => {
          if (/^\d*$/.test(e.target.value)) {
            setPageInput(e.target.value);
          }
        }}
        onFocus={() => {
          setPageInput(currentPage.toString());
        }}
        onBlur={(e) => {
          const newPage = Number(e.target.value);
          if (!isNaN(newPage) && newPage >= 1 && newPage <= (totalPages || 0)) {
            setCurrentPage(newPage);
          } else {
            setPageInput(currentPage.toString());
          }
        }}
        onKeyDown={(e) => {
          if (
            !/[0-9]/.test(e.key) &&
            e.key !== 'Backspace' &&
            e.key !== 'Delete' &&
            e.key !== 'Tab' &&
            e.key !== 'Enter' &&
            !e.key.match(/Arrow/)
          ) {
            e.preventDefault();
          }

          if (e.key === 'Enter') {
            const newPage = Number(pageInput);
            setCurrentPage(newPage);
            e.currentTarget.blur();
          }
        }}
        className={`[&::-moz-appearance]:textfield h-10 w-10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${InputStyle}`}
      />

      <span role="status" aria-label="Total number of pages" className={SpanStyle}>
        / {totalPages ?? 0}
      </span>

      {/* Next Page */}
      <Button
        className={ButtonStyle}
        disabled={currentPage == totalPages || !file}
        onClick={() => setCurrentPage(currentPage + 1)}
        accessKey="]"
        title="Next Page | Access: ]"
        aria-label="Next Page"
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default PageControls;
