import { useState, useRef } from 'react';
import { Button, Popover, PopoverButton, PopoverPanel, Switch } from '@headlessui/react';
import {
  FolderOpen,
  ChevronRight,
  ChevronLeft,
  ZoomOut,
  ZoomIn,
  Speech,
  MenuIcon,
} from 'lucide-react';
import { ButtonStyle, InputStyle, SpanStyle } from './Presets.tsx';
import { UseFileInformation } from './FileInformation.tsx';
import { dyslexiaEnabled, halfBoldEnabled, accentEnabled } from './PDFviewer.tsx';
import { setSpeak } from './Reader.tsx';

export let currentZoom = 1;

const Toolbar = () => {
  const setFile = UseFileInformation((s) => s.setFile);

  const currentPage = UseFileInformation((s) => s.currentPage);
  const setCurrentPage = UseFileInformation((s) => s.setCurrentPage);
  const totalPages = UseFileInformation((s) => s.totalPages);

  const setPage = (page: number) => {
    if (page > totalPages || page < 1) return;
    setCurrentPage(page);
  };

  const maxZoom = 6;
  const minZoom = 0.25;
  const setZoom = (amount: number) => {
    if (amount < minZoom || amount > maxZoom) return;
    currentZoom = amount;
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pageInput, setPageInput] = useState('');

  const file = UseFileInformation((s) => s.file);
  const fileName = UseFileInformation((s) => s.fileName);

  const zoomOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6];
  const mergedZoomOptions = zoomOptions.includes(currentZoom!)
    ? zoomOptions
    : [...zoomOptions, currentZoom!].sort((a, b) => a - b);

  return (
    <nav
      id="toolbar"
      role="toolbar"
      aria-label="Toolbar"
      className="flex w-full items-center gap-2 bg-zinc-200 px-4 py-1 text-black shadow-md dark:bg-zinc-800 dark:text-white"
    >
      {/* Left of Toolbar */}
      <div
        role="group"
        aria-label="File Select"
        className="flex flex-1 items-center justify-start gap-2"
      >
        {/* Open File */}
        <Button
          className={ButtonStyle}
          onClick={() => fileInputRef.current?.click()}
          accessKey="o"
          title="Open PDF File | Alt + o"
          aria-label="Open PDF File"
        >
          <FolderOpen />
        </Button>

        {/* File Input */}
        <input
          name="file-input"
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
              setFile(file);
            }
          }}
        />

        {/* File name display */}
        <span role="status" aria-label="File name" aria-readonly="true" className={SpanStyle}>
          {fileName}
        </span>
      </div>
      {/* Center of Toolbar */}
      <div
        role="group"
        aria-label="Page Select"
        className="flex flex-1 items-center justify-center gap-2"
      >
        {/* Previous Page */}
        <Button
          className={ButtonStyle}
          disabled={currentPage <= 1 || !file}
          onClick={() => setCurrentPage(currentPage - 1)}
          accessKey="["
          title="Previous Page | Alt + ["
          aria-label="Previous Page"
        >
          <ChevronLeft />
        </Button>

        {/* Page Selector */}
        <input
          name="page-selector"
          type="number"
          title="Enter page number | Alt + p"
          min={1}
          max={totalPages || 0}
          accessKey="p"
          disabled={totalPages <= 0}
          value={pageInput}
          aria-label="Page number select"
          onChange={(e) => setPageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const val = parseInt(pageInput);
              if (!isNaN(val)) setPage?.(val);
              else setPageInput(currentPage?.toString() ?? '');
            }
          }}
          onBlur={() => {
            setPageInput(currentPage?.toString() ?? '');
          }}
          className={`[&::-moz-appearance]:textfield h-10 w-10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${InputStyle}`}
        />

        <span
          role="status"
          aria-label="Total number of pages"
          aria-readonly="true"
          className={SpanStyle}
        >
          / {totalPages ?? 0}
        </span>

        {/* Next Page */}
        <Button
          className={ButtonStyle}
          disabled={currentPage == totalPages || !file}
          onClick={() => setCurrentPage(currentPage + 1)}
          accessKey="]"
          title="Next Page | Alt + ]"
          aria-label="Next Page"
        >
          <ChevronRight />
        </Button>
      </div>

      {/* Right of Toolbar */}
      <div
        role="group"
        aria-label="Zoom and Misc Settings"
        className="flex flex-1 items-center justify-end gap-1"
      >
        {/* Zoom Out */}
        <Button
          className={ButtonStyle}
          disabled={currentZoom <= minZoom || !file}
          onClick={() => setZoom(currentZoom - 0.25)}
          accessKey="-"
          title="Zoom Out | Alt + -"
          aria-label="Zoom Out"
        >
          <ZoomOut />
        </Button>

        {/* Zoom Selector */}
        <select
          title="Zoom Amount"
          name="zoom-select"
          value={currentZoom}
          onChange={(e) => setZoom?.(parseFloat(e.target.value))}
          disabled={!file}
          className={`h-10 w-18 ${InputStyle}`}
        >
          {mergedZoomOptions.map((v) => (
            <option key={v} value={v}>
              {Math.round(v * 100)}%
            </option>
          ))}
        </select>

        {/* Zoom In */}
        <Button
          className={ButtonStyle}
          disabled={currentZoom >= maxZoom || !file}
          onClick={() => setZoom(currentZoom + 0.25)}
          accessKey="="
          title="Zoom In | Alt + ="
          aria-label="Zoom In"
        >
          <ZoomIn />
        </Button>

        {/* Screen Reader */}
        <Button
          onClick={() => setSpeak}
          disabled={!file}
          className={ButtonStyle}
          accessKey="r"
          title="Toggle Read Aloud | Alt + r"
          aria-label="Toggle Read Aloud"
        >
          <Speech />
        </Button>

        {/* Dropdown */}
        <Popover className="relative">
          {/* Settings Button */}
          <PopoverButton
            className={ButtonStyle}
            accessKey="s"
            title="Settings | Alt + s"
            aria-label="Settings"
          >
            <MenuIcon />
          </PopoverButton>

          {/* Settings Panel */}
          <PopoverPanel
            transition
            className="absolute right-0 z-50 mt-2 w-48 origin-top transform rounded border border-zinc-600 bg-zinc-200 p-2 shadow-lg transition duration-200 ease-in-out data-closed:-translate-y-1 data-closed:opacity-0 dark:bg-zinc-700"
          >
            <Switch name="dyslexia-mode" checked={dyslexiaEnabled}>
              <span aria-readonly="true" className={SpanStyle}>
                Dyslexia Mode
              </span>
            </Switch>

            <Switch name="half-bold" checked={halfBoldEnabled}>
              <span aria-readonly="true" className={SpanStyle}>
                Half Bold
              </span>
            </Switch>

            <Switch name="accent-letters" checked={accentEnabled}>
              <span aria-readonly="true" className={SpanStyle}>
                Accent Letters
              </span>
            </Switch>
          </PopoverPanel>
        </Popover>
      </div>
    </nav>
  );
};

export default Toolbar;
