import { useState, useRef, useEffect } from 'react';
import { ChevronDown, GripVertical } from 'lucide-react';
import { useFileInformation, type OutlineItem } from '../../../../states/file-information';
import { useGlobalStates } from '../../../../states/global-states';

type OutlineNodeProps = {
  item: OutlineItem;
  onNavigate: (page: number) => void;
  level?: number;
};

const OutlineNode = ({ item, onNavigate, level = 0 }: OutlineNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    onNavigate(item.page);
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700 ${
          level === 0 ? 'font-semibold' : level === 1 ? 'font-medium' : ''
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {hasChildren && (
          <button
            className="flex h-4 w-4 shrink-0 items-center justify-center p-0 transition-transform duration-200"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
            style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        )}
        {!hasChildren && <div className="w-4" />}

        <button
          onClick={handleClick}
          className="flex-1 truncate text-left text-sm text-zinc-800 hover:cursor-pointer hover:underline dark:text-zinc-200"
          title={item.title}
        >
          {item.title}
        </button>
      </div>

      <div
        style={{
          maxHeight: isExpanded && hasChildren ? '2000px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-in-out',
          transitionProperty: 'max-height',
          willChange: 'max-height',
        }}
      >
        {hasChildren &&
          item.children!.map((child, idx) => (
            <OutlineNode key={idx} item={child} onNavigate={onNavigate} level={level + 1} />
          ))}
      </div>
    </div>
  );
};

const PDFOutlineSidebar = () => {
  const outline = useFileInformation((s) => s.outline);
  const file = useFileInformation((s) => s.file);
  const setCurrentPage = useGlobalStates((s) => s.setCurrentPage);
  const sidebarWidth = useGlobalStates((s) => s.sidebarWidth);
  const setSidebarWidth = useGlobalStates((s) => s.setSidebarWidth);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const frameRef = useRef<number | undefined>(undefined);
  const currentWidthRef = useRef(sidebarWidth);

  // Keep currentWidthRef in sync with sidebarWidth
  useEffect(() => {
    currentWidthRef.current = sidebarWidth;
  }, [sidebarWidth]);

  useEffect(() => {
    const handle = resizeHandleRef.current;
    if (!handle) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;

      // Cancel any pending frame
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        const deltaX = e.clientX - startXRef.current;
        const newWidth = startWidthRef.current + deltaX;

        if (newWidth >= 200 && newWidth <= 500) {
          setSidebarWidth(newWidth);
        }
      });
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      isResizingRef.current = true;
      startXRef.current = e.clientX;
      startWidthRef.current = currentWidthRef.current;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    };

    handle.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      handle.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [setSidebarWidth, outline]);

  const handleNavigate = (page: number) => {
    setCurrentPage(page);
  };

  if (!file || !outline || outline.length === 0) {
    return null;
  }

  return (
    <aside
      ref={sidebarRef}
      className="relative h-full overflow-y-auto border-r border-zinc-300 bg-zinc-100 transition-all duration-300 dark:border-zinc-700 dark:bg-zinc-800"
      style={{ width: `${sidebarWidth}px` }}
      aria-label="PDF document outline"
    >
      <div className="p-4">
        <h2 className="mb-3 flex items-center gap-2 px-2 text-sm font-bold text-zinc-800 dark:text-zinc-200">
          Contents
        </h2>
        <nav className="space-y-0">
          {outline.map((item, idx) => (
            <OutlineNode key={idx} item={item} onNavigate={handleNavigate} level={0} />
          ))}
        </nav>
      </div>

      {/* Resize handle */}
      <div
        ref={resizeHandleRef}
        className="group pointer-events-auto absolute top-0 right-0 z-50 h-full w-2 cursor-col-resize bg-transparent transition-colors hover:bg-blue-400/40"
        title="Drag to resize sidebar"
      >
        <div className="absolute top-1/2 right-1/2 flex h-10 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded bg-blue-500/60 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-blue-600/60">
          <GripVertical className="h-3 w-3 text-white" />
        </div>
      </div>
    </aside>
  );
};

export default PDFOutlineSidebar;
