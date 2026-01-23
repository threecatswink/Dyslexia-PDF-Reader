import { ButtonStyle, SpanStyle, SVGStyle } from '../../../../styles/StylePresets.tsx';
import { useRef } from 'react';
import { FolderOpen, PanelLeft } from 'lucide-react';
import { useFileInformation } from '../../../../states/file-information.tsx';
import { useGlobalStates } from '../../../../states/global-states.tsx';

const FileControls = () => {
  const fileName = useFileInformation((s) => s.fileName);
  const setFile = useFileInformation((s) => s.setFile);
  const reset = useGlobalStates((s) => s.reset);
  const outlineEnabled = useGlobalStates((s) => s.outlineEnabled);
  const setOutlineEnabled = useGlobalStates((s) => s.setOutlineEnabled);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      role="group"
      aria-label="File Selector"
      className="flex min-w-0 flex-1 flex-nowrap items-center justify-start gap-3"
    >
      {/* Side Bar */}
      <button
        title="Toggle Side Bar (Access: l)"
        aria-label="Toggle Side Bar"
        accessKey="l"
        disabled={!fileName}
        className={ButtonStyle}
        onClick={() => {
          setOutlineEnabled(!outlineEnabled);
        }}
      >
        <PanelLeft className={SVGStyle} />
      </button>
      {/* Open File */}
      <button
        title="Open PDF File (Access: o)"
        aria-label="Open PDF File"
        accessKey="o"
        className={ButtonStyle}
        onClick={() => fileInputRef.current?.click()}
      >
        <FolderOpen className={SVGStyle} />
      </button>

      {/* File Input */}
      <span className="sr-only">File Input</span>
      <input
        id="file-input"
        ref={fileInputRef}
        name="file-input"
        className="hidden"
        aria-hidden="true"
        type="file"
        accept=".pdf"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
            setFile(file);
            reset();
          }
        }}
      />

      {/* File name display */}
      <span
        role="status"
        aria-label="File name"
        aria-atomic="true"
        className={`${SpanStyle} max-w-60 min-w-0 flex-1 truncate sm:max-w-[18rem] md:max-w-[24rem]`}
      >
        {fileName || 'No File Selected'}
      </span>
    </div>
  );
};

export default FileControls;
