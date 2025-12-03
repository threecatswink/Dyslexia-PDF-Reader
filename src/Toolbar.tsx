import { useState, useEffect, useRef, type FC, type ChangeEvent } from 'react';
import { Menu, MenuItem, MenuSection } from '@headlessui/react';
import {
  FolderOpen,
  ChevronRight,
  ChevronLeft,
  ZoomOut,
  ZoomIn,
  Speech,
  MenuIcon,
} from 'lucide-react';
import { ButtonElement } from './Presets.tsx';

interface ToolbarProps {
  onFileSelected?: (file: File) => void;
  filePathSpan?: string;
  onPreviousPage?: () => void;
  canPreviousPage?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onNextPage?: () => void;
  canNextPage?: boolean;
  onZoomIn?: () => void;
  canZoomIn?: boolean;
  currentZoom?: number;
  onZoomChange?: (zoom: number) => void;
  onZoomOut?: () => void;
  canZoomOut?: boolean;
  onSpeak?: () => void;
  onToggleDyslexiaMode?: () => void;
  onToggleHalfBold?: () => void;
  onToggleAccent?: () => void;
  onReadAloud?: () => void;
}

const toolbarInputEnabled = `
    px-1 py-1 text-sm text-white
    bg-gray-200 dark:bg-zinc-700
    border border-gray-400 dark:border-zinc-600
    rounded
    focus:outline-none focus:ring-2 focus:ring-zinc-500
    transition
`;

const toolbarInputDisabled = `
    px-1 py-1 text-sm text-gray-400 dark:text-zinc-500
    bg-gray-300 dark:bg-zinc-800
    border border-gray-400 dark:border-zinc-700
    cursor-not-allowed
    rounded
    transition
`;

const toolbarSpanEnabled = `
    text-zinc-200 select-text
    max-w-xs md:max-w-sm lg:max-w-md truncate
`;

const toolbarSpanDisabled = `
    text-gray-400 dark:text-zinc-500 select-text
`;

const toolbarSettingsCheckBox = `
    flex items-center gap-2 px-2 py-1 hover:bg-zinc-600 rounded cursor-pointer select-none
    transition duration-150 ease-in-out
`;

const Toolbar: FC<ToolbarProps> = ({
  onFileSelected,
  filePathSpan,
  onPreviousPage,
  canPreviousPage,
  currentPage,
  totalPages,
  onPageChange,
  onNextPage,
  canNextPage,
  onZoomIn,
  canZoomIn,
  currentZoom,
  onZoomChange,
  onZoomOut,
  canZoomOut,
  onSpeak,
  onToggleDyslexiaMode,
  onToggleHalfBold,
  onToggleAccent,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pageInput, setPageInput] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelected) onFileSelected(file);
  };

  const zoomOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6];
  const mergedZoomOptions = zoomOptions.includes(currentZoom!)
    ? zoomOptions
    : [...zoomOptions, currentZoom!].sort((a, b) => a - b);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement | null>(null);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    setPageInput(currentPage?.toString() ?? '');
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [currentPage]);

  return (
    <Menu
      as="div"
      className="flex w-full items-center gap-2 bg-zinc-800 px-4 py-1 text-white shadow-md"
    >
      {/* Left of Toolbar */}
      <MenuSection className="flex flex-1 items-center justify-start gap-2">
        {/* Open File */}
        <ButtonElement
          onClick={() => fileInputRef.current?.click()}
          title="Open File | Alt + Shift + f"
          ariaLabel="Open file"
          accessKey="f"
          disabled={false}
          icon={FolderOpen}
        />
        {/* File Input */}
        <MenuItem as="div">
          <input
            name="file-input"
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* File name display */}
          <span className={toolbarSpanEnabled}>{filePathSpan}</span>
        </MenuItem>
      </MenuSection>

      {/* Center of Toolbar */}
      <MenuSection className="flex flex-1 items-center justify-center gap-2">
        {/* Previous Page */}
        <ButtonElement
          onClick={onPreviousPage!}
          title="Previous Page | Alt + ["
          ariaLabel="Previous page"
          accessKey="["
          disabled={!canPreviousPage}
          icon={ChevronLeft}
        />

        {/* Page Selector */}
        <MenuItem as="div" className="flex items-center gap-1">
          <input
            name="page-selector"
            type="number"
            title="Enter page number | Alt + p"
            min={1}
            max={totalPages || 0}
            accessKey="p"
            disabled={!totalPages}
            value={pageInput}
            aria-label="Page number select"
            aria-valuemin={1}
            aria-valuemax={totalPages || 0}
            onChange={(e) => setPageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const val = parseInt(pageInput);
                if (!isNaN(val)) onPageChange?.(val);
                else setPageInput(currentPage?.toString() ?? '');
              }
            }}
            onBlur={() => {
              setPageInput(currentPage?.toString() ?? '');
            }}
            className={`[&::-moz-appearance]:textfield h-10 w-10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${!totalPages ? toolbarInputDisabled + 'cursor-not-allowed' : toolbarInputEnabled + 'cursor-text'}`}
          />
          <span className={totalPages ? toolbarSpanEnabled : toolbarSpanDisabled}>
            / {totalPages ?? 0}
          </span>
        </MenuItem>

        {/* Next Page */}
        <ButtonElement
          onClick={onNextPage!}
          title="Next Page | Alt + ]"
          ariaLabel="Next page"
          accessKey="]"
          disabled={!canNextPage}
          icon={ChevronRight}
        />
      </MenuSection>

      {/* Right of Toolbar */}
      <MenuSection className="flex flex-1 items-center justify-end gap-1">
        {/* Zoom Out */}
        <ButtonElement
          onClick={onZoomOut!}
          title="Zoom Out | Alt + -"
          ariaLabel="Zoom out"
          accessKey="-"
          disabled={!canZoomOut}
          icon={ZoomOut}
        />

        {/* Zoom Selector */}
        <MenuItem as="div">
          <select
            title="Zoom Amount"
            name="zoom-select"
            value={currentZoom}
            onChange={(e) => onZoomChange?.(parseFloat(e.target.value))}
            disabled={!canZoomIn && !canZoomOut}
            className={`h-10 w-18 ${!canZoomIn && !canZoomOut ? toolbarInputDisabled + 'cursor-not-allowed' : toolbarInputEnabled + 'cursor-pointer'}`}
          >
            {mergedZoomOptions.map((v) => (
              <option key={v} value={v}>
                {Math.round(v * 100)}%
              </option>
            ))}
          </select>
        </MenuItem>

        {/* Zoom In */}
        <ButtonElement
          onClick={onZoomIn!}
          title="Zoom In | Alt + ="
          ariaLabel="Zoom in"
          accessKey="="
          disabled={!canZoomIn}
          icon={ZoomIn}
        />

        {/* Screen Reader */}
        <ButtonElement
          onClick={onSpeak!}
          title="Screen Reader | Alt + s"
          ariaLabel="Screen reader enable"
          accessKey="s"
          disabled={!filePathSpan}
          icon={Speech}
        />

        {/* Dropdown */}
        <div className="relative" ref={settingsRef}>
          {/* Settings */}
          <ButtonElement
            onClick={() => setIsSettingsOpen((prev) => !prev)}
            title="Settings Menu | Alt + s"
            ariaLabel="Open settings menu"
            accessKey="s"
            icon={MenuIcon}
          />
          <div
            className={`absolute right-0 z-50 mt-2 flex w-48 origin-top transform flex-col rounded border border-zinc-600 bg-zinc-700 p-2 shadow-lg transition-all duration-200 ${isSettingsOpen ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'} `}
          >
            <label className={toolbarSettingsCheckBox}>
              <input name="dyslexia-mode" type="checkbox" onChange={onToggleDyslexiaMode} />
              <span>Dyslexia Mode</span>
            </label>

            <label className={toolbarSettingsCheckBox}>
              <input name="half-bold" type="checkbox" onChange={onToggleHalfBold} />
              <span>Half Bold</span>
            </label>

            <label className={toolbarSettingsCheckBox}>
              <input name="accent-letters" type="checkbox" onChange={onToggleAccent} />
              <span>Accent Letters</span>
            </label>
          </div>
        </div>
      </MenuSection>
    </Menu>
  );
};

export default Toolbar;
