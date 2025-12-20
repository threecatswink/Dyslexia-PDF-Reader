import { useState, useEffect, useRef, type FC, type ChangeEvent } from 'react';
import {
  Menu,
  MenuItem,
  MenuSection,
  Button,
  Popover,
  PopoverButton,
  PopoverPanel,
  Switch,
} from '@headlessui/react';
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

  // close dropdown on outside click
  useEffect(() => {
    setPageInput(currentPage?.toString() ?? '');
  }, [currentPage]);

  return (
    <Menu
      as="div"
      className="flex w-full items-center gap-2 bg-zinc-200 px-4 py-1 text-black shadow-md dark:bg-zinc-800 dark:text-white"
    >
      {/* Left of Toolbar */}
      <MenuSection className="flex flex-1 items-center justify-start gap-2">
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
          <span className={SpanStyle}>{filePathSpan}</span>
        </MenuItem>
      </MenuSection>

      {/* Center of Toolbar */}
      <MenuSection className="flex flex-1 items-center justify-center gap-2">
        {/* Previous Page */}
        <Button
          className={ButtonStyle}
          disabled={!canPreviousPage}
          onClick={onPreviousPage}
          accessKey="["
          title="Previous Page | Alt + ["
          aria-label="Previous Page"
        >
          <ChevronLeft />
        </Button>

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
            className={`[&::-moz-appearance]:textfield h-10 w-10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${InputStyle}`}
          />
          <span className={SpanStyle}>/ {totalPages ?? 0}</span>
        </MenuItem>

        {/* Next Page */}
        <Button
          className={ButtonStyle}
          disabled={!canNextPage}
          onClick={onNextPage}
          accessKey="]"
          title="Next Page | Alt + ]"
          aria-label="Next Page"
        >
          <ChevronRight />
        </Button>
      </MenuSection>

      {/* Right of Toolbar */}
      <MenuSection className="flex flex-1 items-center justify-end gap-1">
        {/* Zoom Out */}
        <Button
          className={ButtonStyle}
          disabled={!canZoomOut}
          onClick={onZoomOut}
          accessKey="-"
          title="Zoom Out | Alt + -"
          aria-label="Zoom Out"
        >
          <ZoomOut />
        </Button>

        {/* Zoom Selector */}
        <MenuItem as="div">
          <select
            title="Zoom Amount"
            name="zoom-select"
            value={currentZoom}
            onChange={(e) => onZoomChange?.(parseFloat(e.target.value))}
            disabled={!canZoomIn && !canZoomOut}
            className={`h-10 w-18 ${InputStyle}`}
          >
            {mergedZoomOptions.map((v) => (
              <option key={v} value={v}>
                {Math.round(v * 100)}%
              </option>
            ))}
          </select>
        </MenuItem>

        {/* Zoom In */}
        <Button
          className={ButtonStyle}
          disabled={!canZoomIn}
          onClick={onZoomIn}
          accessKey="="
          title="Zoom In | Alt + ="
          aria-label="Zoom In"
        >
          <ZoomIn />
        </Button>

        {/* Screen Reader */}
        <Button
          onClick={onSpeak}
          disabled={!onSpeak}
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
            title="Toolbar Settings | Alt + s"
            aria-label="Toolbar Settings"
          >
            <MenuIcon />
          </PopoverButton>

          {/* Settings Panel */}
          <PopoverPanel
            transition
            className="absolute right-0 z-50 mt-2 w-48 origin-top transform rounded border border-zinc-600 bg-zinc-200 p-2 shadow-lg transition duration-200 ease-in-out data-closed:-translate-y-1 data-closed:opacity-0 dark:bg-zinc-700"
          >
            <Switch name="dyslexia-mode" onChange={onToggleDyslexiaMode}>
              <span className={SpanStyle}>Dyslexia Mode</span>
            </Switch>

            <Switch name="half-bold" onChange={onToggleHalfBold}>
              <span className={SpanStyle}>Half Bold</span>
            </Switch>

            <Switch name="accent-letters" onChange={onToggleAccent}>
              <span className={SpanStyle}>Accent Letters</span>
            </Switch>
          </PopoverPanel>
        </Popover>
      </MenuSection>
    </Menu>
  );
};

export default Toolbar;
