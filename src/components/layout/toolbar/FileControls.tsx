import { ButtonStyle, SpanStyle } from '../../ui/Presets.tsx';
import { useRef } from 'react';
import { Button } from '@headlessui/react';
import { FolderOpen } from 'lucide-react';
import { useFileInformation } from '../../../states/file-information.tsx';

const FileControls = () => {
  const fileName = useFileInformation((s) => s.fileName);
  const setFile = useFileInformation((s) => s.setFile);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      role="group"
      aria-label="File Selector"
      className="flex flex-1 items-center justify-start gap-2"
    >
      {/* Open File */}
      <Button
        className={ButtonStyle}
        onClick={() => fileInputRef.current?.click()}
        accessKey="o"
        title="Open PDF File | Access: o"
        aria-label="Open PDF File"
      >
        <FolderOpen />
      </Button>

      {/* File Input */}
      <input
        name="file-input"
        id="file-input"
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
            setFile(file);
          }
        }}
      />

      {/* File name display */}
      <span role="status" aria-label="File name" className={SpanStyle}>
        {fileName}
      </span>
    </div>
  );
};

export default FileControls;
