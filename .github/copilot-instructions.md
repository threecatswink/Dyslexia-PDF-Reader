# Dyslexia PDF Reader - AI Coding Agent Instructions

## Project Overview

Dyslexia PDF Reader is an accessible web-based PDF reader designed for people with dyslexia and reading disabilities. It's a Vite + React + TypeScript web app deployed as a GitHub Pages PWA that provides text overlays with dyslexia-friendly features and browser-based text-to-speech.

**Key Technologies**: React 19, TypeScript 5.9, Tailwind CSS 4, Zustand 5 (state), react-pdf 10, Vite 7, ESLint + Prettier

## Architecture

### Core Application Flow

1. **Entry**: [App.tsx](src/App.tsx) → Routes to `/` (ToolPage) or `/about`
2. **Main Page**: [ToolPage.tsx](src/pages/ToolPage.tsx) orchestrates:
   - `Toolbar` (sticky header) - File upload, page/zoom controls, view settings
   - `Viewer` - PDF canvas rendering via react-pdf
   - `Reader` - Text-to-Speech component

### State Management (Zustand with persistence)

Two complementary stores synchronize persistent settings and PDF document state:

- **[global-states.tsx](src/states/global-states.tsx)** - User preferences (persisted to localStorage):
  - Feature toggles: `dyslexiaEnabled`, `halfBoldEnabled`, `accentEnabled`, `speakEnabled`
  - Interaction state: `currentPage`, `currentZoom` (bounds: minZoom=0.25, maxZoom=6), `playEnabled`
  - TTS data: `extractedText`, `sentences[]`, `currentSentenceIndex`

- **[file-information.tsx](src/states/file-information.tsx)** - Non-persisted PDF document state:
  - `file: File | null` - User-selected PDF file
  - `pdf: PDFDocumentProxy` - Loaded PDF document reference
  - `page: PDFPageProxy` - Current page object
  - `viewport` - Calculated page dimensions based on zoom

### PDF Rendering Pipeline

[Viewer.tsx](src/components/pdf/Viewer.tsx) handles async PDF loading and page fetching:

1. Load PDF from File → uses `pdfjs-dist` → store in `file-information`
2. Render page canvas via [Renderer.tsx](src/components/pdf/Renderer.tsx)
3. Extract text & apply dyslexia overlays via [Overlay.tsx](src/components/pdf/Overlay.tsx)

**Overlay System** ([Overlay.tsx](src/components/pdf/Overlay.tsx) + [TextHelper.tsx](src/components/pdf/overlay_components/TextHelper.tsx)):

- Conditionally renders only when `dyslexiaEnabled=true`
- Uses PDF.js text content extraction to build positioned HTML elements
- Applies OpenDyslexic font via CSS
- [HalfBold.tsx](src/components/pdf/overlay_components/HalfBold.tsx) - Bolds first half of words
- [AccentLetter.tsx](src/components/pdf/overlay_components/AccentLetter.tsx) - Enlarges first letter
- [TTSHighlight.tsx](src/components/pdf/overlay_components/TTSHighlight.tsx) - Highlights current sentence during playback

### Text-to-Speech (TTS) Integration

[TTS.tsx](src/components/layout/toolpage/tts/TTS.tsx) wraps Web Speech API:

- `tts.speak(text, onBoundary?, onEnd?)` - Plays audio with character boundary callbacks
- `onBoundary` fires at sentence/word boundaries for highlight synchronization
- [Reader.tsx](src/components/layout/toolpage/tts/Reader.tsx) manages TTS playback state and coordinates with overlay highlighting

## Key Patterns & Conventions

### Component Organization

- **Page-level** (`pages/`): Route entry points that compose major sections
- **Layout** (`components/layout/`): Structural components (toolbar, page controls)
- **Functional** (`components/pdf/`): Core rendering and interaction logic
- **Utility** (`overlay_components/`): Composable text transformation modules

### Styling Approach

- **Tailwind CSS 4** via `@tailwindcss/vite` plugin for utility classes
- **StylePresets.tsx** - Exportable Tailwind class strings for consistent button, input, span styling across toolbar components
  - `ButtonStyle` - Base button styling with hover/disabled states
  - `InputStyle` - Number/text input styling with dark mode support
  - Applied to JSX via `className={ButtonStyle}`
- **Dark mode**: Uses Tailwind dark: variant; theme color defined in vite.config.ts (`theme_color: '#0f172a'`)

### Accessibility First

- ARIA labels on all interactive elements (`role="toolbar"`, `aria-label`, `aria-labelledby`)
- Semantic HTML (`<header>`, `<main>`)
- Access key shortcuts for toolbar buttons (e.g., `accessKey="o"` for file open)
- TTS highlight integration maintains reader focus

### Type Safety

- Full TypeScript strict mode enabled via tsconfig.json
- Named types exported from components (e.g., `PDFTextItem` from TextHelper)
- Zustand stores typed with `create<StateType>()` pattern

## Development Workflow

### Build & Run

```bash
npm run dev          # Start Vite dev server (http://localhost:5173/)
npm run build        # Compile TypeScript + bundle with Vite
npm run lint         # Run ESLint + Prettier checks
npm run preview      # Preview production build locally
npm run deploy       # Build then push to gh-pages branch
```

### Code Quality

- **ESLint**: typescript-eslint + react-hooks + react-refresh plugins
- **Formatter**: Prettier with tailwindcss class sorting plugin
- **Pre-commit**: No hooks configured; lint manually before push
- **Type checking**: Run `tsc -b` (included in build script)

### Deployment

- **Target**: GitHub Pages at `https://threecatswink.github.io/Dyslexia-PDF-Reader/`
- **Base path**: Configured as `/Dyslexia-PDF-Reader/` in vite.config.ts
- **PWA**: vite-plugin-pwa auto-updates on deploy; manifest icon sizes: 192x192, 512x512

## Critical Integration Points

### PDF.js Async Loading

- PDF.js is loaded dynamically via `import()` in [Viewer.tsx](src/components/pdf/Viewer.tsx#L26) to avoid bundle size bloat
- `pdfjs-dist` types used: `PDFDocumentProxy`, `PDFPageProxy`
- Always check `pdf` exists before calling `.getPage()`

### Viewport Calculations

- Viewport object stores `{ width, height, scale }` reflecting zoom-adjusted page dimensions
- Overlay positioning relies on viewport dimensions; recalculates on zoom changes
- TTS boundary events use character indices, not pixel positions

### File Handling

- User uploads File via `<input type="file">` (FileControls)
- Converted to ArrayBuffer for PDF.js consumption
- Reset on file change to prevent stale state

## Common Tasks & Where to Find Them

| Task                        | File(s)                                                                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Add new view setting toggle | [ViewSettings.tsx](src/components/layout/toolpage/toolbar/ViewSettings.tsx), update global-states                                           |
| Modify TTS behavior         | [TTS.tsx](src/components/layout/toolpage/tts/TTS.tsx), [Reader.tsx](src/components/layout/toolpage/tts/Reader.tsx)                          |
| Style changes               | [StylePresets.tsx](src/styles/StylePresets.tsx) or tailwind className                                                                       |
| PDF rendering issue         | [Viewer.tsx](src/components/pdf/Viewer.tsx), [Renderer.tsx](src/components/pdf/Renderer.tsx), [Overlay.tsx](src/components/pdf/Overlay.tsx) |
| Accessibility improvements  | Any component with ARIA attributes; see ToolPage for semantic structure                                                                     |
| Keyboard shortcuts          | toolbar component `accessKey` attributes + README.md docs                                                                                   |
| PWA/offline features        | [vite.config.ts](vite.config.ts) PWA plugin config                                                                                          |

## Notes for AI Agents

- **State debugging**: Use React DevTools to inspect Zustand store snapshots
- **PDF.js docs**: Refer to pdfjs-dist types for `PDFPageProxy` methods (`.getTextContent()`, `.getViewport()`)
- **Tailwind versions**: Config uses Tailwind CSS 4; utility-first approach, no custom CSS outside StylePresets
- **Error handling**: Overlay rendering has cancel token logic to abort stale renders; preserve this pattern
- **Testing**: No test framework configured; additions should follow ESLint + TypeScript conventions
