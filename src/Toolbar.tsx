import { FC } from "react";

interface ToolbarProps {
    onOpenFile?: () => void;
    onPreviousPage?: () => void;
    onNextPage?: () => void;
    onZoomIn?: () => void;
    onZoomOut?: () => void;
    onSettings?: () => void;
    onToggleDyslexiaMode?: () => void;
    onToggleHalfBold?: () => void;
    onToggleAccent?: () => void;
    onReadAloud?: () => void;
}

const Toolbar: FC<ToolbarProps> = ({
    onOpenFile,
    onPreviousPage,
    onNextPage,
    onZoomIn,
    onZoomOut,
    onSettings,
    onToggleDyslexiaMode,
    onToggleHalfBold,
    onToggleAccent,
    onReadAloud,
}) => {
    return (
        <div className="w-full bg-zinc-800 text-white flex items-center gap-2 px-4 py-1 shadow-md">
            {/* Left of Toolbar */}
            <div className="flex flex-1 justify-start">
                {/* Open File */}
                <button
                    onClick={onOpenFile}
                    title="Open File | Alt + Shift + f"
                    accessKey="f"
                    className="px-3 py-3 hover:invert-80 active:invert-20 rounded transition"
                >
                    <img
                        src="icons/folder-open.svg"
                        alt="Open file"
                        className="w-5 h-5 invert-60"
                    />
                </button>
            </div>

            {/* Center of Toolbar */}
            <div className="flex flex-1 justify-center">
                {/* Previous Page */}
                <button
                    onClick={onPreviousPage}
                    title="Previous Page | Alt + ["
                    accessKey="["
                    className="px-3 py-3 hover:invert-80 active:invert-20 rounded transition"
                >
                    <img
                        src="icons/angle-left.svg"
                        alt="Previous page"
                        className="w-5 h-5 invert-60"
                    />
                </button>

                {/* Next Page */}
                <button
                    onClick={onNextPage}
                    title="Next Page | Alt + ]"
                    accessKey="]"
                    className="px-3 py-3 hover:invert-80 active:invert-20 rounded transition"
                >
                    <img
                        src="icons/angle-right.svg"
                        alt="Next page"
                        className="w-5 h-5 invert-60"
                    />
                </button>
            </div>

            {/* Right of Toolbar */}
            <div className="flex flex-1 justify-end">
                {/* Zoom Out */}
                <button
                    onClick={onZoomOut}
                    title="Zoom Out | Alt + -"
                    accessKey="-"
                    className="px-3 py-3 hover:invert-80 active:invert-20 rounded transition"
                >
                    <img
                        src="icons/zoom-out.svg"
                        alt="Zoom out"
                        className="w-5 h-5 invert-60"
                    />
                </button>

                {/* Zoom In */}
                <button
                    onClick={onZoomIn}
                    title="Zoom In | Alt + ="
                    accessKey="="
                    className="px-3 py-3 hover:invert-80 active:invert-20 rounded transition"
                >
                    <img
                        src="icons/zoom-in.svg"
                        alt="Zoom in"
                        className="w-5 h-5 invert-60"
                    />
                </button>

                {/* Settings */}
                <button
                    onClick={onSettings}
                    title="Settings Menu | Alt + s"
                    accessKey="s"
                    className="px-3 py-3 hover:invert-80 active:invert-20 rounded transition"
                >
                    <img
                        src="icons/menu-burger.svg"
                        alt="Settings menu"
                        className="w-5 h-5 invert-60"
                    />
                </button>
            </div>
        </div>
    );
};

export default Toolbar;