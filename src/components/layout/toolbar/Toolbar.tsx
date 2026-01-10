import FileControls from './FileControls.tsx';
import PageControls from './PageControls.tsx';
import ZoomControls from './ZoomControls.tsx';
import ViewSettings from './ViewSettings.tsx';
const Toolbar = () => {
  return (
    <div
      id="toolbar"
      role="toolbar"
      aria-label="PDF document controls"
      className="flex w-full items-center bg-zinc-200 px-4 py-1 text-black shadow-md dark:bg-zinc-800 dark:text-white"
    >
      {/* Left of Toolbar */}
      <FileControls />

      {/* Center of Toolbar */}
      <PageControls />

      {/* Right of Toolbar */}
      <div
        role="group"
        aria-label="Zoom and Misc Options"
        className="flex flex-1 items-center justify-end gap-1"
      >
        <ZoomControls />
        <ViewSettings />
      </div>
    </div>
  );
};

export default Toolbar;
