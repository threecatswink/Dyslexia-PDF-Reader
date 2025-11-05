import Toolbar from "./Toolbar";

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Toolbar 
        onOpenFile={() => console.log("Open file")}
        onToggleDyslexiaMode={() => console.log("Toggle dyslexia mode")}
        onToggleHalfBold={() => console.log("Toggle half bold")}
        onToggleAccent={() => console.log("Toggle accent")}
        onReadAloud={() => console.log("Read aloud")}
      />

      {/* PDF viewer goes below */}
      <div className="flex-1 overflow-auto">
        {/* PDF Viewer Component coming next */}
      </div>
    </div>
  )
}


export default App
