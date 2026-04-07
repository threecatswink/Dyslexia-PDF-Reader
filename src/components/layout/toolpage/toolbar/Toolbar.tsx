import FileControls from './left/FileControls';
import PageControls from './center/PageControls';
import ZoomControls from './right/ZoomControls';
import ViewSettings from './right/ViewSettings';
const Toolbar = () => {
  return (
    <div
      id="toolbar"
      role="toolbar"
      aria-label="PDF document controls"
      className="flex w-full flex-nowrap items-center gap-2 overflow-visible bg-zinc-200 px-4 py-1.5 text-black shadow-md sm:gap-3 dark:bg-zinc-800 dark:text-white"
    >
      {/* Left of Toolbar */}
      <FileControls />

      {/* Center of Toolbar */}
      <PageControls />

      {/* Right of Toolbar */}
      <div
        role="group"
        aria-label="Zoom and Misc Options"
        className="flex flex-1 items-center justify-end gap-3"
      >
        <ZoomControls />
        <ViewSettings />
      </div>
    </div>
  );
};

export default Toolbar;
