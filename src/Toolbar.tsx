import { useState, useEffect, useRef, type FC, type ChangeEvent } from "react";

interface ToolbarProps {
    onFileSelected?: (file: File) => void;
    onPreviousPage?: () => void;
    canPreviousPage?: boolean;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    onNextPage?: () => void;
    canNextPage?: boolean;
    onZoomIn?: () => void;
    canZoomIn?: boolean;
    onZoomChange?: (zoom: number) => void;
    onZoomOut?: () => void;
    canZoomOut?: boolean;
    onToggleDyslexiaMode?: () => void;
    onToggleHalfBold?: () => void;
    onToggleAccent?: () => void;
    onReadAloud?: () => void;
}

// Toolbar  presets
const toolbarBtnEnabled = `
    px-3 py-3 rounded flex items-center max-w-full min-w-10 justify-center select-none
    transition duration-150 ease-in-out
    invert-70 hover:invert-90 hover:scale-110 active:scale-95
`;

const toolbarBtnDisabled = `
    px-3 py-3 rounded flex items-center max-w-full min-w-10 justify-center select-none
    invert-30 transition duration-150 ease-in-out
`;

// Toolbar settings menu presets
const toolbarSettingsCheckBox = `
    flex items-center gap-2 px-2 py-1 hover:bg-zinc-600 rounded cursor-pointer select-none
    transition duration-150 ease-in-out
`;

const toolbarImg = `
    w-5 h-5 
    transition
    duration-150
    ease-in-out
`;

const Toolbar: FC<ToolbarProps> = ({
    onFileSelected,
    onPreviousPage,
    canPreviousPage,
    currentPage,
    totalPages,
    onPageChange,
    onNextPage,
    canNextPage,
    onZoomIn,
    canZoomIn,
    onZoomChange,
    onZoomOut,
    canZoomOut,
    onToggleDyslexiaMode,
    onToggleHalfBold,
    onToggleAccent,
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onFileSelected) onFileSelected(file);
    };

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsRef = useRef<HTMLDivElement | null>(null);

    // close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
                setIsSettingsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="
                w-full 
                bg-zinc-800
                text-white 
                flex 
                items-center 
                gap-2 
                px-4 py-1 
                shadow-md
            "
        >
            {/* Left of Toolbar */}
            <div className="
                    flex 
                    flex-1 
                    justify-start
                "
            >
                {/* Open File */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Open File | Alt + Shift + f"
                    aria-label="Open file"
                    accessKey="f"
                    className={toolbarBtnEnabled}
                >
                    <img
                        src="icons/folder-open.svg"
                        alt="Folder Open icon"
                        className={toolbarImg}
                    />
                </button>
                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {/* Center of Toolbar */}
            <div className="
                    flex 
                    flex-1 
                    justify-center
                    items-center
                    gap-2
                "
            >
                {/* Previous Page */}
                <button
                    onClick={onPreviousPage}
                    title="Previous Page | Alt + ["
                    aria-label="Previous page"
                    accessKey="["
                    className={canPreviousPage ? toolbarBtnEnabled : toolbarBtnDisabled}
                >
                    <img
                        src="icons/angle-left.svg"
                        alt="Left arrow icon"
                        className={toolbarImg}
                    />
                </button>

                {/* Page Selector */}
                <input
                    type="number"
                    value={currentPage ?? 1}
                    onChange={(e) => onPageChange?.(parseInt(e.target.value) || 0)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            const val = parseInt((e.target as HTMLInputElement).value);
                            if (!isNaN(val)) onPageChange?.(val);
                        }
                    }}
                    title="Enter page number | Alt + p"
                    aria-label="Page number select"
                    min={1}
                    max={totalPages ?? 1}
                    accessKey="p"
                    className="
                        w-10 h-10 px-1 py-1 text-sm text-white
                        bg-gray-200 dark:bg-zinc-700
                        border border-gray-400 dark:border-zinc-600
                        rounded
                        focus:outline-none focus:ring-2 focus:ring-zinc-500
                        transition
                        [&::-webkit-outer-spin-button]:appearance-none
                        [&::-webkit-inner-spin-button]:appearance-none
                        [&::-moz-appearance]:textfield
                    "
                />
                <span className="text-zinc-200 select-none">/ {totalPages ?? 0}</span>

                {/* Next Page */}
                <button
                    onClick={onNextPage}
                    title="Next Page | Alt + ]"
                    aria-label="Next page"
                    accessKey="]"
                    className={canNextPage ? toolbarBtnEnabled : toolbarBtnDisabled}
                >
                    <img
                        src="icons/angle-right.svg"
                        alt="Right arrow icon"
                        className={toolbarImg}
                    />
                </button>
            </div>

            {/* Right of Toolbar */}
            <div className="
                    flex 
                    flex-1 
                    justify-end
                    items-center
                    gap-1
                "
            >
                {/* Zoom Out */}
                <button
                    onClick={onZoomOut}
                    title="Zoom Out | Alt + -"
                    aria-label="Zoom out"
                    accessKey="-"
                    className={canZoomOut ? toolbarBtnEnabled : toolbarBtnDisabled}
                >
                    <img
                        src="icons/zoom-out.svg"
                        alt="magnifying glass with a minus symbol"
                        className={toolbarImg}
                    />
                </button>

                {/* Zoom Selector */}
                <select
                    title="Zoom Amount"
                    defaultValue="1"
                    onChange={(e) => onZoomChange?.(parseFloat(e.target.value))}
                    className="bg-zinc-700 text-white border border-zinc-600 rounded px-1 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 leading-none h-10"
                >
                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6].map(v => (
                        <option key={v} value={v}>{v * 100}%</option>
                    ))}
                </select>

                {/* Zoom In */}
                <button
                    onClick={onZoomIn}
                    title="Zoom In | Alt + ="
                    aria-label="Zoom in"
                    accessKey="="
                    className={canZoomIn ? toolbarBtnEnabled : toolbarBtnDisabled}
                >
                    <img
                        src="icons/zoom-in.svg"
                        alt="Magnifying glass with a plus symbol"
                        className={toolbarImg}
                    />
                </button>

                {/* Settings Button + Dropdown */}
                <div className="relative" ref={settingsRef}>
                    <button
                        onClick={() => setIsSettingsOpen(prev => !prev)}
                        title="Settings Menu | Alt + s"
                        aria-label="Open settings menu"
                        accessKey="s"
                        className={toolbarBtnEnabled}
                    >
                        <img src="icons/menu-burger.svg" alt="Menu burger" className={toolbarImg} />
                    </button>

                    <div
                        className={`
                            absolute right-0 mt-2 w-48 bg-zinc-700 border border-zinc-600 rounded shadow-lg flex flex-col p-2 z-50
                            transform transition-all duration-200 origin-top
                            ${isSettingsOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}
                        `}
                    >
                    <label className={toolbarSettingsCheckBox}>
                            <input type="checkbox" onChange={onToggleDyslexiaMode} />
                            <span>Dyslexia Mode</span>
                        </label>

                        <label className={toolbarSettingsCheckBox}>
                            <input type="checkbox" onChange={onToggleHalfBold} />
                            <span>Half Bold</span>
                        </label>

                        <label className={toolbarSettingsCheckBox}>
                            <input type="checkbox" onChange={onToggleAccent} />
                            <span>Accent Letters</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Toolbar;